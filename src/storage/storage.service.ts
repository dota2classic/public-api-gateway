import { Injectable } from "@nestjs/common";
import * as sharp from "sharp";

@Injectable()
export class StorageService {
  public async prepareImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp().toBuffer();
  }
}
