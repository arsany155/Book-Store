const express = require("express")
const router = express.Router()
const asynchandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt =require("jsonwebtoken")
const { User, validateLoginUser, validateRegisterUser} = require("../models/User")

/** 
* @desc     Register new User
* @route    /api/auth/register
* @method   POST
* @access   public
*/
router.post("/register",asynchandler(async(req,res)=>{
    //validate the input 
    const {error} = validateRegisterUser(req.body);
    if (error){
        return res.status(400).json({message : error.details[0].message})
    }
    
    // checking in database
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({message: "This user has been registered already"})
    }
    
    //crypt the password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password , salt) 

    //put the inputs inside database
    user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    })

    // save the inputs in the database
    const result = await user.save()
    const token = jwt.sign({id : user._id , isAdmin: user.isAdmin} , process.env.JWT_SECRET_KEY);
    const { password, ...other }=result._doc
        res.status(201).json({...other , token})
})) 



/** 
* @desc     Login User
* @route    /api/auth/login
* @method   POST
* @access   public
*/
router.post("/login",asynchandler(async(req,res)=>{
    //validate the input 
    const {error} = validateLoginUser(req.body);
    if (error){
        return res.status(400).json({message : error.details[0].message})
    }

    // checking the email in database
    let user = await User.findOne({email: req.body.email })
    if(!user){
        return res.status(400).json({message: "invalid email or password"})
    }

    const isPassword = await bcrypt.compare(req.body.password , user.password)
    if(!isPassword){
        return res.status(400).json({message: "invalid email or password"})
    }

    // save the inputs in the database
    const token = jwt.sign({id : user._id , isAdmin: user.isAdmin} , process.env.JWT_SECRET_KEY);
    const { password, ...other }=user._doc
        res.status(200).json({...other , token})
})) 

module.exports=router