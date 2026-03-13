import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UploadedImageDto } from "./storage.dto";

@Injectable()
export class StorageMapper {
  constructor(private readonly config: ConfigService) {}

  public mapS3Item = (key: string): UploadedImageDto => ({
    url: `${this.config.get("api.s3root")}/${this.config.get("s3.bucket")}/${key}`,
    key: key,
  });
}
