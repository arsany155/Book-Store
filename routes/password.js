const express = require("express")
const { getForgotPassword, sendForgotPasswordLink, getResetPassword, ResetPassword } = require("../controllers/passwordController")
const router = express.Router()


router.get("/forgot-password" , getForgotPassword)
router.post("/forgot-password" , sendForgotPasswordLink)

router.get("/reset-password/:userId/:token" , getResetPassword)
router.post("/reset-password/:userId/:token" , ResetPassword)


module.exports=router