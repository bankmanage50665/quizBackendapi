const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    quizCreater: [{ type: mongoose.Types.ObjectId, ref: "Quiz" }],
    save4Later: [{ type: mongoose.Types.ObjectId, ref: "Quiz" }],
    wrong: [{ type: mongoose.Types.ObjectId, ref: "Quiz" }],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password if it's modified
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password") && user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
