const User = require("../models/userModel");
const OtpCode = require("../models/otpCodeModel");
const twilio = require("twilio");

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate a random 6-digit OTP code
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Twilio SMS
const sendOTP = async (phoneNumber, otpCode) => {
  try {
    await twilioClient.messages.create({
      body: `Your verification code is: ${otpCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(otpCode);

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

// Request OTP controller
exports.requestOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required" });
    }

    // Format phone number to E.164 format if needed
    let formattedPhoneNumber = phoneNumber;
    if (!phoneNumber.startsWith("+")) {
      formattedPhoneNumber = `+${phoneNumber}`;
    }

    // Generate OTP
    const otpCode = generateOTP();

    // Save OTP to database
    await OtpCode.findOneAndUpdate(
      { phoneNumber: formattedPhoneNumber },
      { phoneNumber: formattedPhoneNumber, code: otpCode },
      { upsert: true, new: true }
    );

    // Send OTP via Twilio
    const smsSent = await sendOTP(formattedPhoneNumber, otpCode);

    if (!smsSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code",
      });
    }

    // Check if user exists
    let user = await User.findOne({ phoneNumber: formattedPhoneNumber });

    // Create user if not exists
    if (!user) {
      user = new User({
        phoneNumber: formattedPhoneNumber,
        quizCreater: [],
        save4Later: [],
        wrong: [],
      });
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Error in requestOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending verification code",
    });
  }
};

// Verify OTP controller
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body; // Changed from 'otpCode' to 'otp' to match frontend

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and verification code are required",
      });
    }

    // Format phone number to E.164 format if needed
    let formattedPhoneNumber = phoneNumber;
    if (!phoneNumber.startsWith("+")) {
      formattedPhoneNumber = `+${phoneNumber}`;
    }

    // Find the OTP record
    const otpRecord = await OtpCode.findOne({
      phoneNumber: formattedPhoneNumber,
      code: otp, // Changed from 'otpCode' to 'otp'
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code or code expired",
      });
    }

    // Find the user
    const user = await User.findOne({ phoneNumber: formattedPhoneNumber });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(user)

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Delete the OTP record
    await OtpCode.deleteOne({ _id: otpRecord._id });

    // Generate JWT token for authentication
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying code",
    });
  }
};
