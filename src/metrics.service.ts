import { Injectable } from "@nestjs/common";
import { Gauge } from "prom-client";

@Injectable()
export class MetricsService {
  private onlineGauge: Gauge<string>;

  constructor() {
    this.onlineGauge = new Gauge({
      name: "api_online",
      help: "help",
    });
  }

  public recordOnline(online: number) {
    this.onlineGauge.set(online);
  }

  // @Cron(CronExpression.EVERY_4_HOURS)
  // private async resetMetrics() {
  //   this.onlineGauge.reset();
  // }
}
