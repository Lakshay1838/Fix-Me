const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const formSubmission = require("./routes/complain.routes");
const billRoutes = require("./routes/bill.routes");
require("dotenv").config({path: "./.env.local"});
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
    console.log(error);
});
    

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", formSubmission);
app.use("/api/bill", billRoutes);

