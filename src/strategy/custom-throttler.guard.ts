import { ThrottlerGuard } from "@nestjs/throttler";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // If authenticated → rate limit by steam_id
    if (req.user?.steam_id) {
      return `steam:${req.user.steam_id}`;
    }

    // Fallback to IP
    return `ip:${req.ip}`;
  }
}
