import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Track } from "./Track";
// import { User } from "./User";

@Entity()
@ObjectType()
export class Lyric extends BaseEntity {

    @ObjectIdColumn()
    id: ObjectID
    
    @Field(() => Track)
    @Column(() => Track)
    song: Track

    // @Column(() => ObjectID)
    // songId: ObjectID
    
    // @Field(() => User)
    // @Column(() => User)
    // addedBy : User
    
    constructor() {
        super()
    }
}