import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");


  const handleSignIn = async () => {
    setMessage("");
    try {
      if (!email || !password) {
        setMessage("Both email and password are required");
        setMessageType("error");
        return;
      }

      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      setMessage(result.data.message || "Login successful!");
      setMessageType("success");

      // Redirect after 1s
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Sign in failed!");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-600 text-center">ZaikaZyra</h1>
        <p className="text-gray-500 text-center mt-2">Sign in to continue</p>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              messageType === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500 hover:text-green-600 transition duration-300"
              >
                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <p
            onClick={() => navigate("/forgot-password")}
            className="text-right text-green-600 font-medium cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>
        </div>

        {/* Sign In */}
        <button
          type="button"
          onClick={handleSignIn}
          className="w-full bg-green-600 text-white py-3 rounded-xl mt-4 hover:bg-green-700 transition duration-300"
        >
          Sign In
        </button>

        {/* Sign in with Google */}
        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl mt-4 hover:bg-gray-100 transition duration-300">
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>

        {/* Sign Up */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-green-600 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
