import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from "typeorm";
import { Track } from "./Track";
import { User } from "./User";

interface LyricInput {
    body: string,
    addedBy: string
}

@Entity()
@ObjectType()
export class Lyric extends BaseEntity {

    @ObjectIdColumn()
    id: ObjectID
    
    @Field(() => Track, { nullable: true })
    @Column(() => Track)
    song: Track;

    @Field()
    @Column()
    body : string

    @Column()
    songId: string
    
    @Field(() => User, { nullable: true })
    addedBy: User

    @Column()
    addedByUserId : string
    
    @Field()
    @CreateDateColumn()
    dateAdded: Date;

    @Field()
    @UpdateDateColumn()
    dateUpdated: Date;
    
    constructor(lyricInput : LyricInput) {
        super();

        if (lyricInput) {
            this.body = lyricInput.body;
            this.addedByUserId = lyricInput.addedBy
        }
    }
}