import {catchAsyncError} from '../middleware/catchAsyncError.js'
import ErrorHandler from '../middleware/error.js'
import { Job } from '../models/jobSchema.js'

// ======get all jobs=========
export const  getAllJobs = catchAsyncError(async(req,res,next)=>{
    const jobs = await Job.find({expired:false})
    console.log(jobs," ALL JOBS!!")
    res.status(200).json({
        success:true,
        jobs
    })

})
// ======post job===========
export const postJob = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker is not allowed to acess this resources"))

    }
    const {title,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo} = req.body
    if(!title|| !description || !category || !country
        || !city || !location){
            return next(new ErrorHandler("Please provide full Job details",400))
        }
     if((!salaryFrom || !salaryTo) && !fixedSalary){
         return next(new ErrorHandler("Please either provide fixed salary or ranged salary ",400))
     }   
     if(salaryFrom && salaryTo && fixedSalary ){
        return next(new ErrorHandler("Cannot enter fixed salary and ranged salary together",400))
     }
     const postedBy = req.user._id
     const job =await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy

     })
     console.log(job,"JOB CREATED")
     res.status(200).json({
        success:true,
        message:"Job Posted Successfully!!",
        job
     })





})
// =======  get my job=========
export const getmyJobs = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker is not allowed to acess this resources"))

    }
    const myJobs =  await Job.find({postedBy:req.user._id})
    console.log("ALL MY JOBS",myJobs)
    res.status(200).json({
        success:true,
        myJobs
    })



})
// ===========  UPDATE THE JOB  ==============
export const  updatedJob = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker is not allowed to acess this resources"))

    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("Oops job not found",400))
    }
    job = await Job.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        userFindAndModify : false
    })
    console.log("JOB UPDATED",Job)
    res.status(200).json({
        success:true,
        job,
        message:"Job updated successfully"

    })



})
// ============delete job ===============
export const deleteJob = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker is not allowded to access this resources"))
    }
    const {id} = req.params
    const job = await Job.findById(id)
    console.log("find by id in delete method",job)
    if(!job){
        return next(new ErrorHandler("Oops job not found",400))

    }
     await job.deleteOne()
    console.log("USER DELETED!!", Job)
    res.status(200).json({
        success:true,
        message:"Job Deleted Succesfully"
    })


})
// =============get single job=========
export const getSinglejob =  catchAsyncError(async(req,res,next)=>{

    const {id} = req.params
    try{
        const  job = await Job.findById(id)
        console.log(job,"SINGLE JOB!!")
        if(!job){
            return next(new ErrorHandler("Job not found",404))
        }
        res.status(200).json({
            success:true,
            job

        })
    }catch(error){
        console.log("error in finding single ",error)
        return next(new ErrorHandler("Invalid Id/Cast id",400))

    }



})