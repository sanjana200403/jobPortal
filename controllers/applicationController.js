import { catchAsyncError } from "../middleware/catchAsyncError.js"
import ErrorHandler from "../middleware/error.js"
import { Application } from "../models/application.js";
import cloudinary from "cloudinary"
import {Job} from "../models/jobSchema.js"

// =======get all employee application====

export const employerGetAllApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role == "Job Seeker"){
        return next(new ErrorHandler("Job Seeker is not allowed to access this resources",400))
    }
    const {_id} = req.user;
    const application =  await Application.find({'employerID.user':_id})
    console.log(application,"find employer id")
    res.status(200).json({
       success:true,
       application

    })

})
// ===========get all user application===========

export const jobseekerGetAllApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role == "Employer"){
        return next(new ErrorHandler("Employer is not allowed to access this resources",400))
    }
    const {_id} = req.user;
    const application =  await Application.find({'applicantID.user':_id})
    console.log(application,"find employer id")
    res.status(200).json({
       success:true,
       application

    })

})
// =======delete application=========

export const jobseekerDeleteApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user
    if(role == "Employer"){
        return next(new ErrorHandler("Employer is not allowed to access this resources",400))
    }
    const {id}=req.params 
    const application = await  Application.findById(id)
    console.log(application,"application in delete")
    if(!application){
        return next(new ErrorHandler("Oops application not found",400))

    }
    await application.deleteOne();
    res.status(200).json({
        success:true,
        message:"Application deleted successfully"
    })


})
// =========create application============

export const postApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role=="Employer"){
        return next(new ErrorHandler("Employer is not allowed to access this resources",400))

    }
    console.log("is not employer")
    if(!req.files || Object.keys(req.files).length ===0){
        return next(new ErrorHandler("Resume file Required"))

    }
    const {resume} = req.files;
    console.log(resume)
  
    const allowedFormats =['image/png','image/jpeg','image/webp']
    if((!allowedFormats.includes(resume.mimetype))){
        return next(new ErrorHandler("Invalid file!!, Please upload a resume in  png,jpg or webp formate",400))

    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    console.log(cloudinaryResponse)
    if(!cloudinaryResponse || cloudinaryResponse.error){
      console.error("cloudinary Error:",cloudinaryResponse.error || "unknown cloudinary error")  
      return next(next(new ErrorHandler("Failed to upload",500)))
    };
    const { name,email,coverLetter,phone,address,jobId} = req.body;
   const applicantID = {
    user:req.user._id,
    role:"Job Seeker"
   }
   if(!jobId){
    return next(new ErrorHandler("Job not found!!",404))

   }
   const jobDetails  = await Job.findById(jobId)
   if(!jobDetails){
    return next(new ErrorHandler("Job not found",404))
   }
   const employerID = {
    user:jobDetails.postedBy,
    role: "Employer"
   }
   if(!name || !email|| !coverLetter || !phone || !address || !applicantID || !employerID || !resume){
    return next(new ErrorHandler("Please fill all fields!!",400))

   }
   const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume:{
        public_id: cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url
    }

   })
   console.log(application,"APPLICATION!!")
   res.status(200).json({
    success:true,
    message:"Application Submitted !!",
    application

   })


})