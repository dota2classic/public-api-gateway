import { UserDTO } from "../shared.dto";
import { UploadedImageDto } from "../storage/storage.dto";
import { Page } from "../../gateway/shared-types/page";

export class UpdateBlogpostDraftDto {
  id?: number;

  content: string;
  title: string;
  shortDescription: string;
  imageKey?: string;
}

export class BlogpostDto {
  id: number;
  content: string;
  title: string;
  shortDescription: string;
  image: UploadedImageDto;

  published: boolean;
  author: UserDTO;

  publishDate: string;
  createdAt: string;
}

export class BlogPageDto implements Page<BlogpostDto> {
  page: number;
  perPage: number;
  pages: number;
  data: BlogpostDto[];
}
