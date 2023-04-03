import express from 'express';
import db from './config/dbConnect.js';
import routes from './routes/index.js';
import cors from 'cors';

db.on("error", console.log.bind(console, "erro"));
db.once("open", () => {
    console.log("Connect");
})

const app = express();
app.use(cors({exposedHeaders: ['Authorization']}))
routes(app);

app.get("/", (req, res) => {
    res.send("Dale");
})

export default app;