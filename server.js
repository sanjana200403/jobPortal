import app from "./app.js";
import cloudinary from 'cloudinary'



// ======cloudinary setup======
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME ,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET
})




// =========creating server=======
app.listen(process.env.PORT,()=>{
    console.log(`server runing on port ${process.env.PORT}`)
})
