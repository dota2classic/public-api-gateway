import { DotaTeam } from "../../gateway/shared-types/dota-team";

export class UploadedImageDto {
  url: string;
  key: string;
}

export class UploadedImagePageDto {
  items: UploadedImageDto[];
  ctoken?: string;
}

export class LogLineDto {
  author: string;
  team: DotaTeam;
  say: string;
  allChat: boolean;
}
