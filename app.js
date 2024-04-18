import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js"
import jobRouter from "./routes/jobRouter.js"
import applicationRouter from "./routes/applicationRouter.js"
import { dbConnection } from "./database/dbconnection.js";
import { errorMiddleware } from "./middleware/error.js";



const app = express()
// ========================
dotenv.config({path:'./config/config.env'})

app.use(cors({
    origin:true,
    methods:['GET','POST','DELETE','PUT'],
    credentials:true
}))
app.use(cookieParser())
//  we can not authorize user without cookie-parser 
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//FOR UPLOAD FILES  
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/temp/'

}))
// =========
app.use("/api/v1/user",userRouter)
app.use("/api/v1/job",jobRouter)
app.use("/api/v1/application",applicationRouter)

dbConnection()

// ERROR
app.use(errorMiddleware)
export default app

