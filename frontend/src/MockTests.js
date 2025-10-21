// src/MockTests.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MockTests() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/");
      return;
    }

    const fetchTests = async () => {
      try {
        const res = await axios.get("http://localhost:8000/mocktests/full", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(res.data || []);
      } catch (err) {
        console.error("Error fetching mocktests:", err);
        toast.error("Unable to load mocktests");
      }
    };

    fetchTests();
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Full Mock Tests</h1>

        {tests.length === 0 ? (
          <div className="p-6 bg-white rounded shadow">No mock tests available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((test) => (
              <div key={test.id} className="bg-white p-5 rounded shadow flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{test.name}</h2>
                  <p className="text-sm text-gray-600">
                    Questions: {test.total_questions} | Duration: {test.duration_minutes} mins
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/take-test/${test.id}`)}
                    className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
