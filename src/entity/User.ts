import { IsEmail, IsNotEmpty } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import {Entity, ObjectIdColumn, ObjectID, Column, BaseEntity, CreateDateColumn } from "typeorm";
import { Blog } from "./Blog";


interface UserInput {
    userName: string,
    email: string,
    password : string
}

@Entity()
@ObjectType()
export class User extends BaseEntity{

    @Field(() => String)
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
    password: string;

    @Field()
    @Column()
    profilePhoto: string;

    @Field()
    @Column()
    isArtiste: boolean = false;

    @Field()
    @Column()
    isVerified: boolean = false;

    @Field()
    @Column()
    isPremium: boolean = false;

    @Field(() => [Blog])
    @Column()
    blogs: [Blog]
    
    @Column("int", { default: 0 })
    tokenVersion: number = 0;

    @Field(() => Date)
    @CreateDateColumn()
    dateJoined : Date
    
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
