import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "./components/BackButton";


const Instructions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testId = location.state?.testId; // passed from tests list

  const [agree, setAgree] = useState(false);
  const [countdown, setCountdown] = useState(60); // optional timer
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    // prevent direct access without testId
    if (!testId) {
      navigate("/full-mock-tests");
      return;
    }

    // countdown logic (optional)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanStart(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [testId, navigate]);

  const handleStart = () => {
    if (!agree) {
      alert("Please agree to the instructions before starting.");
      return;
    }

    const startTest = (testId, testName) => {
    const session = {
        testId,
        testName,
        startedAt: Date.now(),
    };
    localStorage.setItem("activeTestSession", JSON.stringify(session));
    navigate("/take-test", { state: { testId, testName } });
    };


    // save test start info (no backend needed)
    const startInfo = {
      testId,
      startedAt: Date.now(),
    };
    localStorage.setItem("activeTestSession", JSON.stringify(startInfo));

    // redirect to TakeTest
    navigate("/take-test");
  };

  const instructionsList = [
    "The total duration of the test will be displayed on the screen.",
    "Each wrong answer will carry a penalty of 0.25 marks.",
    "Do not refresh or close the browser window during the test.",
    "Once you start the test, the timer will begin immediately.",
    "Use the 'Next' and 'Previous' buttons to navigate between questions.",
    "You can mark questions for review before submitting the test.",
    "Your test will be automatically submitted once the time is over.",
  ];

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
        <BackButton fallback="/fullmocktests" label="Back to Mock Tests" />
        <h1 className="text-2xl font-bold text-orange-700 mb-4 text-center">
          Test Instructions
        </h1>

        <p className="text-gray-700 mb-4 text-center">
          Please read the following instructions carefully before starting your
          test.
        </p>

        <ul className="list-decimal ml-5 space-y-2 text-gray-700 mb-6">
          {instructionsList.map((inst, i) => (
            <li key={i}>{inst}</li>
          ))}
        </ul>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="agree"
            className="mr-3 w-5 h-5 accent-orange-600"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label htmlFor="agree" className="text-gray-800 font-medium">
            I have read and understood all the instructions carefully.
          </label>
        </div>

        <div className="text-center mb-4 text-gray-700">
          {countdown > 0 ? (
            <p>
              ⏳ Please wait <strong>{countdown}</strong> seconds before you can
              start.
            </p>
          ) : (
            <p className="text-green-600 font-semibold">
              ✅ You can now start your test.
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/full-mock-tests")}
            className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold"
          >
            Cancel
          </button>
          <button
            disabled={!agree || (!canStart && countdown > 0)}
            onClick={handleStart}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
              agree && canStart
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
