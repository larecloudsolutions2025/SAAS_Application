// src/components/BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ✅ Correct icon import

/**
 * Clean and compact Back Button Component
 * Usage:
 *   <BackButton />
 *   <BackButton label="Back to Dashboard" />
 *   <BackButton fallback="/dashboard" />
 */
const BackButton = ({ label = "Back", fallback = -1 }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // ✅ navigate(-1) goes back one page in history
    if (typeof fallback === "string") {
      navigate(fallback);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-200"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
};

export default BackButton;
