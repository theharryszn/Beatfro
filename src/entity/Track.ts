import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Album } from "./Album";
import { Artiste } from "./Artiste";
import { Lyric } from "./Lyric";


interface TrackInput {
    title: string,
    coverPhoto: string,
    song: string,
    artisteId: string,
    albumName: string,
    albumId?: string,
    genre?: string,
    positionInAlbum? : number
}


@ObjectType()
@Entity()
export class Track extends BaseEntity {

    @ObjectIdColumn()
    id: ObjectID;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    coverPhoto: string;

    @Field(() => Artiste, { nullable : true })
    artiste: Artiste
    
    @Column()
    artisteId: string;

    @Field()
    @Column()
    song: string;

    @Field()
    @Column()
    genre: string;

    @Field()
    @Column()
    albumName: string = "Single";

    @Field(() => Album, { nullable : true })
    album : Album

    @Column()
    albumId: string;

    @Field(() => Int, { nullable : true })
    @Column("int", { nullable : true })
    positionInAlbum : number | null

    @Field()
    @CreateDateColumn()
    dateAdded: Date;

    @Field(() => Lyric,{ nullable : true})
    lyric: Lyric
    
    @Column({ nullable : true })
    lyricsId : string | null = null

    constructor(trackInput : TrackInput) {
        super();

        if (trackInput) {
            this.title = trackInput.title;
            this.coverPhoto = trackInput.coverPhoto;
            this.song = trackInput.song;
            this.albumName = trackInput.albumName;
            this.artisteId = trackInput.artisteId;
            this.albumId = trackInput.albumId || "";
            this.genre = trackInput.genre || "";
            this.positionInAlbum = trackInput.positionInAlbum || null;
        }
        // Do Something
    }
}