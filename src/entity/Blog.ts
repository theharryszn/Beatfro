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

    @Field(() => User)
    @Column(() => User)
    postedBy: User
    
    @Field(() => Date)
    @CreateDateColumn()
    dateAdded : Date
    

    constructor(blogInput : BlogInput) {
        super();
        
        if (blogInput) {
            this.caption = blogInput.caption;
        }
    }
}