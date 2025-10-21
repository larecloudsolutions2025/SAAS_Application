import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const getErrorMessage = async (res) => {
    try {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.msg) return data[0].msg;
      if (typeof data.detail === "string") return data.detail;
      return "Unexpected error";
    } catch {
      return "Server error";
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      toast.success("OTP sent to your email!");
      setStep(2);
    } else toast.error(await getErrorMessage(res));
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (res.ok) {
      toast.success("OTP verified!");
      setStep(3);
    } else toast.error(await getErrorMessage(res));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const res = await fetch("http://localhost:8000/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, new_password: newPassword }),
    });
    if (res.ok) {
      toast.success("Password reset successful!");
      navigate("/");
    } else toast.error(await getErrorMessage(res));
  };

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-4">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 text-black"
              required
            />
            <button className="bg-orange-400 text-black p-3 rounded-lg font-bold hover:bg-orange-500 transition">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 text-black"
              required
            />
            <button className="bg-orange-400 text-black p-3 rounded-lg font-bold hover:bg-orange-500 transition">
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 text-black"
              required
            />
            <input
              type="password"
              placeholder="Re-enter New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 text-black"
              required
            />
            <button className="bg-orange-400 text-black p-3 rounded-lg font-bold hover:bg-orange-500 transition">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
