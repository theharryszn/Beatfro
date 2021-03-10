import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Track } from "./Track";
import { User } from "./User";


interface BlogInput {
    caption: string,
    postedById: string,
    pinnedTrackId?: string
}

@Entity()
@ObjectType()
export class Blog extends BaseEntity{

    @Field(() => String)
    @ObjectIdColumn()
    id: ObjectID;

    @Field()
    @Column()
    caption: String;

    // update in resolver 
    @Field(() => User, { nullable : true })
    postedBy: User
    
    @Field(() => Date)
    @CreateDateColumn()
    dateAdded: Date;

    @Field(() => Track, { nullable : true })
    pinnedTrack: Track
    
    @Column()
    pinnedTrackId : string

    //am not sure
    @Column()
    postedById: string;
    
    constructor(blogInput : BlogInput) {
        super();
        
        if (blogInput) {
            this.caption = blogInput.caption;
            this.postedById = blogInput.postedById;
            this.pinnedTrackId = blogInput.pinnedTrackId || ""
        }
    }
}