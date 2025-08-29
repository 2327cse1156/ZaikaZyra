import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // --- Color Palette ---
  const primaryColor = "#22C55E";
  const bgColor = "#FFF7ED";
  const borderColor = "#E5E7EB";
  const bubbleColors = ["#FBBF24", "#86EFAC", "#22C55E"];
  const dispatch = useDispatch();
  const handleSignIn = async () => {
    setMessage("");
    try {
      if (!email || !password) {
        setMessage("Email and Password are required");
        setMessageType("error");
        return;
      }

      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));

      setMessage(result.data.message || "Sign in successful!");
      setMessageType("success");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Sign in failed!");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
      setMessageType("error");
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          email: result.user.email,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      setMessage("Google signup successful!");
      setMessageType("success");
      setTimeout(() => navigate("/signin"), 1000);
      console.log(data);
    } catch (error) {
      console.log(error);
      setMessage("Google signup failed!");
      setMessageType("error");
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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-600 text-center animate-slideDown">
          ZaikaZyra
        </h1>
        <p className="text-gray-500 text-center mt-2 animate-slideDown delay-100">
          Sign in to continue to your account
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

        <div className="mt-6 space-y-4">
          {/* Email */}
          <div className="animate-slideLeft delay-200">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 shadow-sm hover:shadow-md"
              required
            />
          </div>

          {/* Password */}
          <div className="animate-slideLeft delay-300">
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 shadow-sm hover:shadow-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500 hover:text-green-600 transition duration-300"
              >
                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>

            {/* Forgot password link */}
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-green-600 font-semibold mt-2 cursor-pointer hover:underline text-right"
            >
              Forgot Password?
            </p>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          type="button"
          onClick={handleSignIn}
          className="w-full bg-green-600 text-white py-3 rounded-xl mt-6 hover:bg-green-700 transition duration-300 animate-slideUp shadow-lg"
        >
          Sign In
        </button>

        {/* Google Sign In */}
        <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl mt-4 hover:bg-gray-100 transition duration-300 animate-slideUp delay-100 shadow-sm">
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-6 animate-slideUp delay-200">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-green-600 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
        .animate-bounce-slower { animation: bounce-slow 12s ease-in-out infinite; }

        @keyframes fadeIn { from {opacity:0} to {opacity:1} }
        .animate-fadeIn { animation: fadeIn 0.8s ease-in forwards; }

        @keyframes slideDown { from {opacity:0; transform: translateY(-20px);} to {opacity:1; transform: translateY(0);} }
        .animate-slideDown { animation: slideDown 0.8s ease-in forwards; }

        @keyframes slideLeft { from {opacity:0; transform: translateX(-20px);} to {opacity:1; transform: translateX(0);} }
        .animate-slideLeft { animation: slideLeft 0.8s ease-in forwards; }

        @keyframes slideUp { from {opacity:0; transform: translateY(20px);} to {opacity:1; transform: translateY(0);} }
        .animate-slideUp { animation: slideUp 0.8s ease-in forwards; }
      `}</style>
    </div>
  );
}

export default SignIn;
