import express from "express";
import {createClient} from 'redis';

const app = express();
app.use(express.json());

const redisClient = createClient();
redisClient.on('error', (err) => console.error('Redis Client Error', err));

app.post("/submit",async(req,res)=>{
    const prblmId= req.body.prblmId;
    const code=req.body.code;
    const language= req.body.language;

    try{
        await redisClient.lPush("Problems",
            JSON.stringify({code,language,prblmId}));
        res.status(200).send("Submission received and stored");
    }catch(err){
        console.error("Redis error :", err);
        res.status(500).send("Failure in storing code");
    }
})

async function startServer(){
    try{
        await redisClient.connect();
        console.log("Connected to Redis");

        app.listen(3000,()=>{
            console.log("Server is up and running on port 3000");
        })

    }catch(err){
        console.error("Failed connecting to redis")
    }
}
startServer();
