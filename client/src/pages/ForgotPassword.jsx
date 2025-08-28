import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <div>
          <IoIosArrowRoundBack size={20} onClick={() => navigate("/signin")} />
          <h1>Forgot Password</h1>
        </div>
        {step === 1 && (
          <div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button>Send Otp</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div>
              <label htmlFor="text">OTP</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>
            <button>Verify</button>
          </div>
        )}
        {step === 3 && (
          <div>
            <div>
              <label htmlFor="text">New Password</label>
              <input
                type="text"
                id="new-password"
                placeholder="Enter New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>
            <div>
              <label htmlFor="text">Confirm Password</label>
              <input
                type="text"
                id="confirm-password"
                placeholder="Enter Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <button>Reset Password</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
