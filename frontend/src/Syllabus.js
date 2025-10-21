// src/Syllabus.js
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "./components/BackButton";


const syllabusData = {
  "SBI PO": {
    examDetails: {
      "Exam Name": "SBI Probationary Officer (PO)",
      "Bank Name": "State Bank of India (SBI)",
      "Mode of Exam": "Online",
      "Exam Date 2025": "Prelims - Sept/Oct 2025 | Mains - Nov 2025",
      "Negative Marking": "¼th mark (0.25 marks)",
      "Selection Process": "Prelims → Mains → GD/Interview",
      "Official Website": "www.sbi.co.in",
    },
    prelimsPattern: [
      { subject: "English Language", questions: 30, marks: 30, duration: "20 minutes" },
      { subject: "Quantitative Aptitude", questions: 35, marks: 35, duration: "20 minutes" },
      { subject: "Reasoning Ability", questions: 35, marks: 35, duration: "20 minutes" },
    ],
    mainsPattern: [
      { subject: "Reasoning & Computer Aptitude", questions: 45, marks: 60, duration: "60 minutes" },
      { subject: "Data Analysis & Interpretation", questions: 35, marks: 60, duration: "45 minutes" },
      { subject: "General/Economy/Banking Awareness", questions: 40, marks: 40, duration: "35 minutes" },
      { subject: "English Language", questions: 35, marks: 40, duration: "40 minutes" },
      { subject: "Descriptive Test", questions: 2, marks: 50, duration: "30 minutes" },
    ],
    prelimsSyllabus: [
      {
        subject: "Quantitative Aptitude",
        topics: [
          "Simplification/Approximation",
          "Profit & Loss",
          "Mixtures & Alligations",
          "Permutation, Combination & Probability",
          "Work & Time",
          "Sequence & Series",
          "Simple & Compound Interest",
          "Mensuration – Cylinder, Cone, Sphere",
          "Surds & Indices",
          "Time & Distance",
          "Data Interpretation",
          "Ratio & Proportion",
          "Number Systems",
          "Percentage",
          "Quadratic Equation",
        ],
      },
      {
        subject: "Reasoning Ability",
        topics: [
          "Alphanumeric Series",
          "Directions",
          "Logical Reasoning",
          "Data Sufficiency",
          "Alphabet Test",
          "Ranking & Order",
          "Seating Arrangement",
          "Coded Inequalities",
          "Puzzle",
          "Syllogism",
          "Blood Relations",
          "Coding-Decoding",
          "Input-Output",
          "Tabulation",
        ],
      },
      {
        subject: "English Language",
        topics: [
          "Reading Comprehension",
          "Fill in the blanks",
          "Cloze Test",
          "Para Jumbles",
          "Vocabulary",
          "Puzzles & Sentence Rearrangement",
          "Paragraph Completion",
          "Word Association",
          "Sentence Improvement",
          "Tenses Rules",
          "Double Fillers",
          "Word Usage",
          "Error Spotting",
          "Sentence Completion",
        ],
      },
    ],
    mainsSyllabus: [
      {
        subject: "Reasoning",
        topics: [
          "Verbal Reasoning",
          "Syllogism",
          "Seating Arrangement & Puzzles",
          "Double Lineup",
          "Scheduling",
          "Input Output",
          "Blood Relations",
          "Directions and Distances",
          "Ordering and Ranking",
          "Data Sufficiency",
          "Coding and Decoding",
          "Code Inequalities",
          "Course of Action",
          "Critical Reasoning",
          "Analytical and Decision Making",
        ],
      },
      {
        subject: "Data Analysis & Interpretation",
        topics: [
          "Tabular Graph",
          "Line Graph",
          "Bar Graph",
          "Charts & Tables",
          "Missing Case DI",
          "Radar Graph Caselet",
          "Probability",
          "Data Sufficiency",
          "Caselet DI",
          "Permutation and Combination",
          "Pie Charts",
        ],
      },
      {
        subject: "General/Economy/Banking Awareness",
        topics: [
          "Current Affairs",
          "Financial Awareness",
          "General Knowledge",
          "Static Awareness",
          "Banking Terminologies Knowledge",
          "Banking Awareness",
          "Principles of Insurance",
        ],
      },
      {
        subject: "English Language",
        topics: [
          "Reading Comprehension",
          "Grammar",
          "Verbal Ability",
          "Vocabulary",
          "Sentence Improvement",
          "Word Association",
          "Para Jumbles",
          "Error Spotting",
          "Cloze Test",
          "Fill in the blanks",
        ],
      },
      {
        subject: "Computer Aptitude",
        topics: [
          "Internet",
          "Memory",
          "Keyboard Shortcuts",
          "Computer Abbreviation",
          "Microsoft Office",
          "Computer Hardware",
          "Computer Software",
          "Computer Fundamentals / Terminologies",
          "Networking",
          "Number System",
          "Operating System",
          "Basic of Logic Gates",
        ],
      },
      {
        subject: "Descriptive Test",
        topics: ["Essay Writing", "Letter Writing"],
      },
    ],
    interview: "GD + Personal Interview focusing on Banking Awareness, Current Affairs, and Personality.",
  },

  "SBI Clerk": {
    examDetails: {
      "Bank Name": "State Bank of India (SBI)",
      "Exam Name": "SBI Clerk (Junior Associates)",
      "Mode of Exam": "Online",
      "Exam Date 2025": "Prelims – 20th, 21st, & 27th September 2025 | Mains – November 2025",
      "No. of Questions": "Prelims-100 | Mains-190",
      "Exam Duration": "Prelims-1 hour | Mains-2 hrs 40 mins",
      "Negative Marking": "¼th mark (0.25 marks)",
      "Selection Process": "Prelims → Mains → Local Language Proficiency Test",
      "Official Website": "www.sbi.co.in",
    },
    prelimsPattern: [
      { subject: "English Language", questions: 30, marks: 30, duration: "20 minutes" },
      { subject: "Numerical Ability", questions: 35, marks: 35, duration: "20 minutes" },
      { subject: "Reasoning Ability", questions: 35, marks: 35, duration: "20 minutes" },
    ],
    mainsPattern: [
      { subject: "General English", questions: 40, marks: 40, duration: "35 minutes" },
      { subject: "Quantitative Aptitude", questions: 50, marks: 50, duration: "45 minutes" },
      { subject: "Reasoning Ability & Computer Aptitude", questions: 50, marks: 60, duration: "45 minutes" },
      { subject: "General / Financial Awareness", questions: 50, marks: 50, duration: "35 minutes" },
    ],
    prelimsSyllabus: [
      { subject: "English Language", topics: ["Reading Comprehension","Cloze Test","Para Jumbles","Miscellaneous","Fill in the blanks","Multiple Meaning","Paragraph Completion","Error Detection","Misspelt","Word/Sentence Rearrangement","Single Filters","Match the column","Para Jumble","Word Usage","Word Swap"] },
      { subject: "Numerical Ability", topics: ["Simplification", "Profit & Loss", "Mixtures & Alligations","Simple & Compound Interest","Surds and Indices","Work & Time","Time & Distance","Mensuration","Data Interpretation","Ratio & Proportion,Percentage","Number Systems","Sequence & Series","Permutation,Combination & Probability","Wrong/Missing Number Series"] },
      { subject: "Reasoning Ability", topics: ["Logical Reasoning	","	Alphanumeric Series","Puzzles","Ranking/Direction/Alphabet Test","Data Sufficiency","Coded Inequalities","Tabulation","Seating Arrangement","Blood Relations","Inequalities","Input Output","	Direction","Letter/Digit/Mix Series","Pair Formation","Syllogism","Meaningful Word","Odd One Out","Coding-Decoding"] },
    ],
    mainsSyllabus: [
      { subject: "Quantitative Aptitude", topics: ["Simplification", "Number Series", "Data Sufficiency","Data Interpretation", "Quadratic Equation", "Time & Distance, Work","Partnership","Profit & Loss","Simple and Compound Interest","Mixture and Allegations","Ratio & Proportion, Averages, Percentages"] },
      { subject: "General English", topics: ["Reading comprehension including Synonyms and Antonyms", "Sentence Rearrangement","Sentence Correction", "Para Jumbles","Spell Checks","Fillers","Cloze Test","Vocabulary", "Error Spotting"] },
      { subject: "Reasoning Ability", topics: ["Internet","Machine Input/Output","Syllogism","Blood Relations","Directions","Inequalities","Puzzles","Coding-Decoding","Ranking","Statement and Assumptions"] },
      { subject: "General / Financial Awareness", topics: ["Current Affairs","News on the banking industry","Awards and honours","Books and authors","Latest appointments","Obituaries","New schemes of central and state governments","Sports","Banking/Financial terms","Static Awareness","Banking and Financial Awareness","Static GK"] },
      { subject: "Computer Aptitude", topics: ["Basics of Computer: Hardware, Software, Generation of Computers","DBMS","Networking","Internet","MS Office","Input-Output Devices","Important Abbreviations"] },

    ],
    interview: "No interview for Clerk positions; final selection is based on Mains + LLPT(Local Language Proficiency Test).",
  },

  // -------------------- IBPS PO --------------------
  "IBPS PO": {
    examDetails: {
      "Organisation": "Institute of Banking Personnel Selection (IBPS)",
      "Post Name": "Probationary Officer",
      "Mode of Exam": "Online",
      "Exam Date 2025": "Prelims – 23rd and 24th August 2025 | Mains – 13th Oct 2025",
      "Negative Marking": "¼th mark (0.25 marks)",
      "Selection Process": "Prelims → Mains → Interview",
      "Official Website": "www.ibps.in",
    },
    prelimsPattern: [
      { subject: "English Language", questions: 30, marks: 30, duration: "20 minutes" },
      { subject: "Quantitative Ability", questions: 35, marks: 30, duration: "20 minutes" },
      { subject: "Reasoning Ability", questions: 35, marks: 40, duration: "20 minutes" },
    ],
    mainsPattern: [
      { subject: "Reasoning & Computer Aptitude", questions: 40, marks: 60, duration: "50 minutes" },
      { subject: "Data Analysis & Interpretation", questions: 35, marks: 50, duration: "45 minutes" },
      { subject: "General/Economy/Banking Awareness", questions: 35, marks: 50, duration: "25 minutes" },
      { subject: "English Language", questions: 35, marks: 40, duration: "40 minutes" },
      { subject: "Descriptive Test(Letter Writing & Essay)", questions: 2, marks: 25, duration: "30 minutes" },
    ],
    prelimsSyllabus: [
      { subject: "English Language", topics: ["Reading Comprehension", "Cloze Test", "Para Jumbles","Multiple Meaning / Error Spotting","Fill in the blanks","Miscellaneous","Paragraph Completion"] },
      { subject: "Quantitative Aptitude", topics: ["Simplification", "Profit & Loss", "Mixtures & Allegations","Simple Interest & Compound Interest","Surds & Indices","Work & Time","Time & Distance","Mensuration","	Data Interpretation","Ratio & Proportion, Percentage","Number Systems","	Sequence & Series","Permutation, Combination &Probability"], },
      { subject: "Reasoning Ability", topics: ["Logical Reasoning","Alphanumeric Series","Ranking/Direction/Alphabet Test","Data Sufficiency","Coded Inequalities","Seating Arrangement","Puzzle","Tabulation","Syllogism","Blood Relations","Input-Output","Coding-Decoding"] },
    ],
    mainsSyllabus: [
      { subject: "Reasoning", topics: ["Verbal Reasoning","Syllogism","Circular Seating Arrangement","Code Inequalities","Linear Seating Arrangement","Double Lineup","Scheduling","Input-Output","Blood Relations","Directions and Distances","Ordering and Ranking","Data Sufficiency","Coding and Decoding"] },
      { subject: "Data Analysis & Interpretation", topics: ["Simplification","Average","Percentage","Mixture and Allegations","Ratio and Percentage","Data Interpretation","Mensuration and Geometry","Quadratic Equation","Interest","Problems of Ages","Profit and Loss","Number Series","Speed, Distance and Time","Time and Work","Number System","Data Sufficiency","Linear Equation","Permutation and Combination","Probability"] },
      { subject: "General/Economy/Banking Awareness", topics: ["Current Affairs", "Static Awareness", "Financial Awareness","General Knowledge"] },
      { subject: "English Language", topics: ["Reading Comprehension", "Error Spotting", "Cloze Test", "Vocabulary", "Para Jumbles"] },
      { subject: "Computer Aptitude", topics: ["Internet","Memory","Keyboard Shortcuts","	Computer Abbreviation","Microsoft Office","Computer Hardware","Computer Software","Operating System","Networking","Computer Fundamentals /Terminologies"] },
      { subject: "Descriptive Test", topics: ["Essay Writing", "Letter Writing"] },
    ],
    interview: "Final selection is based on Mains + Interview.",
  },

  // -------------------- IBPS Clerk --------------------
  "IBPS Clerk": {
    examDetails: {
      "Organisation": "Institute of Banking Personnel Selection (IBPS)",
      "Post Name": "IBPS Clerk 2025",
      "Mode of Exam": "Online",
      "Exam Date 2025": "Prelims – 4th,5th October 2025 | Mains – 29th November 2025",
      "Negative Marking": "¼th mark (0.25 marks)",
      "Selection Process": "Prelims → Mains",
      "Official Website": "www.ibps.in",
    },
    prelimsPattern: [
      { subject: "English Language", questions: 30, marks: 30, duration: "20 minutes" },
      { subject: "Quantitative Aptitude", questions: 35, marks: 35, duration: "20 minutes" },
      { subject: "Reasoning Ability", questions: 35, marks: 35, duration: "20 minutes" },
    ],
    mainsPattern: [
      { subject: "General English", questions: 40, marks: 40, duration: "35 minutes" },
      { subject: "Quantitative Aptitude", questions: 35, marks: 50, duration: "30 minutes" },
      { subject: "Reasoning Ability & Computer Aptitude", questions: 40, marks: 60, duration: "35 minutes" },
      { subject: "General/Financial Awareness", questions: 40, marks: 50, duration: "20 minutes" },
    ],
    prelimsSyllabus: [
      { subject: "English Language", topics: ["Reading Comprehension", "Vocabulary","Word Formation","Spelling","Spotting Errors","Phrases and Idioms","Direct and Indirect Speech","Active/Passive Voices"] },
      { subject: "Quantitative Aptitude", topics: ["Ratio and proportion","Averages","Time and work","Speed","Distance and time","Mixture and allegation","Stocks and shares","Percentages","Partnership","Clocks","Volume and surface Area","Bar & Graphs","Line charts","Tables","Height and Distances","Logarithms","Permutation and combinations","Simple and compound interest","Equations, Probability","Trigonometry","Mensuration","Profit,Loss and Discount","Elements of Algebra","Data Interpretation","Pie charts"] },
      { subject: "Reasoning Ability", topics: ["Analogy","Classification","Word formation","Statement and conclusions Syllogism","Statement and arguments","Coding-Decoding","Blood Relations","Passage and conclusions","Alphabet test","Series Test","Number, Ranking and time sequence","Direction sense Test","Figure series","Input/output","Assertion and reasoning","Sitting Arrangement","Series test","Odd figure Out","Analogy","Miscellaneous Test"] },
    ],
    mainsSyllabus: [
      { subject: "Quantitative Aptitude", topics: ["Ratio and proportion","Averages","Time and work","Speed","Distance and time","Mixture and allegation","Stocks and shares","Percentages","Partnership","Clocks","Volume and surface Area","Bar & Graphs","Line charts","Tables","Height and Distances","Logarithms","Permutation and combinations","Simple and compound interest","Equations, Probability","Trigonometry","Mensuration","Profit,Loss and Discount","Elements of Algebra","Data Interpretation","Pie charts"] },
      { subject: "General English", topics: ["Reading Comprehension", "Vocabulary","Word Formation","Spelling","Spotting Errors","Phrases and Idioms","Direct and Indirect Speech","Active/Passive Voices"] },
      { subject: "Reasoning & Computer Aptitude", topics: ["Analogy","Classification","Word formation","Statement and conclusions Syllogism","Statement and arguments","Coding-Decoding","Blood Relations","Passage and conclusions","Alphabet test","Series Test","Number, Ranking and time sequence","Direction sense Test","Figure series","Input/output","Assertion and reasoning","Sitting Arrangement","Series test","Odd figure Out","Analogy","Miscellaneous Test","Basics of Hardware and software","Windows operating system basics","Internet terms and services","Basic Functionalities of MS-Office","History of computers","Networking and communication","Database basics","Basics of Hacking","Security Tools","Viruses"] },
      { subject: "General/Financial Awareness", topics: ["Current affairs related to national and international issues of last 6 months","Overview of Indian Financial System","History of the Indian banking system","Recent credit and monetary policies","Introduction to National financial institutions","Abbreviations and Economic terminologies","Banking Terms","Important Government Schemes on capital & money market"] },
    ],
    interview: "No interview for Clerk; selection based on Mains + Language Proficiency.",
  },

  // -------------------- RRB PO --------------------
  "IBPS RRB PO": {
    examDetails: {
      "Exam Name": "IBPS RRB Probationary Officer",
      "Bank Name": "Regional Rural Banks",
      "Mode of Exam": "Online",
      "Exam Date 2025": "Prelims – Aug 2025 | Mains – Sept 2025",
      "Negative Marking": "¼th mark (0.25 marks)",
      "Selection Process": "Prelims → Mains → Interview",
      "Official Website": "www.ibps.in",
    },
    prelimsPattern: [
      { subject: "Reasoning Ability", questions: 40, marks: 40, duration: "25 minutes" },
      { subject: "Quantitative Aptitude", questions: 40, marks: 40, duration: "20 minutes" },
    ],
    mainsPattern: [
      { subject: "Reasoning", questions: 40, marks: 50, duration: "30 minutes" },
      { subject: "Computer Knowledge", questions: 40, marks: 20, duration: "15 minutes" },
      { subject: "General Awareness", questions: 40, marks: 40, duration: "15 minutes" },
      { subject: "English/Hindi Language", questions: 40, marks: 40, duration: "30 minutes" },
      { subject: "Quantitative Aptitude", questions: 40, marks: 50, duration: "30 minutes" },
    ],
    prelimsSyllabus: [
      { subject: "Reasoning", topics: ["Puzzles","Seating Arrangemen","Number Series","Odd man out","Coding-Decoding","Blood Relation","Analogy","Syllogism","Alphabet Test","Ranking and Time","Causes and Effects","Direction Sense","Figure Series","Word Formation","Statement and Assumption","Assertion and Reason","Statement and Conclusion","Statement and Arguments","Statements and Action Courses"] },
      { subject: "Quantitative Aptitude", topics: ["Number System","Data Interpretation","Graph & Pie chart","HCF & LCM","Profit & Loss","Simple Interest & Compound Interest","Time & Work,Distance","Decimal & Fraction","Averages","Mensuration","Simplification","Partnership","Percentages","Ratio & Proportion","Averages","Permutation & Combination","Probability"] },
    ],
    mainsSyllabus: [
      { subject: "Reasoning", topics: ["Puzzles","Seating Arrangemen","Number Series","Odd man out","Coding-Decoding","Blood Relation","Analogy","Syllogism","Alphabet Test","Ranking and Time","Causes and Effects","Direction Sense","Figure Series","Word Formation","Statement and Assumption","Assertion and Reason","Statement and Conclusion","Statement and Arguments","Statements and Action Courses"] },
      { subject: "Computer Knowledge", topics: ["Fundamentals of Computer","History of Computers","Future of Computers","Basic Knowledge of Internet","Networking Software & Hardware","Computer Shortcut Keys","MS Office","Database","Security Tools","Virus","Hacking","Trojans Input and Output Devices","Computer Languages"] },
      { subject: "General Awareness", topics: ["National and International Current Affairs","Sports","Currencies & Capitals","General Science","Government Schemes & Policies","Banking Awareness","Awards and Honors","Books and Authors","National Parks & Sanctuaries","Abbreviations"] },
      { subject: "English/Hindi Language", topics: ["Reading Comprehension", "Grammar", "Vocabulary","Spotting Errors","Fill in the Blanks","Misspelled Words","Jumbled Words","Rearrangement of Sentence","Jumbled up sentences","Idioms and Phrases","Cloze Tests","One word Substitution"] },
      { subject: "Quantitative Aptitude", topics: ["Number System","Data Interpretation","Graph & Pie chart","HCF & LCM","Profit & Loss","Simple Interest & Compound Interest","Time & Work,Distance","Decimal & Fraction","Averages","Mensuration","Simplification","Partnership","Percentages","Ratio & Proportion","Averages","Permutation & Combination","Probability"] },
    ],
    interview: "Final selection based on Mains + Interview.",
  },

  // -------------------- RRB Clerk --------------------
  "IBPS RRB Clerk": {
    examDetails: {
      "Exam Name": "IBPS RRB Clerk (Office Assistant)",
      "Bank Name": "Regional Rural Banks",
      "Mode of Exam": "Online",
      "Exam Date 2025": "Prelims – Aug 2025 | Mains – Sept 2025",
      "Negative Marking": "¼th mark (0.25 marks)",
      "Selection Process": "Prelims → Mains",
      "Official Website": "www.ibps.in",
    },
    prelimsPattern: [
      { subject: "Reasoning Ability", questions: 40, marks: 40, duration: "25 minutes" },
      { subject: "Numerical Ability", questions: 40, marks: 40, duration: "20 minutes" },
    ],
    mainsPattern: [
      { subject: "Reasoning", questions: 40, marks: 50, duration: "30 minutes" },
      { subject: "Computer Knowledge", questions: 40, marks: 20, duration: "15 minutes" },
      { subject: "General Awareness", questions: 40, marks: 40, duration: "15 minutes" },
      { subject: "English/Hindi Language", questions: 40, marks: 40, duration: "30 minutes" },
      { subject: "Numerical Ability", questions: 40, marks: 50, duration: "30 minutes" },
    ],
    prelimsSyllabus: [
      { subject: "Reasoning", topics: ["Puzzles","Seating Arrangemen","Number Series","Odd man out","Coding-Decoding","Blood Relation","Analogy","Syllogism","Alphabet Test","Ranking and Time","Causes and Effects","Direction Sense","Figure Series","Word Formation","Statement and Assumption","Assertion and Reason","Statement and Conclusion","Statement and Arguments","Statements and Action Courses"] },
      { subject: "Quantitative Aptitude", topics: ["Number System","Data Interpretation","Graph & Pie chart","HCF & LCM","Profit & Loss","Simple Interest & Compound Interest","Time & Work,Distance","Decimal & Fraction","Averages","Mensuration","Simplification","Partnership","Percentages","Ratio & Proportion","Averages","Permutation & Combination","Probability"] },
    ],
    mainsSyllabus: [
      { subject: "Reasoning", topics: ["Puzzles","Seating Arrangemen","Number Series","Odd man out","Coding-Decoding","Blood Relation","Analogy","Syllogism","Alphabet Test","Ranking and Time","Causes and Effects","Direction Sense","Figure Series","Word Formation","Statement and Assumption","Assertion and Reason","Statement and Conclusion","Statement and Arguments","Statements and Action Courses"] },
      { subject: "Computer Knowledge", topics: ["Fundamentals of Computer","History of Computers","Future of Computers","Basic Knowledge of Internet","Networking Software & Hardware","Computer Shortcut Keys","MS Office","Database","Security Tools","Virus","Hacking","Trojans Input and Output Devices","Computer Languages"] },
      { subject: "General Awareness", topics: ["National and International Current Affairs","Sports","Currencies & Capitals","General Science","Government Schemes & Policies","Banking Awareness","Awards and Honors","Books and Authors","National Parks & Sanctuaries","Abbreviations"] },
      { subject: "English/Hindi Language", topics: ["Reading Comprehension", "Grammar", "Vocabulary","Spotting Errors","Fill in the Blanks","Misspelled Words","Jumbled Words","Rearrangement of Sentence","Jumbled up sentences","Idioms and Phrases","Cloze Tests","One word Substitution"] },
      { subject: "Quantitative Aptitude", topics: ["Number System","Data Interpretation","Graph & Pie chart","HCF & LCM","Profit & Loss","Simple Interest & Compound Interest","Time & Work,Distance","Decimal & Fraction","Averages","Mensuration","Simplification","Partnership","Percentages","Ratio & Proportion","Averages","Permutation & Combination","Probability"] },
    ],
    interview: "No interview for Clerk. Final selection is based on Mains only.",
  },
};


