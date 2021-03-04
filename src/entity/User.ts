import { IsEmail, IsNotEmpty } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import {Entity, ObjectIdColumn, ObjectID, Column, BaseEntity } from "typeorm";
import { Blog } from "./Blog";


interface UserInput {
    userName: string,
    email: string,
    password : string
}

@Entity()
@ObjectType()
export class User extends BaseEntity{

    @ObjectIdColumn()
    id: ObjectID;

    @Field()
    @Column()
    @IsNotEmpty()
    userName: string;

    @Field()
    @Column()
    @IsEmail()
    email: string;

    @Column()
    password : string

    @Field(() => [Blog])
    @Column()
    blogs : [Blog]
    
    constructor(userInput: UserInput) {
        super();

        if (userInput) {
            const { userName, email, password } = userInput;
            
            this.userName = userName;
            this.email = email;
            this.password = password;
        }
    }

}
