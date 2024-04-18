import mongoose from "mongoose";
export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"MERN_STACK_JOB_SEEKING"
    }).then(()=>{
     console.log("CONNECTED TO DATABASE !!")
    }).catch((err)=>{
        console.log('DATABASE CONNECTION ERROR !!')
    })

}