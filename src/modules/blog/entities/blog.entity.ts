import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { BlogCategoryEntity } from "./blog-category.entity";
import { BlogLikesEntity } from "./blog-likes.entity";
import { BlogBookmarkEntity } from "./blog-bookmark.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BaseEntity } from "common/abestract/base.entity";
import { BlogStatus } from "common/decorator/status.enum";
import { UserEntity } from "modules/user/entities/user.entity";
import { CommentEntity } from "modules/comment/entities/comment.entity";


@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;
  @Column({ length: 500 })
  description: string;
  @Column({ type: "varchar" })
  content: string;
  @Column()
  image: string;
  @Column({ nullable: true })
  imageKey: string;
  @Column({ unique: true })
  slug: string;
  @Column()
  time_for_stady: string;
  @Column({ default: BlogStatus.Draft })
  status: string;
  @Column({ default: 0 })
  view: number;
  @Column()
  authorId: string;
  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: "CASCADE" })
  author: UserEntity;
  @OneToMany(() => BlogCategoryEntity, (category) => category.blog)
  categories: BlogCategoryEntity[];
  @OneToMany(() => BlogLikesEntity, (like) => like.blog)
  likes: BlogLikesEntity[];
  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog)
  bookmarks: BlogBookmarkEntity[];
  @OneToMany(() => CommentEntity, (comment) => comment.blog)
  comments: CommentEntity[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
