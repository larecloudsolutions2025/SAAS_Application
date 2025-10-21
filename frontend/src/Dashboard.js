import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-6 transition-all duration-1000">
      <div
        className={`w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 transform transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-3xl font-bold text-black text-center mb-6">
          Dashboard
        </h1>

        <p className="text-center text-gray-700 mb-8">
          Welcome to your dashboard! Use the buttons below to navigate to different sections of your application.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
          <button
            className="w-full sm:w-60 bg-gradient-to-r from-orange-400 to-yellow-300 text-black px-6 py-3 rounded font-bold hover:from-orange-500 hover:to-yellow-400 transition-transform transform hover:scale-105 shadow"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          <button
            className="w-full sm:w-60 bg-gradient-to-r from-yellow-300 to-orange-400 text-black px-6 py-3 rounded font-bold hover:from-yellow-400 hover:to-orange-500 transition-transform transform hover:scale-105 shadow"
            onClick={() => navigate("/full-mock-tests")}
          >
            Full Mocktests
          </button>

          <button
            className="w-full sm:w-60 bg-gradient-to-r from-orange-300 to-yellow-300 text-black px-6 py-3 rounded font-bold hover:from-orange-400 hover:to-yellow-400 transition-transform transform hover:scale-105 shadow"
            onClick={() => navigate("/subject-mocktests")}
          >
            Subject-wise Mocktests
          </button>

          <button
            className="w-full sm:w-60 bg-gradient-to-r from-yellow-300 to-orange-400 text-black px-6 py-3 rounded font-bold hover:from-yellow-400 hover:to-orange-500 transition-transform transform hover:scale-105 shadow"
            onClick={() => navigate("/syllabus")}
          >
            Syllabus
          </button>

          <button
            className="w-full sm:w-60 bg-red-500 text-white px-6 py-3 rounded font-bold hover:bg-red-600 transition-transform transform hover:scale-105 shadow"
            onClick={() => navigate("/logout")}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
