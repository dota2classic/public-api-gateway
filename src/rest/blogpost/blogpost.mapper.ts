import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../cache/user/user.repository";
import { BlogpostEntity } from "../../entity/blogpost.entity";
import { BlogpostDto } from "./blogpost.dto";
import { ConfigService } from "@nestjs/config";
import { StorageMapper } from "../storage/storage.mapper";

@Injectable()
export class BlogpostMapper {
  constructor(
    private readonly urep: UserRepository,
    private readonly config: ConfigService,
    private readonly storageMapper: StorageMapper,
  ) {}

  public mapPost = async (post: BlogpostEntity): Promise<BlogpostDto> => ({
    id: post.id,
    content: post.content,
    renderedContentHtml: post.renderedContentHtml,
    title: post.title,
    shortDescription: post.shortDescription,
    image: this.storageMapper.mapS3Item(post.imageKey),

    published: post.published,
    author: await this.urep.userDto(post.author),

    publishDate: post.publishedAt?.toISOString(),
    createdAt: post.createdAt.toISOString(),
  });
}
