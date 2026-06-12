import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { PartialType } from "@nestjs/swagger";
import { EntityNames } from "common/enums/entity.enum";
import { BaseEntity } from "common/abestract/base.entity";
import { ChapterEntity } from "modules/chapter/entities/chapter.entity";

@Entity(EntityNames.Sesstion)
export class SesstionEntity extends BaseEntity {
    @Column({ type: "varchar", length: 255 })
    title:string;
    @Column()
    videoUrl:string;
    @Column()
    order:number;
    @Column({ default: false })
    isFree:boolean;
    @Column({ type: "varchar" })
    duration:string;
    @ManyToOne(() => ChapterEntity, chapter => chapter.sesstions, { onDelete: "CASCADE" })
    chapter:ChapterEntity;
    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updatedAt:Date;
}

export class UpdateSesstionDto extends PartialType(SesstionEntity) {}