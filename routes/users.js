const express = require("express")
const router = express.Router()
const asynchandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const {User , validateUpdateUser} = require("../models/User")
const { verifyTokenandAdmin , verifyTokenandAutherization} = require("../middleware/verifyToken")


/** 
* @desc     Update User
* @route    /api/users/:id
* @method   PUT
* @access   private
*/
router.put("/:id" , verifyTokenandAutherization  ,  asynchandler(async(req , res) => {

    const { error } = validateUpdateUser(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message})   
    }

    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password , salt) 
    }

    const updateUer = await User.findByIdAndUpdate(req.params.id , {
        $set: {
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        }
    }, {new: true}).select("-password") 
    res.status(200).json(updateUer)
}))




/** 
* @desc     Get All Users
* @route    /api/users
* @method   GET
* @access   private (only Admin)
*/
router.get("/" , verifyTokenandAdmin  ,  asynchandler(async(req , res) => {
    const users = await User.find().select("-password")
    res.status(200).json(users)
}))



/** 
* @desc     Get  User by id
* @route    /api/users/:id
* @method   GET
* @access   private (only Admin & user him self)
*/
router.get("/:id" , verifyTokenandAutherization  ,  asynchandler(async(req , res) => {
    const user = await User.findById(req.params.id).select("-password")
    if(user){
        res.status(200).json(user)
    }else {
        res.status(400).json({message: "user not found"})
    }
}))


/** 
* @desc     delete User by id
* @route    /api/users/:id
* @method   DELET
* @access   private (only Admin & user him self)
*/
router.delete("/:id" , verifyTokenandAutherization  ,  asynchandler(async(req , res) => {
    const user = await User.findById(req.params.id)
    if(user){
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "the user has been deleted"})
    }else {
        res.status(400).json({message: "user not found"})
    }
}))



module.exports=router 