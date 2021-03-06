import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Track } from "./Track";
import { User } from "./User";

interface ArtistInput {
    stageName: string,
    coverPhoto: string,
    userId : string
}

@Entity()
@ObjectType()
export class Artiste extends BaseEntity{

    @ObjectIdColumn()
    id: ObjectID

    @Field(() => [Track])
    @Column()
    tracks: [Track];

    @Column()
    userId: string;

    @Field()
    @Column()
    stageName: string;

    @Field()
    @Column()
    bio: string;

    @Field(() => User)
    user : User

    @Field()
    @Column()
    coverPhoto : string;

    @CreateDateColumn()
    dateAdded: Date;


    constructor(artisteInput : ArtistInput) {
        super();

        if (artisteInput) {
            this.coverPhoto = artisteInput.coverPhoto;
            this.stageName = artisteInput.stageName;
            this.userId = artisteInput.userId;
        }
        
    }
}

// const user = new Artiste()

