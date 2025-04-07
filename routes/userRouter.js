const express = require("express");
const router = express.Router()


const authController = require("../controller/authController")
const save4Controller = require("../controller/save4laterController")



router.post('/request-otp', authController.requestOTP);
router.post('/verify-otp', authController.verifyOTP);




module.exports = router;
