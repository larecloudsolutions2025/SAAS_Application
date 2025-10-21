// src/pages/FullMockTests.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "./components/BackButton";

function FullMockTests() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ detect page navigation (re-render)
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all mock tests + results
  const fetchAll = async () => {
    try {
      // Fetch tests
      const testRes = await axios.get("http://localhost:8000/mocktests/full", {
        withCredentials: true,
      });
      setTests(testRes.data);

      // Fetch user results
      const resRes = await axios.get(
        "http://localhost:8000/mocktests/results/summary",
        { withCredentials: true }
      );
      const resultMap = {};
      resRes.data.forEach((r) => (resultMap[r.mocktest_id] = r));
      setResults(resultMap);
    } catch (err) {
      console.error("Error fetching data:", err);
      setTests([]);
      setResults({});
    } finally {
      setLoading(false);
    }
  };

  // ✅ Re-fetch whenever user navigates back to this page
  useEffect(() => {
    fetchAll();
  }, [location.key, location.state?.refresh]); // triggers whenever page is reloaded or navigated back

  // ✅ Secure Start Test (pass state)
  const handleStartTest = (test) => {
    navigate("/take-test", {
      state: { testId: test.id, testName: test.name },
    });
  };

  // ✅ Secure Preview (pass state)
  const handlePreview = (test, result) => {
    navigate("/preview-test", {
      state: { resultId: result.id, testName: test.name },
  });

  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading your mock tests...
      </div>
    );

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-700">
        <BackButton fallback="/dashboard" label="Back to Dashboard" />
        🧠 Full Mock Tests
      </h1>

      {tests.length === 0 ? (
        <p className="text-center text-gray-600">
          No mock tests available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const result = results[test.id];

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">
                    {test.name || `Mock Test ${test.id}`}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    Duration: {test.duration_minutes || 60} mins
                  </p>
                  <p className="text-gray-600 mb-3">
                    Total Questions: {test.total_questions || "N/A"}
                  </p>
                </div>

                {result ? (
                  <div className="mt-2">
                    <button
                      onClick={() => handlePreview(test, result)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Preview Test
                    </button>

                    {/* <a
                      href={`http://localhost:8000/mocktests/result/${result.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Download Report
                    </a> */}
                    
                    <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-700 text-sm">
                        <b>Score:</b> {result.score} / {result.total_questions}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <b>Percentage:</b> {result.percentage}%
                      </p>
                      <p className="text-gray-700 text-sm">
                        <b>Status:</b>{" "}
                        <span className="text-green-600 font-semibold">
                          Completed
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/instructions", { state: { testId: test.id } })}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-semibold"
                  >
                    Start Test
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FullMockTests;
