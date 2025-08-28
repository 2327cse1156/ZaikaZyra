import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --- Color Palette ---
  const bgColor = "#FFF7ED";
  const bubbleColors = ["#FBBF24", "#86EFAC", "#22C55E"];

  const handleSendOtp = async () => {
    setMessage("");
    if (!email) {
      setMessage("Email is required");
      setMessageType("error");
      return;
    }
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      setMessage(result.data.message || "OTP sent successfully!");
      setMessageType("success");
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setMessage("");
    if (!otp) {
      setMessage("OTP is required");
      setMessageType("error");
      return;
    }
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      setMessage(result.data.message || "OTP verified!");
      setMessageType("success");
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetOtp = async () => {
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, otp, newPassword, confirmPassword },
        { withCredentials: true }
      );
      setMessage(result.data.message || "Password reset successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/signin"), 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      style={{ backgroundColor: bgColor }}
    >
      {/* Floating bubbles */}
      <div
        className="absolute w-72 h-72 rounded-full opacity-30 animate-bounce-slow -top-20 -left-10"
        style={{ backgroundColor: bubbleColors[0] }}
      ></div>
      <div
        className="absolute w-56 h-56 rounded-full opacity-25 animate-bounce-slower top-10 right-0"
        style={{ backgroundColor: bubbleColors[1] }}
      ></div>
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 animate-bounce-slow left-1/4 bottom-10"
        style={{ backgroundColor: bubbleColors[2] }}
      ></div>
      <div
        className="absolute w-48 h-48 rounded-full opacity-25 animate-bounce-slower -bottom-10 right-1/3"
        style={{ backgroundColor: bubbleColors[1] }}
      ></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 sm:p-10 transform hover:-translate-y-2 transition-all duration-500 z-10 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <IoIosArrowRoundBack
            size={28}
            className="cursor-pointer text-green-600 hover:text-green-700 transition"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-600">
            Forgot Password
          </h1>
        </div>
        <p className="text-gray-500 text-sm sm:text-base">
          {step === 1 && "Enter your email to receive OTP"}
          {step === 2 && "Enter the OTP sent to your email"}
          {step === 3 && "Enter and confirm your new password"}
        </p>

        {/* Inline message */}
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

        {/* Step 1: Email */}
        {step === 1 && (
          <div className="mt-6 animate-slideLeft">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 shadow-sm hover:shadow-md"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 rounded-xl mt-6 transition duration-300 animate-slideUp shadow-lg ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="mt-6 animate-slideLeft">
            <label className="block text-gray-700 font-medium">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 shadow-sm hover:shadow-md"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 rounded-xl mt-6 transition duration-300 animate-slideUp shadow-lg ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <div className="mt-6 space-y-4 animate-slideLeft">
            <div>
              <label className="block text-gray-700 font-medium">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 shadow-sm hover:shadow-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 shadow-sm hover:shadow-md"
              />
            </div>
            <button
              onClick={handleResetOtp}
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 rounded-xl mt-6 transition duration-300 animate-slideUp shadow-lg ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
        .animate-bounce-slower { animation: bounce-slow 12s ease-in-out infinite; }

        @keyframes fadeIn { from {opacity:0} to {opacity:1} }
        .animate-fadeIn { animation: fadeIn 0.8s ease-in forwards; }

        @keyframes slideLeft { from {opacity:0; transform: translateX(-20px);} to {opacity:1; transform: translateX(0);} }
        .animate-slideLeft { animation: slideLeft 0.8s ease-in forwards; }

        @keyframes slideUp { from {opacity:0; transform: translateY(20px);} to {opacity:1; transform: translateY(0);} }
        .animate-slideUp { animation: slideUp 0.8s ease-in forwards; }
      `}</style>
    </div>
  );
}

export default ForgotPassword;
