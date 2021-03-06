import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Artiste } from "./Artiste";
// import { Lyric } from "./Lyric";

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

    @Field(() => Artiste)
    artiste: Artiste
    
    @Column()
    artisteId : string

    // @Field(() => Lyric)
    // @Column(() => Lyric)
    // lyric : Lyric

    constructor() {
        super();

        // Do Something
    }
}