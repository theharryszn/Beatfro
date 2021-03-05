import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { User } from "./User";


interface BlogInput {
    caption: string
}

@Entity()
@ObjectType()
export class Blog extends BaseEntity{

    @ObjectIdColumn()
    id: ObjectID;

    @Field()
    @Column()
    caption: String;

    // update in resolver 
    @Field(() => User)
    @Column(() => User)
    postedBy: User
    
    @Field(() => Date)
    @CreateDateColumn()
    dateAdded: Date;

    //am not sure
    @ObjectIdColumn()
    postedById: ObjectID;
    
    constructor(blogInput : BlogInput) {
        super();
        
        if (blogInput) {
            this.caption = blogInput.caption;
        }
    }
}