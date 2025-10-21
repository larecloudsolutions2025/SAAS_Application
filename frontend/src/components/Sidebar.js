import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  UserCircle,
  ListChecks,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, route: "/dashboard" },
    { name: "Full Mocktests", icon: BookOpen, route: "/fullmocktests" },
    { name: "Subject-wise Tests", icon: ListChecks, route: "/subjecttests" },
    { name: "Syllabus", icon: BookOpen, route: "/syllabus" },
    { name: "Profile", icon: UserCircle, route: "/profile" },
  ];

  const handleLogout = () => {
    alert("Logging out... (you can integrate backend API here)");
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isOpen ? 240 : 80 }}
        className="h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-blue-700 text-white shadow-xl flex flex-col justify-between transition-all duration-500"
      >
        {/* Top Section */}
        <div>
          {/* Logo + Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-indigo-700">
            <motion.h1
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="text-2xl font-extrabold tracking-wide text-white"
            >
              SmartExam360
            </motion.h1>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-indigo-700"
            >
              {isOpen ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="mt-6 space-y-1">
            {menuItems.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 p-3 mx-3 rounded-lg cursor-pointer hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
                onClick={() => navigate(item.route)}
              >
                <item.icon size={22} />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-indigo-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content (Placeholder for now) */}
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Your Exam Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Navigate through the sidebar to access tests, syllabus, or your
          profile.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
