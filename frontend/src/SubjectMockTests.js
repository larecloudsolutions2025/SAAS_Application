// src/SubjectMockTests.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "./components/BackButton";

function SubjectMockTests() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("Aptitude");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({});

  const subjects = ["Aptitude", "Reasoning", "English"];

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const testRes = await axios.get("http://localhost:8000/mocktests/subject", {
          withCredentials: true,
        });
        setTests(testRes.data);

        const resRes = await axios.get("http://localhost:8000/mocktests/results/summary", {
          withCredentials: true,
        });
        const map = {};
        resRes.data.forEach((r) => (map[r.mocktest_id] = r));
        setResults(map);
      } catch (err) {
        console.error("Error fetching subject tests:", err);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleStartTest = (test) => {
    navigate("/instructions", { state: { testId: test.id } });
  };

  const handlePreview = (test, result) => {
    navigate("/preview-test", { state: { resultId: result.id, testName: test.name } });
  };

  const filteredTests = tests.filter((t) => t.subject === selectedSubject);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading your subject-wise tests...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <BackButton label="Back" />
        <h1 className="text-2xl font-bold text-orange-700 text-center mb-6">Subject-wise Mock Tests</h1>
      </div>

      {/* Subject Tabs */}
      <div className="flex justify-center mb-8 space-x-4">
        {subjects.map((subj) => (
          <motion.button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: selectedSubject === subj ? 1.1 : 1,
              backgroundColor: selectedSubject === subj ? "#ea580c" : "#ffffff",
              color: selectedSubject === subj ? "#ffffff" : "#ea580c",
            }}
            transition={{ duration: 0.3 }}
            className={`px-6 py-2 rounded-full font-semibold shadow-md border border-orange-400`}
          >
            {subj}
          </motion.button>
        ))}
      </div>

      {/* Animated Test Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSubject}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTests.length === 0 ? (
            <motion.p
              key="no-tests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-600 italic col-span-3"
            >
              No {selectedSubject} tests available right now.
            </motion.p>
          ) : (
            filteredTests.map((test, idx) => {
              const result = results[test.id];
              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-all"
                >
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">
                      {test.name}
                    </h2>
                    <p className="text-gray-600 mb-1">
                      ⏱ Duration: {test.duration_minutes || 20} mins
                    </p>
                    <p className="text-gray-600 mb-3">
                      📘 Questions: {test.total_questions || "N/A"}
                    </p>
                  </div>

                  {result ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2"
                    >
                      <button
                        onClick={() => handlePreview(test, result)}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        Preview Test
                      </button>
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
                    </motion.div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStartTest(test)}
                      className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-semibold"
                    >
                      Start Test
                    </motion.button>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SubjectMockTests;
