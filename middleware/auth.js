import { catchAsyncError } from "./catchAsyncError.js"
import ErrorHandler from "./error.js"
import jwt from "jsonwebtoken"
import { User } from "../models/userSchema.js"

export const isAuthorized = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("User is not authorized",req.cookies, 401)); // Correcting the status code to 401 for unauthorized
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401)); // Correcting the status code to 401 for unauthorized
    }
});