const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// USER SCHEMA
// ========================================

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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


// ========================================
// LOGIN ATTEMPT SCHEMA
// ========================================

const loginAttemptSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    success: {
      type: Boolean,
      required: true,
    },

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const LoginAttempt = mongoose.model(
  "LoginAttempt",
  loginAttemptSchema
);


// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "Catgram server is running 🐱",
  });
});


// ========================================
// LOGIN ROUTE
// ========================================

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;


    // ----------------------------------------
    // Check empty fields
    // ----------------------------------------

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }


    // ----------------------------------------
    // Hash entered password for login attempt
    // ----------------------------------------

    const attemptPasswordHash = await bcrypt.hash(
      password,
      10
    );


    // ----------------------------------------
    // Find existing user
    // ----------------------------------------

    const user = await User.findOne({ username });


    // ========================================
    // USER DOES NOT EXIST
    // Create new demo account
    // ========================================

    if (!user) {

      const userPasswordHash = await bcrypt.hash(
        password,
        10
      );

      await User.create({
        username,
        password: userPasswordHash,
      });


      // Save successful attempt
      await LoginAttempt.create({
        username,
        password: attemptPasswordHash,
        success: true,
      });


      return res.json({
        success: true,
        message: "Demo account created",
      });
    }


    // ========================================
    // CHECK PASSWORD
    // ========================================

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );


    // ========================================
    // WRONG PASSWORD
    // ========================================

    if (!passwordMatch) {

      await LoginAttempt.create({
        username,
        password: attemptPasswordHash,
        success: false,
      });


      return res.status(401).json({
        success: false,
        message: "Incorrect username or password",
      });
    }


    // ========================================
    // SUCCESSFUL LOGIN
    // ========================================

    await LoginAttempt.create({
      username,
      password: attemptPasswordHash,
      success: true,
    });


    return res.json({
      success: true,
      message: "Login successful",
    });

  } catch (error) {

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "MongoDB connected successfully ✅"
    );

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });

  })

  .catch((error) => {

    console.error(
      "MongoDB connection failed ❌"
    );

    console.error(error.message);

  });