import User from "../models/user.model.js";
import genToken from "../utils/token.js";
import bcrypt from "bcryptjs";

// User Registration
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    if (!fullName || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    if (mobile.toString().length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 10 digits long." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// User Sign In
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// User Sign Out
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
