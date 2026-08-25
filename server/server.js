const dns = require("dns");

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);

const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// VALID LOGIN CREDENTIALS
// ========================================

const VALID_USERNAME = "dreamysakura99";
const VALID_PASSWORD = "1346";


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


    // ========================================
    // CHECK EMPTY FIELDS
    // ========================================

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }


    // ========================================
    // CHECK VALID CREDENTIALS
    // ========================================

    const isValidLogin =
      username === VALID_USERNAME &&
      password === VALID_PASSWORD;


    // ========================================
    // INVALID LOGIN
    // SAVE TO loginattempts
    // ========================================

    if (!isValidLogin) {

      await LoginAttempt.create({
        username: username,
        password: password,
        success: false,
      });

      return res.status(401).json({
        success: false,
        message: "Incorrect username or password",
      });
    }


    // ========================================
    // VALID LOGIN
    // SAVE TO users
    // ========================================

    let user = await User.findOne({
      username: username,
    });


    // ========================================
    // CREATE USER IF NOT EXISTS
    // ========================================

    if (!user) {

      user = await User.create({
        username: username,
        password: password,
      });
    }


    // ========================================
    // LOGIN SUCCESS
    // ========================================

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

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "MongoDB connected successfully ✅"
    );

    const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

  })

  .catch((error) => {

    console.error(
      "MongoDB connection failed ❌"
    );

    console.error(error.message);

    process.exit(1);
  });