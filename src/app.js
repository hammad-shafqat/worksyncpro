import express from "express";
import cors from "cors";

const app = express();


//express basic configuration 

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static("public"));


//cors configuration

app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

//healthcheck route
import healthCheckRouter from './routes/healthcheck.routes.js';

app.use('/api/v1/healthcheck', healthCheckRouter);

// app.get('/hammad', (req, res)=>{
//     res.send("Hello form me!!!!!")
// })

export default app;