const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config({path: "./.env.local"});
const router = express.Router();

const nodemailer = require('nodemailer');
const crypto = require('crypto');  

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  type: "login",
  auth: {
    user: process.env.SMTP_EMAIL, 
    pass: process.env.SMTP_PASS,   
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 5000,  
  greetingTimeout: 3000,
});

// Sign Up Route with OTP
router.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    isVendor,
    yearsOfExperience,
    fieldsOfExpertise,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Account already exists" });
    }

    const otp = crypto.randomInt(100000, 999999); 

    const newUser = new User({
      name,
      email,
      password,
      isVendor,
      yearsOfExperience: isVendor ? yearsOfExperience : undefined,
      fieldsOfExpertise: isVendor ? fieldsOfExpertise : undefined,
      otp: otp,  
      isVerified: false,
    });

    // Send OTP email
    const mailOptions = {
      from: 'donotreplyl@gmail.com',  
      to: email,                     
      subject: 'Your OTP for FixMate Signup',
      text: `Your OTP is: ${otp}..`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      console.log(err)
      if (err) {
        console.log("Faled to send otp");
      } else {
        console.log('OTP sent: ' + info.response);
      }
    });

    const user = await newUser.save();

    if (!user.isVerified) {
      res.status(201).json({ message: "Account not verified. Check your email for OTP" });
    } else {
      res.status(201).json({ message: "User registered" });
    }
    console.log("User registered");
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if(!user.isVerified) return res.status(403).json({error: "user not verified"});

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        isVendor: user.isVendor, 
        fieldsOfExpertise: user.isVendor ? user.fieldsOfExpertise : "",
        isAdmin: user.isAdmin? user.isAdmin : false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    return res.status(200).json({
      token,
      name: user.name,
      isVendor: user.isVendor,
      id: user._id,
      fieldsOfExpertise: user.isVendor ? user.fieldsOfExpertise : "",
      isAdmin: user.isAdmin? user.isAdmin : false,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/vendors", async (req, res) => {
  try {
    const users = await User.find({isVendor: true}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/customers", async (req, res) => {
  try {
    const users = await User.find({ $and: [{isVendor: false}, {isAdmin: false}] }).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to check JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Token validation route
router.post('/validate', authenticateToken, (req, res) => {
  res.json(
    { name: req.user.name,
      id: req.user.id,
      isVendor: req.user.isVendor,
      fieldsOfExpertise: req.user.fieldsOfExpertise,
      isAdmin: req.user.isAdmin,
    }
  ); 
});

router.post('/verify-account', async (req, res) => {
  const { email, OTP } = req.body;

  try{
    const existingUser = await User.findOne({email});

    if(!existingUser){
      res.json({message: "User doesnt exists."})
    }
    if (OTP == existingUser.otp) {
      existingUser.isVerified = true;
      await existingUser.save();
      res.status(201).json({ success: true, message: 'OTP Verified Successfully!' });
    } else {
      res.status(202).json({ success: false, message: 'Invalid or expired OTP' });
    }
 
  }catch(err){
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
});



module.exports = router;
