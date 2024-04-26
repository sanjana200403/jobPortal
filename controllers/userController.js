import { User } from "../models/userSchema.js"
import { catchAsyncError } from "../middleware/catchAsyncError.js"
import ErrorHandler from "../middleware/error.js"
import {sendToken} from "../utils/jwtToken.js"

// =======user register=========

export const register= catchAsyncError(async(req,res,next)=>{
    const {name,email,phone,role,password} = req.body
    if(!name || !email || !role || !password || !phone){
      return next( new ErrorHandler("Please fill full registeration form !"))

    }
    const isEmail = await User.findOne({email})
    console.log(isEmail,"isEmail")
    if(isEmail){
        return next(new ErrorHandler("Email already exists"))

    }
    const user =  await User.create({
        name,
        email,
        phone,
        role,
        password
      

    });
    console.log(user," create user!!")
    sendToken(user,200,res,"User Registerd")
    // res.status(200).json({
    //     success:true,
    //     mesaage:"User registered",
    //     user

    // })


})
//========== user login ========


export const login= catchAsyncError(async(req,res,next)=>{
const {email,password,role} = req.body;
if(!email){
    return next(new ErrorHandler(`please provide email`,400))

}
if(!password){
    return next(new ErrorHandler(`please provide your password`,400))

}
if(!role){
    return next(new ErrorHandler(`please provide your role`,400))

}
const user = await User.findOne({email}).select("+password")
console.log(user,"login finde user!!")
if(!user){
    return next(new ErrorHandler("Invalid Email",400))

}
const isPasswordMatch = await user.comparePassword(password)
if(!isPasswordMatch){
   return next(new ErrorHandler("Password incorrect",400))

}
if(user.role !== role){
  return next(new ErrorHandler("User with this role not Found",400))

}
sendToken(user,200,res,"User Logged In Succesfully")


})
// ==========logout ========
export const logout = catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        // expires:new Date(Date.now()+process.env.COOKIE_EXPIRE *24*60*60*1000)
        expires: new Date(Date.now()),
        httpOnly: true, sameSite: "none", secure: true 
    }).json({
        success:true,
        message:"User logged out successfully"
    })

})
// =========get USER========
export const  getUser = catchAsyncError(async(req,res,next)=>{
    console.log(req.user)
    const user = req.user;
    res.status(200).json({
        success:true,
        user

    })

})
