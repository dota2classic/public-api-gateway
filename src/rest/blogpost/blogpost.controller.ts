import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminGuard, WithUser } from "../../utils/decorator/with-user";
import {
  BlogPageDto,
  BlogpostDto,
  UpdateBlogpostDraftDto,
} from "./blogpost.dto";
import { BlogpostEntity } from "../../entity/blogpost.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { BlogpostMapper } from "./blogpost.mapper";
import { WithPagination } from "../../utils/decorator/pagination";
import { NullableIntPipe } from "../../utils/pipes";
import { makePage } from "../../gateway/util/make-page";
import { ForumApi } from "../../generated-api/forum";
import { ThreadType } from "../../gateway/shared-types/thread-type";

@Controller("blog")
@ApiTags("blog")
export class BlogpostController {
  constructor(
    @InjectRepository(BlogpostEntity)
    private readonly blogpostEntityRepository: Repository<BlogpostEntity>,
    private readonly mapper: BlogpostMapper,
    private readonly forumApi: ForumApi,
  ) {}

  @AdminGuard()
  @WithUser()
  @Patch()
  public async updatePostDraft(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: UpdateBlogpostDraftDto,
  ): Promise<BlogpostDto> {
    let blogpost: BlogpostEntity;
    if (dto.id) {
      blogpost = await this.blogpostEntityRepository.findOneOrFail({
        where: { id: dto.id },
      });
    } else {
      blogpost = new BlogpostEntity();
      blogpost.author = user.steam_id;
      blogpost.imageKey = `upload/dotaold.jpg`; // Very bad hack but wcyd
    }
    blogpost.content = dto.content;
    blogpost.renderedContentHtml = dto.renderedContentHtml;
    if (dto.imageKey) {
      blogpost.imageKey = dto.imageKey;
    }
    blogpost.title = dto.title;
    blogpost.shortDescription = dto.shortDescription;

    return this.blogpostEntityRepository
      .save(blogpost)
      .then(this.mapper.mapPost);
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/publish")
  public async publishDraft(
    @CurrentUser() user: CurrentUserDto,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<BlogpostDto> {
    const blog = await this.blogpostEntityRepository.findOneOrFail({
      where: { id },
    });

    if (blog.published) return this.mapper.mapPost(blog);

    blog.published = true;
    blog.publishedAt = new Date();
    await this.forumApi.forumControllerGetThreadForKey({
      threadType: ThreadType.BLOGPOST,
      externalId: blog.id.toString(),
      title: blog.title,
    });
    return this.blogpostEntityRepository.save(blog).then(this.mapper.mapPost);
  }

  @Get("/:id")
  public async getBlogpost(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<BlogpostDto> {
    return this.blogpostEntityRepository
      .findOneOrFail({
        where: { id, published: true },
      })
      .then(this.mapper.mapPost);
  }

  @AdminGuard()
  @WithUser()
  @Get("/draft/:id")
  public async getBlogpostDraft(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<BlogpostDto> {
    return this.blogpostEntityRepository
      .findOne({
        where: { id },
      })
      .then(this.mapper.mapPost);
  }

  @WithPagination()
  @Get()
  public async blogPage(
    @Query("page", ParseIntPipe) page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 25,
  ): Promise<BlogPageDto> {
    const [data, total] = await this.blogpostEntityRepository.findAndCount({
      order: {
        publishedAt: "DESC",
      },
      where: {
        published: true,
      },
      take: perPage,
      skip: page * perPage,
    });
    return makePage(data, total, page, perPage, this.mapper.mapPost);
  }
}

// upload/image.png
