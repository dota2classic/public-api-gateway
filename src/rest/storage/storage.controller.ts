import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ModeratorGuard, WithUser } from "../../utils/decorator/with-user";
import { FileInterceptor } from "@nestjs/platform-express";
import { InjectS3, S3 } from "nestjs-s3";
import {
  ListObjectsV2CommandInput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { UploadedImageDto, UploadedImagePageDto } from "./storage.dto";
import { calculateHashForBuffer } from "../../utils/hashbuffer";
import { StorageService } from "./storage.service";
import { StorageMapper } from "./storage.mapper";

interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@UseInterceptors(ReqLoggingInterceptor)
@Controller("storage")
@ApiTags("storage")
export class StorageController {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly config: ConfigService,
    private readonly mapper: StorageMapper,
    private readonly storageService: StorageService,
  ) {}

  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  @ModeratorGuard()
  @WithUser()
  @UseInterceptors(FileInterceptor("file"))
  @Post("upload")
  public async uploadImage(
    // @Query("width", NullableIntPipe) width: number,
    @UploadedFile() file: IFile,
  ): Promise<UploadedImageDto> {
    const hash = await calculateHashForBuffer(file.buffer);

    const newBody = await this.storageService.prepareImage(file.buffer);

    const Key = this.config.get("s3.uploadPrefix") + `${hash}.webp`;

    const putObjectCommandInput: PutObjectCommandInput = {
      Bucket: this.config.get("s3.bucket"),
      Key,
      Body: newBody,
      ContentType: file.mimetype,
      ACL: "public-read",

      Metadata: {
        originalName: file.originalname,
      },
    };

    await this.s3.putObject(putObjectCommandInput);

    return this.mapper.mapS3Item(Key);
  }

  @ApiQuery({
    name: "ctoken",
    required: false,
  })
  @Get()
  public async getUploadedFiles(
    @Query("ctoken") ctoken?: string,
  ): Promise<UploadedImagePageDto> {
    const response = await this.s3.listObjectsV2({
      Bucket: this.config.get("s3.bucket"),
      Prefix: this.config.get("s3.uploadPrefix"),
      ContinuationToken: ctoken,
      MaxKeys: 50,
    } satisfies ListObjectsV2CommandInput);

    return {
      items: response.Contents.map((it) => it.Key).map(this.mapper.mapS3Item),
      ctoken: response.ContinuationToken,
    };
  }
}
