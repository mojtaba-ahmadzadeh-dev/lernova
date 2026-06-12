import { Column, Entity, ManyToOne } from "typeorm";

import { BlogEntity } from "./blog.entity";
import { BaseEntity } from "common/abestract/base.entity";
import { EntityNames } from "common/enums/entity.enum";
import { UserEntity } from "modules/user/entities/user.entity";


@Entity(EntityNames.BlogBookmarks)
export class BlogBookmarkEntity extends BaseEntity {
    @Column()
    blogId:number;
    @Column()
    userId:string;
    @ManyToOne(() => UserEntity, user => user.blog_bookmarks, { onDelete: "CASCADE" })
    user:UserEntity;
    @ManyToOne(() => BlogEntity, blog => blog.bookmarks, { onDelete: "CASCADE" })
    blog:BlogEntity;
}