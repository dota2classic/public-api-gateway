import { Injectable } from "@nestjs/common";
import { UserProfileService } from "../../service/user-profile.service";
import { FullStreamInfo } from "../twitch.service";
import { TwitchStreamDto } from "./stats.dto";

@Injectable()
export class StatsMapper {
  constructor(private readonly user: UserProfileService) {}

  public mapStream = async (it: FullStreamInfo): Promise<TwitchStreamDto> => {
    return {
      user: await this.user.userDto(it.steamId),
      viewers: it.stream.viewer_count,
      title: it.stream.title,
      link: `https://twitch.tv/${it.stream.user_login}`,
      preview: it.stream.thumbnail_url
        .replace("{width}", "650")
        .replace("{height}", "400"),
    };
  };
}
