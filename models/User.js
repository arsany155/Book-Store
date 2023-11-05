const mongoose = require("mongoose");
const Joi = require('joi');  
const passwordcomplexity = require("joi-password-complexity")


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength:100,
        minlength:5 
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength:100,
        minlength:2 
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:8
    },
    isAdmin: {
        type: Boolean,
        default: false

    },
}, {timestamps:true})

const User = mongoose.model("User" , UserSchema)


//Validate Register User
function validateRegisterUser(obj){
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        username: Joi.string().trim().min(2).max(100).required(),
        password: passwordcomplexity().required()
    });
    return schema.validate(obj) 
}

//Validate Login User
function validateLoginUser(obj){
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj) 
}


//Validate change password user
function validateChangePassword(obj){
    const schema = Joi.object({
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj) 
}

//Validate Update User
function validateUpdateUser(obj){
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email(),
        username: Joi.string().trim().min(2).max(100),
        password: Joi.string().trim().min(6),
    });
    return schema.validate(obj) 
}


module.exports={
    User,
    validateLoginUser,
    validateRegisterUser,
    validateUpdateUser,
    validateChangePassword
}