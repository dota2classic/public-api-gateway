import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { GameResultsEvent } from "../gateway/events/gs/game-results.event";
import { MetricsService } from "../metrics.service";
import ss from "simple-statistics";
import { PrometheusDriver } from "prometheus-query";
import { Gauge } from "prom-client";
import { MatchmakingMode } from "../gateway/shared-types/matchmaking-mode";
import { Logger } from "@nestjs/common";
import { Retry } from "../utils/retry";

@EventsHandler(GameResultsEvent)
export class SRCDSPerformanceHandler
  implements IEventHandler<GameResultsEvent>
{
  private logger = new Logger(SRCDSPerformanceHandler.name);

  // FPS
  private averageFPS: Gauge<string>;
  private medianFPS: Gauge<string>;
  private fpsStddev: Gauge<string>;
  private p95FPS: Gauge<string>;
  private p99FPS: Gauge<string>;
  private fpsJitter: Gauge<string>;
  private fpsPercent: Gauge<string>;

  // PING
  private averagePing: Gauge<string>;
  private medianPing: Gauge<string>;
  private pingStddev: Gauge<string>;
  private p95Ping: Gauge<string>;
  private p99Ping: Gauge<string>;
  private pingJitter: Gauge<string>;

  // LOSS
  private averageLoss: Gauge<string>;
  private medianLoss: Gauge<string>;
  private lossStddev: Gauge<string>;
  private p95Loss: Gauge<string>;
  private p99Loss: Gauge<string>;
  private lossJitter: Gauge<string>;

  constructor(
    private readonly metrics: MetricsService,
    private readonly prom: PrometheusDriver,
  ) {
    this.averageFPS = new Gauge({
      name: "srcds_fps_average",
      help: "Average FPS of a match",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.medianFPS = new Gauge({
      name: "srcds_fps_median",
      help: "Median FPS of a match",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.fpsStddev = new Gauge({
      name: "srcds_fps_stddev",
      help: "stddev FPS of a match",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.p95FPS = new Gauge({
      name: "srcds_fps_p95",
      help: "0.95 percentile FPS",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.p99FPS = new Gauge({
      name: "srcds_fps_p99",
      help: "0.99 percentile FPS",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.fpsJitter = new Gauge({
      name: "srcds_fps_jitter",
      help: "FPS jitter",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.fpsPercent = new Gauge({
      name: "srcds_fps_percent",
      help: "Percent of desired fps",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    //   Ping
    this.averagePing = new Gauge({
      name: "srcds_ping_average",
      help: "Average Ping of a match",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.medianPing = new Gauge({
      name: "srcds_ping_median",
      help: "Median Ping of a match",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.pingStddev = new Gauge({
      name: "srcds_ping_stddev",
      help: "stddev Ping of a match",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.p95Ping = new Gauge({
      name: "srcds_ping_p95",
      help: "0.95 percentile Ping",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.p99Ping = new Gauge({
      name: "srcds_ping_p99",
      help: "0.99 percentile ping",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.pingJitter = new Gauge({
      name: "srcds_ping_jitter",
      help: "Ping jitter",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    //   Loss
    this.averageLoss = new Gauge({
      name: "srcds_loss_average",
      help: "Average Loss of a match",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.medianLoss = new Gauge({
      name: "srcds_loss_median",
      help: "Median Loss of a match",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.lossStddev = new Gauge({
      name: "srcds_loss_stddev",
      help: "stddev Loss of a match",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.p95Loss = new Gauge({
      name: "srcds_loss_p95",
      help: "0.95 percentile loss",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.p99Loss = new Gauge({
      name: "srcds_loss_p99",
      help: "0.99 percentile loss",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });

    this.lossJitter = new Gauge({
      name: "srcds_loss_jitter",
      help: "Loss jitter",
      labelNames: ["match_id", "host", "ip", "mode", "region"],
    });
  }

  async handle(event: GameResultsEvent) {
    try {
      this.logger.log("Match finished: calculating performance metrics");
      const end = new Date(event.timestamp - 1000 * 60); // 1 minute end subtract
      const start = new Date(end.getTime() - event.duration * 1000 + 1000 * 60);

      const host = event.server.split(":")[0];
      const labels: string[] = [
        event.matchId.toString(),
        host,
        event.server,
        event.type.toString(),
        event.region.toString(),
      ];

      await Promise.all([
        this.fpsMetrics(event, start, end, labels),
        this.pingMetrics(event, start, end, labels),
        this.lossMetrics(event, start, end, labels),
      ]);

      this.logger.log("Metrics for gameserver successfully calculated");
    } catch (e) {
      console.error(e);
      this.logger.error("There was issue calculating metrics!", e);
    }
  }

  // Calculate ping metrics
  @Retry(3)
  private async pingMetrics(
    event: GameResultsEvent,
    start: Date,
    end: Date,
    labels: string[],
  ) {
    const step = 15; // 1 point every 6 hours

    const query = `avg_over_time ( srcds_metrics_fps{match_id="${event.matchId}"}[15s] )`;

    const result = await this.prom.rangeQuery(query, start, end, step);

    const data = result.result[0].values.map((value) => value.value);
    const aggregates = this.calcAggregates(data, false);

    // Aggregates
    this.p95Ping.labels(...labels).set(aggregates.p95);
    this.p99Ping.labels(...labels).set(aggregates.p99);
    this.averagePing.labels(...labels).set(aggregates.avg);
    this.medianPing.labels(...labels).set(aggregates.median);
    this.pingStddev.labels(...labels).set(aggregates.std);
    this.pingJitter.labels(...labels).set(aggregates.jitter);
  }

  // Calculate ping metrics
  @Retry(3)
  private async lossMetrics(
    event: GameResultsEvent,
    start: Date,
    end: Date,
    labels: string[],
  ) {
    const step = 15; // 1 point every 6 hours

    const query = `avg_over_time ( srcds_metrics_loss{match_id="${event.matchId}"}[15s] )`;

    const result = await this.prom.rangeQuery(query, start, end, step);

    const data = result.result[0].values.map((value) => value.value);
    const aggregates = this.calcAggregates(data, false);

    // Aggregates
    this.p95Loss.labels(...labels).set(aggregates.p95);
    this.p99Loss.labels(...labels).set(aggregates.p99);
    this.averageLoss.labels(...labels).set(aggregates.avg);
    this.medianLoss.labels(...labels).set(aggregates.median);
    this.lossStddev.labels(...labels).set(aggregates.std);
    this.lossJitter.labels(...labels).set(aggregates.jitter);
  }

  // Calculates FPS related metrics
  @Retry(3)
  private async fpsMetrics(
    event: GameResultsEvent,
    start: Date,
    end: Date,
    labels: string[],
  ) {
    const step = 15; // 1 point every 6 hours

    const baselineFps =
      event.type === MatchmakingMode.UNRANKED ||
      event.type === MatchmakingMode.LOBBY
        ? 40
        : 30;

    const query = `avg_over_time ( srcds_metrics_fps{match_id="${event.matchId}"}[15s] )`;

    const result = await this.prom.rangeQuery(query, start, end, step);

    const fps = result.result[0].values.map((value) => value.value);

    const fpsAggregates = this.calcAggregates(fps, true);

    // Aggregates
    this.p95FPS.labels(...labels).set(fpsAggregates.p95);
    this.p99FPS.labels(...labels).set(fpsAggregates.p99);
    this.averageFPS.labels(...labels).set(fpsAggregates.avg);
    this.medianFPS.labels(...labels).set(fpsAggregates.median);
    this.fpsStddev.labels(...labels).set(fpsAggregates.std);
    this.fpsJitter.labels(...labels).set(fpsAggregates.jitter);

    // FPS percent
    const drops = fps.filter((f) => f < baselineFps * 0.95).length;
    this.fpsPercent.labels(...labels).set(drops / fps.length);
  }

  private calcAggregates(metrics: number[], inversePercentile = true) {
    const jitter = metrics.slice(1).map((v, i) => Math.abs(v - metrics[i]));

    return {
      avg: ss.mean(metrics),
      median: ss.median(metrics),
      std: ss.standardDeviation(metrics),
      jitter: ss.average(jitter),
      p95: ss.quantile(metrics, inversePercentile ? 0.05 : 0.95),
      p99: ss.quantile(metrics, inversePercentile ? 0.01 : 0.99),
    };
  }
}