export default function Syllabus() {
  const [selectedExam, setSelectedExam] = useState(null);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow rounded p-6">
        <BackButton fallback="/dashboard" label="Back to Dashboard" />
        <h1 className="text-3xl font-bold text-black mb-6">Exam Syllabus & Details</h1>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.keys(syllabusData).map((exam) => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`px-4 py-2 rounded font-semibold transition ${
                selectedExam === exam ? "bg-orange-500 text-white" : "bg-gray-100 text-black"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedExam && (
            <motion.div
              key={selectedExam}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-black mb-4">{selectedExam}</h2>

              {/* Exam Details */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-black mb-2">Exam Details</h3>
                <table className="w-full border text-sm">
                  <tbody>
                    {Object.entries(syllabusData[selectedExam].examDetails).map(([k, v]) => (
                      <tr key={k} className="border-b">
                        <td className="p-2 font-semibold text-black w-1/3">{k}</td>
                        <td className="p-2 text-gray-700">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Prelims Pattern */}
              {syllabusData[selectedExam].prelimsPattern && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-black mb-2">Prelims Exam Pattern</h3>
                  <table className="w-full border text-sm">
                    <thead>
                      <tr className="bg-orange-100">
                        <th className="p-2 border">Subjects</th>
                        <th className="p-2 border">No. of Questions</th>
                        <th className="p-2 border">Marks</th>
                        <th className="p-2 border">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syllabusData[selectedExam].prelimsPattern.map((row, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2">{row.subject}</td>
                          <td className="p-2 text-center">{row.questions}</td>
                          <td className="p-2 text-center">{row.marks}</td>
                          <td className="p-2 text-center">{row.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Prelims Syllabus */}
              {syllabusData[selectedExam].prelimsSyllabus && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-black mb-2">Prelims Syllabus</h3>
                  <table className="w-full border text-sm">
                    <thead>
                      <tr className="bg-orange-100">
                        <th className="p-2 border w-1/4">Subject</th>
                        <th className="p-2 border">Topics</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syllabusData[selectedExam].prelimsSyllabus.map((row, i) => (
                        <tr key={i} className="border-b align-top">
                          <td className="p-2 font-semibold">{row.subject}</td>
                          <td className="p-2 align-top text-left">
                            <ul className="pl-4 text-gray-700 space-y-1">
                              {row.topics.map((t, j) => (
                                <li key={j}>• {t}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mains Pattern */}
              {syllabusData[selectedExam].mainsPattern && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-black mb-2">Mains Exam Pattern</h3>
                  <table className="w-full border text-sm">
                    <thead>
                      <tr className="bg-orange-100">
                        <th className="p-2 border">Subjects</th>
                        <th className="p-2 border">No. of Questions</th>
                        <th className="p-2 border">Marks</th>
                        <th className="p-2 border">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syllabusData[selectedExam].mainsPattern.map((row, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2">{row.subject}</td>
                          <td className="p-2 text-center">{row.questions}</td>
                          <td className="p-2 text-center">{row.marks}</td>
                          <td className="p-2 text-center">{row.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mains Syllabus */}
              {syllabusData[selectedExam].mainsSyllabus && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-black mb-2">Mains Syllabus</h3>
                  <table className="w-full border text-sm">
                    <thead>
                      <tr className="bg-orange-100">
                        <th className="p-2 border w-1/4">Subject</th>
                        <th className="p-2 border">Topics</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syllabusData[selectedExam].mainsSyllabus.map((row, i) => (
                        <tr key={i} className="border-b align-top">
                          <td className="p-2 font-semibold">{row.subject}</td>
                          <td className="p-2 align-top text-left">
                            <ul className="pl-4 text-gray-700 space-y-1">
                              {row.topics.map((t, j) => (
                                <li key={j}>• {t}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Interview */}
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Interview / Final Stage</h3>
                <p className="text-gray-700">{syllabusData[selectedExam].interview}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
