import "reflect-metadata";
import express from 'express'
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { BlogResolver } from "./resolvers/BlogResolver";

(async () => {
    const app = express();

    const resolvers : readonly[Function, ...Function[]] | [Function, ...Function[]] | readonly[string, ...string[]] | [string, ...string[]] =[
        BlogResolver,
        UserResolver
    ]

    app.get("/", (_, res) => {
        res.send("Hello World")
    });

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers
        })
    });

    apolloServer.applyMiddleware({app});
    
    const PORT = process.env.port || 4000

    app.listen(PORT, () => {
        console.log(`Server Started at port http://localhost:${PORT}`);
    })
})();