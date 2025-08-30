import { Router } from "express";

import userController from "../controllers/user.controllers.js";
import EmailUtlis from "../utils/email.utils.js";
import {loginLimiter} from '../middlewares/rate.limiter.middleware.js'
import uploadImage from "../utils/imageUpload.utlis.js";
import jwtAuthMiddleware from "../middlewares/jwt-auth.middleware.js";
import { 
    validate, 
    validateUserRegistration, 
    validateUserLogin,
    validateProfileUpdate 
} from "../middlewares/validation.middleware.js";

const userRouter = Router();

// User registration with validation
userRouter.post("/register/:role", validate(validateUserRegistration), userController.registerUser)

// OTP verification
userRouter.post('/register/:role/otp-verify', EmailUtlis.optVerify)

// User login with validation and rate limiting
userRouter.post('/login/:role', loginLimiter, validate(validateUserLogin), userController.LoginUser)

// Password management
userRouter.post('/forgot-password/:role', userController.forgotPassword)
userRouter.post('/reset-password/:role', userController.resetPasswordUsingOTP)
userRouter.post('/update-password', jwtAuthMiddleware, userController.updatePassword)

// OTP management
userRouter.post('/resend-otp/:role', EmailUtlis.resendOtp)

// Profile management
userRouter.post('/upload-profile-picture', uploadImage)
userRouter.post('/update-phone-image', validate(validateProfileUpdate), userController.updatePhoneProfileImage)
userRouter.get('/profile', jwtAuthMiddleware, userController.getUserProfileController)

// Account management
userRouter.delete('/delete-account', jwtAuthMiddleware, userController.deleteAccount)

export default userRouter;