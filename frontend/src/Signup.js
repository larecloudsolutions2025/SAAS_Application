import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Registered successfully as ${data.username}`);
        navigate("/");
      } else {
        toast.error(data.detail || "Registration failed.");
      }
    } catch (err) {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center transition-all duration-1000">
      <div
        className={`flex flex-col md:flex-row items-center justify-center w-full max-w-5xl p-4 md:p-8 gap-10 transform transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Left Section */}
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-5xl font-bold text-black">SaaS Exam Platform</h1>
          <p className="mt-4 text-xl text-black">
            Create an account to access exams and your personalized dashboard.
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full md:w-96 animate-fadeIn"
        >
          <h2 className="text-2xl font-bold text-center text-black">
            Create a New Account
          </h2>

          <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" className="border p-3 rounded focus:ring-2 focus:ring-orange-400 text-black" />
          <input name="username" value={form.username} onChange={handleChange} required placeholder="Username" className="border p-3 rounded focus:ring-2 focus:ring-orange-400 text-black" />
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="border p-3 rounded focus:ring-2 focus:ring-orange-400 text-black" />
          <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="New Password" className="border p-3 rounded focus:ring-2 focus:ring-orange-400 text-black" />
          <input name="dob" type="date" value={form.dob} onChange={handleChange} className="border p-3 rounded focus:ring-2 focus:ring-orange-400 text-black" />
          <select name="gender" value={form.gender} onChange={handleChange} className="border p-3 rounded focus:ring-2 focus:ring-orange-400 text-black">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-400 text-black p-3 rounded-lg font-bold hover:bg-orange-500 transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>

          <p
            className={`text-center text-sm text-black mt-3 transform transition-all duration-1000 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Already have an account?{" "}
            <Link
              to="/"
              className="font-bold text-orange-600 hover:text-orange-700 hover:scale-105 transition-transform duration-300 inline-block"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
