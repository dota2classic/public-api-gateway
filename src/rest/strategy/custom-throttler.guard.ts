import { ThrottlerGuard } from "@nestjs/throttler";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  // Overwritten to handle the IP restriction along with firstName + lastName restriction

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.user.steam_id;
  }
}
