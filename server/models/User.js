const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVendor: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  yearsOfExperience: {
    type: Number,
    required: function () {
      return this.isVendor;
    },
  },
    fieldsOfExpertise: {
      type: String,
      required: function () {
        return this.isVendor;
      },
    },
    otp:{
      type: Number,
    },
    isVerified:{
      type: Boolean,
      default: false,
    }
});

// Save krne se phele hashing kr rhe
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  password compare kr rhe hash password se
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
