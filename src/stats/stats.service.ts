import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { QueueTimeDto } from "./stats.dto";
import { range } from "../utils/range";
import { MatchmakingMode } from "../gateway/shared-types/matchmaking-mode";
import { avg } from "../utils/average";
import { PrometheusDriver } from "prometheus-query";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { MaintenanceEntity } from "../database/entities/maintenance.entity";
import { DemoHighlightsEntity } from "../database/entities/demo-highlights.entity";
import { Repository } from "typeorm";

@Injectable()
export class StatsService implements OnApplicationBootstrap {
  constructor(
    private readonly prom: PrometheusDriver,
    @InjectRepository(MaintenanceEntity)
    private readonly maintenanceRepository: Repository<MaintenanceEntity>,
    @InjectRepository(DemoHighlightsEntity)
    private readonly demoHighlightsRepository: Repository<DemoHighlightsEntity>,
  ) {}

  private _stats: [number, QueueTimeDto[]][] = [];

  get stats(): [number, QueueTimeDto[]][] {
    return this._stats;
  }

  async onApplicationBootstrap() {
    await this.refreshQueueStats();
  }

  async getMaintenance(): Promise<{ active: boolean }> {
    const m = await this.maintenanceRepository.find({});
    return { active: m.length > 0 && m[0].active };
  }

  async getHighlights(matchId: number): Promise<DemoHighlightsEntity> {
    return this.demoHighlightsRepository.findOneBy({ matchId });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  private async refreshQueueStats() {
    this._stats = await this.queueTimesChart();
  }

  private async queueTimesChart(
    utcDayOfWeek = new Date().getUTCDay(),
  ): Promise<[number, QueueTimeDto[]][]> {
    return Promise.all(
      range(24).map(async (utcHour) => [
        utcHour,
        await this.queueTimes(utcHour, utcDayOfWeek),
      ]),
    );
  }

  private async queueTimes(
    utcHour = new Date().getUTCHours(),
    utcDayOfWeek = new Date().getUTCDay(),
  ): Promise<QueueTimeDto[]> {
    try {
      const start = Date.now() - 1000 * 60 * 60 * 24 * 14; // 2 weeks ago
      const end = new Date();
      const step = 60 * 30; // 1 point every 6 hours

      const some = await this.prom.rangeQuery(
        `(rate(d2c_queue_time_sum[1h] ) / rate(d2c_queue_time_count[1h])) and on () (hour() == ${utcHour} and day_of_week() == ${utcDayOfWeek})`,
        start,
        end,
        step,
      );

      return some.result.map((result) => {
        const numbers = result.values
          .filter((t) => t.value !== null && !Number.isNaN(t.value))
          .map((v) => v.value / 1000);
        return {
          mode: Number(result.metric.labels.mode) as MatchmakingMode,
          queueTime: avg(numbers),
        };
      });
    } catch (e) {
      return [];
    }
  }
}
