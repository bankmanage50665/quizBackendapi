// MODEL - OtpCode.js
const mongoose = require('mongoose');

const OtpCodeSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // OTP expires after 10 minutes
  }
});

const OtpCode = mongoose.model('OtpCode', OtpCodeSchema);
module.exports = OtpCode;