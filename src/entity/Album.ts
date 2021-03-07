import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Artiste } from "./Artiste";
import { Track } from "./Track";


interface AlbumInput {
    title: string,
    coverPhoto: string,
    artisteId: string,
    genre?: string,
}

@Entity()
@ObjectType()
export class Album extends BaseEntity{

    @ObjectIdColumn()
    id: ObjectID;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    coverPhoto: string;

    @Field(() => Artiste, { nullable : true })
    artiste: Artiste;

    @Field()
    @Column()
    genre: string;
    
    @Column()
    artisteId: string;

    @Column()
    tracksRefID : string

    @Field(() => [Track])
    tracks : [Track]

    @Field()
    @CreateDateColumn()
    dateAdded: Date;

    constructor(albumInput : AlbumInput) {
        super();

        if (albumInput) {
            this.title = albumInput.title;
            this.artisteId = albumInput.artisteId;
            this.coverPhoto = albumInput.coverPhoto;
            this.genre = albumInput.genre || ""
        }
    }
}