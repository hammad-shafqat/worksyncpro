import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const userSchema = new Schema({
    avatar: {
        type: String,
        default: 'https://placehold.co/200x200'
    },
    username:{
        type: String,
        lowercase: true,
        required: [true, "Username is required"],
        trim: true,
        index: true
    },
    email:{
        type: String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "project_admin", "member"],
        default: "member"
    },
    refreshToken:{
        type: String
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationTokenExpiry: {
        type: Date
    },
    forgotPasswordToken:{
        type: String
    },
    forgotPasswordTokenExpiry: {
        type: Date
    }
}, {
    timestamps: true
});


//prehook for hash password before save

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }catch(error){
        next(error);
    }
});


//method to compare the password

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

//generateRefresh Token 
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

//ACCESS TOKEN GENERATION
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


//temporary token generation token
userSchema.methods.tempTokenGeneration = function (){
    const unHashedToken = crypto.randomBytes(25).toString('hex');

    const hashedToken = crypto.createHash('sha256').update(unHashedToken).digest('hex');

    const tokenExpiry = Date.now() + (15*60*1000);

    return { unHashedToken, hashedToken, tokenExpiry }
}

export const User = model('User', userSchema);