// src/pages/TakeTest.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "./components/BackButton";

function TakeTest() {
  const navigate = useNavigate();
  const location = useLocation();

  let testId = location.state?.testId;  
  const testName = location.state?.testName || "Mock Test";
  const [timer, setTimer] = useState(0); // ✅ Timer state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState("");
  const [reviewedQuestions, setReviewedQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const timerRef = useRef(null);

  if (!testId) {
    const savedSession = JSON.parse(localStorage.getItem("activeTestSession"));
    testId = savedSession?.testId;
  }
  // 🧭 Fetch the test data from backend
  const fetchTest = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/mocktests/${testId}/resume`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (res.status === 200) {
        const data = res.data;
        setQuestions(data.questions || []);
        setSections(Object.keys(data.sections || {}));
        setCurrentSection(Object.keys(data.sections || [])[0] || "");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading test:", error);
      alert("⚠️ Please go to Full Mock Tests and start the test again.");
      navigate("/fullmocktests");
    }
  };


  useEffect(() => {
    if (!testId) {
      alert("⚠️ Invalid or missing test session. Please go to Full Mock Tests page and start the test again.");
      navigate("/fullmocktests");
      return;
    }

    fetchTest();
  }, [testId]);


  useEffect(() => {
    const session = localStorage.getItem("activeTestSession");
    if (!session) {
      navigate("/instructions");
      return;
    }

    const { startedAt } = JSON.parse(session);
    if (!startedAt) {
      navigate("/instructions");
      return;
    }

    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const remaining = Math.max(0, 3600 - elapsedSeconds);
    setTimer(remaining);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("activeTestSession");
          alert("⏰ Time’s up! The test will now be submitted automatically.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);




  // ✅ Load Test
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/mocktests/${testId}/resume`,
          { withCredentials: true }
        );
        const qlist = res.data.questions || [];
        setQuestions(qlist);

        const sectionSet = new Set(qlist.map((q) => q.section || "General"));
        const sectionArr = Array.from(sectionSet);
        setSections(sectionArr);
        setCurrentSection(sectionArr[0] || "General");
      } catch (err) {
        console.error("Error loading test:", err);
        alert("Unable to load test. Please start again from Full Mock Tests page.");
        navigate("/full-mock-tests");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId, navigate]);

  // ✅ Timer setup
  useEffect(() => {
    const handleAutoSubmit = () => {
      handleSubmit(true);
    };

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // ✅ Format time
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ✅ Clear selected answer for the current question
const handleClearResponse = (qid) => {
  setAnswers((prev) => {
    const updated = { ...prev };
    delete updated[qid];
    return updated;
  });
};


  // ✅ Handle option select
  const handleOptionChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  // ✅ Submit Test
  const handleSubmit = async (auto = false) => {
    try {
      const payload = { answers };
      const attemptId = `attempt-${Date.now()}`;
      const res = await axios.post(
        `http://localhost:8000/mocktests/${testId}/submit/${attemptId}`,
        payload,
        { withCredentials: true }
      );
      if (res.data.result_id) {
        setSubmitted(true);
        clearInterval(timerRef.current);
        alert(auto ? "⏰ Time’s up! Test auto-submitted." : "✅ Test submitted successfully!");
        navigate("/full-mock-tests", { state: { refresh: Date.now() } });
      }
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Error submitting test. Please try again.");
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Loading test...</p>;
  if (questions.length === 0)
    return <p className="text-center mt-8 text-gray-600">No questions available.</p>;

  // ✅ Section filtering
  const sectionQuestions = questions.filter((q) => q.section === currentSection);
  const q = sectionQuestions[current];
  if (!q) return <p className="text-center text-gray-500">No question found for this section.</p>;

  const questionText =
    q?.question_text || q?.question || `Question ${q?.question_id || current + 1}`;

  const currentQuestion = q;
  const handleQuestionClick = (questionId) => {
  // Find in current section first
  const idx = sectionQuestions.findIndex((it) => String(it.question_id) === String(questionId));
  if (idx !== -1) {
    setCurrent(idx);
    return;
  }
  const found = questions.find((it) => String(it.question_id) === String(questionId));
  if (found) {
    const newSection = found.section || "General";
    const newSectionQuestions = questions.filter((it) => (it.section || "General") === newSection);
    const newIndex = newSectionQuestions.findIndex((it) => String(it.question_id) === String(questionId));
    if (newIndex !== -1) {
      setCurrentSection(newSection);
      // small delay to ensure sectionQuestions updates (react state)
      setTimeout(() => {
        setCurrent(newIndex);
      }, 0);
    }
  }
};

  // ✅ Palette color logic
  const getPaletteColor = (index) => {
    const qid = sectionQuestions[index].question_id;
    if (answers[qid]) return "bg-green-500 text-white";
    if (index === current) return "bg-blue-500 text-white";
    return "bg-gray-300 text-gray-800";
  };

  // ✅ Section change
  const handleSectionChange = (sec) => {
    setCurrentSection(sec);
    setCurrent(0);
  };

  return (
    <div className="min-h-screen bg-orange-50 py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Section */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <BackButton fallback="/instructions" label="Exit Test" />
            <h2 className="text-xl font-bold">{testName}</h2>
            <div className="text-lg font-semibold text-red-600">
              ⏱ Time Left: {formatTime(timeLeft)}
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex justify-center mb-4 space-x-3">
            {sections.map((sec) => (
              <button
                key={sec}
                className={`px-4 py-2 rounded font-semibold ${
                  sec === currentSection
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handleSectionChange(sec)}
              >
                {sec}
              </button>
            ))}
          </div>

          {!submitted ? (
            <>
              {/* Question Display */}
              <div className="mb-6">
                {/* ✅ Always show passage text if available */}
                  {q?.passage_text && (
                    <div className="mb-4 p-3 bg-gray-100 rounded text-justify">
                      <h4 className="font-semibold mb-2">Passage</h4>
                      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {q.passage_text}
                      </p>

                      {/* ✅ Show passage image if available */}
                      {q?.passage_image && (
                        <div className="mt-3 flex justify-center">
                          <img
                            src={
                              q.passage_image?.startsWith("http")
                                ? q.passage_image
                                : `http://localhost:8000/${q.passage_image.replace(/^\/+/, "")}`
                            }
                            alt="Passage visual"
                            className="max-w-full rounded shadow"
                          />
                        </div>
                      )}
                    </div>
                  )}


                {/* ✅ Show question image */}
                {q?.question_image && (
                  <div className="mb-3 flex justify-center">
                    <img
                      src={
                        q.question_image?.startsWith("http")
                          ? q.question_image
                          : `http://localhost:8000/${q.question_image.replace(/^\/+/, "")}`
                      }
                      alt="Question visual"
                      className="max-w-full rounded shadow"
                    />
                  </div>
                )}

                {/* ✅ Question Title with ID */}
                <h3 className="text-lg font-semibold mb-3">
                  <span className="text-orange-600 font-bold">
                    {q?.question_id ? `Q${q.question_id}. ` : ""}
                  </span>
                  {questionText}
                </h3>

                {/* ✅ Always render up to 5 options */}
                {q?.options && q.options.length > 0 ? (
                  q.options.map((opt, idx) => {
                    const optLetter = String.fromCharCode(65 + idx);
                    const qid = q.question_id;
                    return (
                      <label
                        key={`${qid}-${optLetter}`}
                        className="block mb-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={qid}
                          value={optLetter}
                          checked={answers[qid] === optLetter}
                          onChange={() => handleOptionChange(qid, optLetter)}
                          className="mr-2"
                        />
                        {opt ? `${optLetter}. ${opt}` : null}
                      </label>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No options available.</p>
                )}
              </div>
              {/* ✅ Clear Response Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleClearResponse(q.question_id)}
                  disabled={!answers[q.question_id]}
                  className={`px-4 py-2 rounded ${
                    answers[q.question_id]
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Clear Response
                </button>
              </div>


              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
                  disabled={current === 0}
                  className={`px-4 py-2 rounded ${
                    current === 0
                      ? "bg-gray-300 text-gray-600"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrent((prev) =>
                      Math.min(prev + 1, sectionQuestions.length - 1)
                    )
                  }
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Next
                </button>
                {/* Mark for Review (plain button, toggles yellow state) */}
                  {currentQuestion && (
                    <button
                      onClick={() => {
                        const qid = String(currentQuestion.question_id);
                        setReviewedQuestions((prev) =>
                          prev.includes(qid) ? prev.filter((id) => id !== qid) : [...prev, qid]
                        );
                      }}
                      className="ml-2 px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      {reviewedQuestions.includes(String(currentQuestion.question_id))
                        ? "Unmark Review"
                        : "Mark for Review"}
                    </button>
                  )}


              </div>
            </>
          ) : (
            <p className="text-center text-green-600 font-semibold mt-6">
              ✅ Test submitted successfully!
            </p>
          )}
        </div>

        {/* Question Palette & Submit */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-center">
              Question Palette
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {sectionQuestions.map((qitem, index) => {
                const qid = String(qitem.question_id);
                const isAnswered = !!answers[qid];
                const isCurrent = String(currentQuestion?.question_id) === qid;
                const isReviewed = reviewedQuestions.includes(qid);

                let palClass = "bg-gray-300 text-gray-800";
                if (isReviewed) palClass = "bg-yellow-400 text-black"; // review → yellow
                else if (isCurrent) palClass = "bg-blue-500 text-white";
                else if (isAnswered) palClass = "bg-green-500 text-white";

                return (
                  <button
                    key={qid}
                    onClick={() => handleQuestionClick(qid)}
                    className={`rounded-full w-10 h-10 font-semibold ${palClass}`}
                    title={`Q${qid}`}
                  >
                    {qid}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center mb-1">
                <span className="inline-block w-4 h-4 bg-green-500 mr-2"></span>
                Answered
              </div>
              <div className="flex items-center mb-1">
                <span className="inline-block w-4 h-4 bg-gray-300 mr-2"></span>
                Not Answered
              </div>
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>
                Current
              </div>
            </div>
          </div>

          {/* ✅ Submit Button */}
          <button
            onClick={() => handleSubmit(false)}
            className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default TakeTest;
