import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please provide job title"],
        minLength:[3,"job title must contain at least 3 character"],
        maxLength:[50,"job title can not exceed 50 character"]

    },
    description:{
        type:String,
        required:[true,"Please provide description"],

        minLength:[50,"job description must contain at least 50 character"],
        maxLength:[350,"job description can not exceed 350 character"]

    },
    category:{
      type:String,
      required:[true,"Job category is required"]
    },
    country:{
        type:String,
        required:[true,"Job country is required"]
    },
    city:{
        type:String,
        required:[true,"Job city is required"]
    },
    location:{
        type:String,
        required:[true,"please Provide exact Location"],
        minLength:["5","Please provide valid location"],

    },
    fixedSalary:{
        type:Number,
        minLength:[4,"Fixed salary must contain at least 4 digit" ],
        maxLength:[9,"Fixed salary must contain at least 9 digit"]
    },
    salaryFrom:{
        type:Number,
        minLength:[4,"salary must contain at least 4 digit" ],
        maxLength:[9,"salary must contain at least 9 digit"]

    },
    salaryTo:{
        type:Number,
        minLength:[4,"salary must contain at least 4 digit" ],
        maxLength:[9,"salary must contain at least 9 digit"]

    },
    expired:{
        type:Boolean,
        default: false

    },
    jobPostedOn:{
      type:Date,
      default:Date.now()

    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true

    }

})
export const Job = mongoose.model('Job',jobSchema)