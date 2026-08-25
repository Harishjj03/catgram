const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Catgram server is running 🐱",
  });
});

// Demo login route
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Check existing user
    let user = await User.findOne({ username });

    // Demo behavior:
    // If user doesn't exist, create an account.
    if (!user) {
    
      user = await User.create({
        username,
        password: password,
      });

      return res.json({
        success: true,
        message: "Demo account created",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT || 5000}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });