const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};



const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Create access token
    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // 5. Create refresh token
    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 6. Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // 7. Send refresh token as httpOnly cookie
   res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    // 8. Send access token in response
    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    // Token verify
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Database mein token check
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken: token,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // New access token
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};
const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: null }
      );
    }

   res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
    logout,
    getMe,
};