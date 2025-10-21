import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Logout() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);

    const logoutUser = async () => {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully!");
      navigate("/");
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center">
      <div
        className={`text-2xl font-bold text-black transform transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        Logging out...
      </div>
    </div>
  );
}