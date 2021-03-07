import "reflect-metadata";
import "dotenv/config";
import express from 'express'
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from 'cors'
import tokenRouter from "./routes/tokenRoute";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import RootResolver from "./resolvers/RootResolver";

(async () => {
    const app = express();

    app.use(cookieParser())

    app.use(
        cors({
          origin: "http://localhost:3000",
          credentials: true
        })
    );
    
    app.use("/",tokenRouter);


    app.get("/", (_, res) => {
        res.send("Hello World")
    });

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers : RootResolver
        }),
        context : ({req, res}) => ({ req, res })
    });

    apolloServer.applyMiddleware({ app, cors: false });
    
    const httpServer = createServer(app);

    await apolloServer.installSubscriptionHandlers(httpServer);
    
    const PORT = process.env.port || 4000

    httpServer.listen(PORT, () => {
        console.log(`Server Started at port http://localhost:${PORT}`);
    })
})();