import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { otpEntity } from "./otp.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BaseEntity } from "common/abestract/base.entity";
import { CourseEntity } from "modules/course/entities/course.entity";
import { RoleEntity } from "modules/rbac/entities/role.entity";
import { BlogEntity } from "modules/blog/entities/blog.entity";
import { BlogLikesEntity } from "modules/blog/entities/blog-likes.entity";
import { BlogBookmarkEntity } from "modules/blog/entities/blog-bookmark.entity";
import { CommentEntity } from "modules/comment/entities/comment.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ unique: true, nullable: true })
  mobile: string;
  @Column({ nullable: true })
  fullName: string;
  @Column({ select: false, nullable: true })
  password: string;
  @Column({ default: false })
  isBanned: boolean;
  @ManyToOne(() => RoleEntity, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;
  @Column()
  role_id: string;
  @Column({ nullable: true })
  avatar?: string;
  @Column({ default: false })
  isVerified: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => otpEntity, (otp) => otp.user)
  otps: otpEntity[];
  @OneToMany(() => CourseEntity, (course) => course.teacher, { cascade: true })
  taughtCourses: CourseEntity[];
  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];
  @OneToMany(() => BlogLikesEntity, (like) => like.user)
  blog_likes: BlogLikesEntity[];
  @OneToMany(() => BlogBookmarkEntity, (bookmarks) => bookmarks.user)
  blog_bookmarks: BlogBookmarkEntity[];
  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];
}
