import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Track } from "./Track";

@Entity()
@ObjectType()
export class Artiste extends BaseEntity{

    @ObjectIdColumn()
    id: ObjectID

    @Field(() => [Track])
    @Column()
    tracks: [Track];


    constructor() {
        super();
    }
}

// const user = new Artiste()

