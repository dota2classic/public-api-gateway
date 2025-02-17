import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({
  name: "blogpost_entity",
})
export class BlogpostEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "title" })
  title: string;

  @Column({ name: "image_key" })
  imageKey: string;

  @Column({
    type: "text",
    name: "short_description",
    default: "",
  })
  shortDescription: string;

  @Column({
    type: "text",
    name: "content",
  })
  content: string;

  @Column({
    type: "text",
    name: "rendered_content_html",
    default: "",
  })
  renderedContentHtml: string;

  @Column()
  author: string;

  @Column({ name: "published", default: false })
  published: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "publish_date", nullable: true, default: null })
  publishedAt?: Date;
}
