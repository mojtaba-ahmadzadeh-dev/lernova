import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BaseEntity } from "common/abestract/base.entity";
import { UserEntity } from "modules/user/entities/user.entity";


@Entity(EntityNames.BlogLikes)
export class BlogLikesEntity extends BaseEntity {
    @Column()
    blogId:number;
    @Column()
    userId:string;
    @ManyToOne(() => UserEntity, user => user.blog_likes, { onDelete: "CASCADE" })
    user:UserEntity;
    @ManyToOne(() => BlogEntity, blog => blog.likes, { onDelete: "CASCADE" })
    blog:BlogEntity;
}