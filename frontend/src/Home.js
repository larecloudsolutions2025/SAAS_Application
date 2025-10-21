import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Welcome back, ${data.username}!`);
        navigate("/dashboard");
      } else {
        toast.error(data.detail || "Login failed.");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center transition-all duration-1000">
      <div
        className={`flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-6 transform transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Left Section */}
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-6xl font-bold text-black">SaaS Exam Platform</h1>
          <p className="mt-4 text-xl text-black max-w-md">
            This platform allows users to register and log in to access a personalized dashboard.
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-96 animate-fadeIn">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-black"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-black"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-400 text-black p-3 rounded-lg font-bold hover:bg-orange-500 transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="text-center mt-3">
            <Link
              to="/forgot-password"
              className="text-orange-600 text-sm hover:underline transition-all duration-300 hover:text-orange-700 hover:scale-105 inline-block"
            >
              Forgotten password?
            </Link>


          </div>

          <hr className="my-4 border-gray-400" />

          {/* Sign up link */}
          <p
            className={`text-center text-sm text-black mt-3 transform transition-all duration-1000 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-orange-600 hover:text-orange-700 hover:scale-105 transition-transform duration-300 inline-block"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}