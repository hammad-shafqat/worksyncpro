import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/index.js";

dotenv.config({
    path: './.env'
});

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listning on port: ${port}`);
        })
    })
    .catch((err) => {
        console.log(`Mongodb connection error: ${err}`);
        process.exit(1);
    })


// console.log("My port: ", process.env.PORT);