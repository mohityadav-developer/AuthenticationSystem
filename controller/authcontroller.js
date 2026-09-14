import User from "../models/userschema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config/config.js";


export async function register(req ,res){
    const {username,email,password}=req.body;
    const isalreadyexist= await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isalreadyexist){
        res.status(409).send("User or email already exist ");
    }
    const hashedpassword= await bcrypt.hash(password,10);
    const user= await User.create({
        username,
        email,
        password:hashedpassword
    })
    const token=jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
        expiresIn:"1d"
    })
    res.status(201).json({
        message:"user created successfully",
        user:{
            username:user.username,
            email:user.email
        },
        token

    })
}