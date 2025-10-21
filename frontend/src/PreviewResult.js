// src/PreviewResult.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import BackButton from "./components/BackButton";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function PreviewResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultId = location.state?.resultId;
  const testName = location.state?.testName || "Mock Test";

  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [passages, setPassages] = useState({});
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!resultId) {
      alert("No result selected. Returning to tests list.");
      navigate("/full-mock-tests");
      return;
    }

    const fetchPreview = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/mocktests/result/${resultId}/preview`,
          { withCredentials: true }
        );
        let qlist = Array.isArray(res.data.questions)
          ? res.data.questions
          : [];

        // ✅ Ensure options array exists (fix for missing Option B)
        qlist = qlist.map((q) => {
          const options =
            q.options && Array.isArray(q.options) && q.options.length
              ? q.options
              : [
                  q.option_a || "",
                  q.option_b || "",
                  q.option_c || "",
                  q.option_d || "",
                  q.option_e || "",
                ].filter((o) => o !== "");
          return { ...q, options };
        });

        setQuestions(qlist);
        setSummaryData(res.data.sections_summary || []);
        setTotalScore(res.data.score || 0);
        setPercentage(parseFloat(res.data.percentage) || 0);
        setAnalytics(res.data.analytics || null);

        const secOrder = [];
        qlist.forEach((q) => {
          const s = q.section || "General";
          if (!secOrder.includes(s)) secOrder.push(s);
        });
        const sarr = secOrder.length ? secOrder : ["General"];
        setSections(sarr);
        setCurrentSection(sarr[0]);

        const pmap = {};
        qlist.forEach((q) => {
          if (q.passage_id && q.passage_text)
            pmap[q.passage_id] = q.passage_text;
        });
        setPassages(pmap);

        // ✅ Default to the first question id
        if (qlist.length > 0) setCurrentQuestionId(qlist[0].question_id);
      } catch (err) {
        console.error("Error fetching preview:", err);
        alert("Unable to load preview. Please try again.");
        navigate("/full-mock-tests");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [resultId, navigate]);

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Loading preview...</p>;

  if (!questions || questions.length === 0)
    return (
      <div className="text-center mt-8">
        <h2 className="text-lg font-semibold">
          No result data available for this test.
        </h2>
        <button
          onClick={() => navigate("/full-mock-tests")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );

  // Filter questions for the current section
  const sectionQuestions = questions.filter(
    (q) => (q.section || "General") === currentSection
  );
  const currentIndex = sectionQuestions.findIndex(
    (q) => q.question_id === currentQuestionId
  );
  const q = sectionQuestions[currentIndex] || {};

  const passageText =
    (q.passage_id && passages[q.passage_id])
      ? passages[q.passage_id]
      : q.passage_text || "";

  const handleNext = () => {
    const totalInSection = sectionQuestions.length;
    const sectionIndex = sections.indexOf(currentSection);
    const lastSection = sectionIndex === sections.length - 1;

    if (currentIndex < totalInSection - 1) {
      setCurrentQuestionId(sectionQuestions[currentIndex + 1].question_id);
    } else if (!lastSection) {
      const nextSection = sections[sectionIndex + 1];
      const nextSectionQuestions = questions.filter(
        (q) => (q.section || "General") === nextSection
      );
      if (nextSectionQuestions.length > 0)
        setCurrentQuestionId(nextSectionQuestions[0].question_id);
      setCurrentSection(nextSection);
    } else {
      alert("🎉 You have reached the end of the review!");
    }
  };

  const handlePrevious = () => {
    const sectionIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentQuestionId(sectionQuestions[currentIndex - 1].question_id);
    } else if (sectionIndex > 0) {
      const prevSection = sections[sectionIndex - 1];
      const prevQuestions = questions.filter(
        (q) => (q.section || "General") === prevSection
      );
      setCurrentSection(prevSection);
      setCurrentQuestionId(
        prevQuestions[prevQuestions.length - 1].question_id
      );
    } else {
      alert("You're at the first question already!");
    }
  };

  const optionClass = (optIndex) => {
    if (!q || !q.options || q.options.length === 0)
      return "border border-gray-300 p-3 rounded mb-2";
    const optionLetter = String.fromCharCode(65 + optIndex);
    const isCorrect = q.correct && q.correct.toUpperCase() === optionLetter;
    const isSelected = q.selected && q.selected.toUpperCase() === optionLetter;
    let classes = "p-3 rounded-xl mb-2 border ";
    if (isCorrect)
      classes += "border-green-600 bg-green-50 text-green-800 font-semibold";
    else if (isSelected && !isCorrect)
      classes += "border-red-600 bg-red-50 text-red-800 font-semibold";
    else classes += "border-gray-300 bg-white";
    return classes;
  };

  const getPaletteColor = (qitem) => {
    if (!qitem.selected)
      return "bg-gray-300 text-gray-800";
    return qitem.is_correct
      ? "bg-green-500 text-white"
      : "bg-red-500 text-white";
  };

  const verdict =
    percentage >= 80
      ? "Excellent 🌟"
      : percentage >= 60
      ? "Good 👍"
      : "Needs Improvement ⚠️";

  const totalCorrect = summaryData.reduce((sum, s) => sum + s.correct, 0);
  const totalWrong = summaryData.reduce((sum, s) => sum + s.wrong, 0);
  const totalUnattempted = summaryData.reduce(
    (sum, s) => sum + s.unattempted,
    0
  );

  const pieData = {
    labels: ["Correct", "Wrong", "Unattempted"],
    datasets: [
      {
        data: [totalCorrect, totalWrong, totalUnattempted],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
        hoverOffset: 6,
      },
    ],
  };

  const barData = {
    labels: summaryData.map((s) => s.section_name),
    datasets: [
      {
        label: "Marks Scored",
        data: summaryData.map((s) => s.marks),
        backgroundColor: "#007bff",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#444" } },
      x: { ticks: { color: "#444" } },
    },
  };

  return (
    <div className="min-h-screen bg-orange-50 py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left/Main Section */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
          <BackButton fallback="/fullmocktests" label="Back to Tests" />
          <h2 className="text-xl font-bold text-orange-700 mb-4">
            {testName} - Review & Analysis
          </h2>

          {/* Section Tabs */}
          <div className="flex gap-3 mb-4 justify-start pl-4">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setCurrentSection(sec);
                  const firstQ = questions.find(
                    (q) => (q.section || "General") === sec
                  );
                  if (firstQ) setCurrentQuestionId(firstQ.question_id);
                }}
                className={`px-4 py-2 rounded font-semibold ${
                  sec === currentSection
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Question Palette */}
          <div className="bg-gray-50 p-3 rounded-lg mb-6 shadow-inner">
            <h3 className="text-md font-semibold mb-2 text-center">
              Question Palette
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {sectionQuestions.map((qi) => (
                <button
                  key={qi.question_id}
                  onClick={() => setCurrentQuestionId(qi.question_id)}
                  className={`rounded-full w-10 h-10 font-semibold ${getPaletteColor(
                    qi
                  )}`}
                >
                  {qi.question_id}
                </button>
              ))}
            </div>
          </div>

          {/* Question, Options, Explanation */}
          {passageText && (
            <div className="mb-4 p-4 bg-gray-100 rounded text-justify whitespace-pre-line">
              <h4 className="font-semibold mb-2">Passage</h4>
              <p>{passageText}</p>
            </div>
          )}

          {q?.question_image && (
            <div className="mb-4 flex justify-center">
              <img
                src={
                  q.question_image.startsWith("http")
                    ? q.question_image
                    : `http://localhost:8000/${q.question_image.replace(/^\/+/, "")}`
                }
                alt="Question visual"
                className="max-w-full rounded shadow"
              />
            </div>
          )}

          <div className="mb-6">
            <p className="font-semibold text-lg mb-4">
              Q{q.question_id}. {q.question_text || "Question not available"}
            </p>
            {q.options?.map((opt, i) => (
              <div key={i} className={optionClass(i)}>
                <span className="font-semibold mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span>{opt || "-"}</span>
              </div>
            ))}

            {/* Explanation Section */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-semibold text-blue-700 mb-2">Explanation</h3>

              {q?.explanation_image && (
                <div className="mb-3 flex justify-center">
                  <img
                    src={
                      q.explanation_image.startsWith("http")
                        ? q.explanation_image
                        : `http://localhost:8000/${q.explanation_image.replace(/^\/+/, "")}`
                    }
                    alt="Explanation visual"
                    className="max-w-full rounded shadow"
                    onError={(e) => {
                      console.warn(
                        "⚠️ Explanation image not found:",
                        q.explanation_image
                      );
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <p className="text-gray-700 whitespace-pre-line">
                {q.explanation || "No explanation available."}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-center text-orange-700 mb-3">
            Test Summary
          </h3>

          <div className="text-center mb-4">
            <p className="text-md font-semibold text-gray-700">
              🎯 Score: {totalScore}
            </p>
            <p className="text-md text-gray-700">
              📊 Percentage: {percentage.toFixed(2)}%
            </p>
            <p
              className={`font-bold mt-2 ${
                verdict.includes("Needs")
                  ? "text-red-600"
                  : "text-green-700"
              }`}
            >
              💬 {verdict}
            </p>
          </div>

          {/* Pie Chart */}
          <div className="mb-6">
            <h4 className="text-center text-sm text-gray-600 mb-2 font-medium">
              Overall Distribution
            </h4>
            <Pie data={pieData} />
          </div>

          {/* Bar Chart */}
          <div className="mb-6">
            <h4 className="text-center text-sm text-gray-600 mb-2 font-medium">
              Section-wise Marks
            </h4>
            <Bar data={barData} options={barOptions} />
          </div>

          {/* Topper vs You */}
          {analytics && (
            <div className="bg-orange-50 rounded-lg p-3 mb-6 border border-orange-200">
              <h4 className="text-md font-semibold text-orange-700 mb-2 text-center">
                Topper vs You
              </h4>
              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>You: {totalScore}</span>
                <span>Topper: {analytics.topper_score}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden mb-2">
                <div
                  className="bg-orange-500 h-full"
                  style={{
                    width: `${(totalScore / analytics.topper_score) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="text-center text-gray-700 text-sm">
                🏅 Rank:{" "}
                <span className="font-semibold">
                  {analytics.rank}
                </span>{" "}
                / {analytics.total_users}
                <br />
                📈 Percentile:{" "}
                <span className="font-semibold">
                  {analytics.percentile}%
                </span>
                <br />
                🎖️ Performance:{" "}
                <span
                  className={`font-bold ${
                    analytics.performance_band.includes("Top")
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {analytics.performance_band}
                </span>
              </div>
            </div>
          )}

          {/* Section Summary */}
          <table className="min-w-full border border-gray-200 text-sm text-gray-800 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Section</th>
                <th className="border px-2 py-1">Correct</th>
                <th className="border px-2 py-1">Wrong</th>
                <th className="border px-2 py-1">Marks</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 text-center">
                  <td className="border px-2 py-1 font-medium">
                    {row.section_name}
                  </td>
                  <td className="border px-2 py-1 text-green-600 font-semibold">
                    {row.correct}
                  </td>
                  <td className="border px-2 py-1 text-red-600 font-semibold">
                    {row.wrong}
                  </td>
                  <td className="border px-2 py-1">{row.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PreviewResult;
