import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB  from "./DB.js"
import path from "path";


dotenv.config({});

const app = express()
const _dirname = path.resolve()


app.use(cors({
    origin: "http://localhost:5174",  
    credentials: true,  
    methods: "GET, POST, PUT, DELETE", 
    allowedHeaders: "Content-Type, Authorization" 
  }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())








import userrouter from "./routes/user.routes.js"
import postrouter from "./routes/post.routes.js"
import messagerouter from "./routes/messages.routes.js"

app.use("/api/v1/users", userrouter)
app.use("/api/v1/post", postrouter)
app.use("/api/v1/message", messagerouter)





app.use(express.static(path.join(_dirname, "/vite-project/dist")))
app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, "vite-project", "dist", "index.html"))
})




connectDB()
.then(()=>{
    app.listen(process.env.PORT || 7000, () => {
        console.log(`server is running at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("Mongo db Connect Failed !!!!!  ", err)
})

