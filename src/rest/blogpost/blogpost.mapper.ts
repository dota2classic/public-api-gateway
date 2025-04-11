import { Injectable } from "@nestjs/common";
import { BlogpostEntity } from "../../entity/blogpost.entity";
import { BlogpostDto } from "./blogpost.dto";
import { ConfigService } from "@nestjs/config";
import { StorageMapper } from "../storage/storage.mapper";
import { UserProfileService } from "../../user-profile/service/user-profile.service";

@Injectable()
export class BlogpostMapper {
  constructor(
    private readonly config: ConfigService,
    private readonly storageMapper: StorageMapper,
    private readonly user: UserProfileService,
  ) {}

  public mapPost = async (post: BlogpostEntity): Promise<BlogpostDto> => ({
    id: post.id,
    content: post.content,
    renderedContentHtml: post.renderedContentHtml,
    title: post.title,
    shortDescription: post.shortDescription,
    image: this.storageMapper.mapS3Item(post.imageKey),

    published: post.published,
    author: await this.user.userDto(post.author),

    publishDate: post.publishedAt?.toISOString(),
    createdAt: post.createdAt.toISOString(),
  });
}
