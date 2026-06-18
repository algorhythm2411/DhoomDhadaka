import React, { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';

function PuzzlePlayer({ onBack }) {
  // Mocking the Google Drive JSON data we configured earlier
  const setMockData = {
    title: "The Medieval Grain Cartel",
    difficulty: "Hard",
    timeLimitMinutes: 15,
    narrative: "Four medieval kingdoms (Aryavarta, Magadha, Avantika, and Kalinga) are trading three types of essential crops: Rice, Wheat, and Barley. The total crop trade across all kingdoms combined is exactly 1600 tons. Due to border disputes, some data points were lost in the imperial records, leaving an incomplete matrix. Scholars have found a few logical clues to reconstruct the dataset.",
    clues: [
      "The total amount of Barley traded across all kingdoms is 600 tons.",
      "Magadha traded an equal amount of Rice and Barley.",
      "Avantika's Wheat trade was exactly half of Aryavarta's Rice trade.",
      "Kalinga traded a total of 450 tons of crops, which includes 300 tons of Rice and 50 tons of Wheat.",
      "Aryavarta's total trade was the highest among all kingdoms, while Avantika's total trade was the lowest."
    ],
    tableData: {
      headers: ["Kingdom", "Rice (Tons)", "Wheat (Tons)", "Barley (Tons)"],
      rows: [
        ["Aryavarta", "200", "150", "X"],
        ["Magadha", "Y", "100", "Y"],
        ["Avantika", "120", "Z", "180"],
        ["Kalinga", "300", "50", "100"]
      ]
    },
    questions: [
      {
        id: "q1",
        questionText: "What is the total amount of crops (in tons) traded by Aryavarta?",
        type: "MCQ",
        options: { A: "450 tons", B: "500 tons", C: "550 tons", D: "600 tons" }
      },
      {
        id: "q2",
        questionText: "What is the value of Z (Avantika's Wheat trade)?",
        type: "MCQ",
        options: { A: "100 tons", B: "50 tons", C: "75 tons", D: "None of the above" }
      },
      {
        id: "q3",
        questionText: "Which kingdom traded the maximum amount of Barley?",
        type: "MCQ",
        options: { A: "Aryavarta", B: "Magadha", C: "Avantika", D: "Kalinga" }
      },
      {
        id: "q4",
        questionText: "What was the total amount of Wheat traded across all four kingdoms?",
        type: "TITA",
        placeholder: "Type your numeric answer here"
      }
    ]
  };

  // State Management
  const [timeLeft, setTimeLeft] = useState(setMockData.timeLimitMinutes * 60);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Automatically submit when time runs out
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionChange = (questionId, optionKey) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionKey
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    console.log("Answers Submitted to Engine:", userAnswers);
    // Real application me yahan backend endpoint '/api/game/submit' par axios push jayega
  };

  return (
    <div className="min-h-screen bg-gameDark text-slate-100 flex flex-col h-screen overflow-hidden">
      {/* Player Header */}
      <header className="bg-gameCard border-b border-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
        <button 
          onClick={onBack} 
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition font-medium"
        >
          <FaArrowLeft />
          <span>Leave Arena</span>
        </button>
        <h1 className="text-xl font-bold text-gameAccent tracking-wide">{setMockData.title}</h1>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-mono text-lg font-bold border ${
          timeLeft < 120 ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-gameAccent/10 text-gameAccent border-gameAccent/20'
        }`}>
          <FaClock />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Split Window */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT PANEL: Caselet & Data Insights (Scrollable) */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-800 space-y-6">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gameNeon mb-2 flex items-center space-x-1">
              <FaInfoCircle /> <span>The Situation Blueprint</span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm justify-between">{setMockData.narrative}</p>
          </div>

          {/* Clues */}
          <div>
            <h4 className="text-md font-bold mb-3 text-slate-200">Decryption Clues</h4>
            <ul className="space-y-2.5">
              {setMockData.clues.map((clue, index) => (
                <li key={index} className="flex items-start space-x-3 text-sm text-slate-400 bg-gameCard/40 p-3 rounded-xl border border-slate-800/50">
                  <span className="text-gameAccent font-bold">➢</span>
                  <span>{clue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Data Table */}
          <div>
            <h4 className="text-md font-bold mb-3 text-slate-200">Reconstructed Matrix Table</h4>
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-gameCard/30">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-semibold">
                    {setMockData.tableData.headers.map((header, idx) => (
                      <th key={idx} className="p-3">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {setMockData.tableData.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-slate-800/20 text-slate-400 transition">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className={`p-3 ${cellIdx === 0 ? 'font-bold text-slate-300' : ''}`}>
                          {cell === 'X' || cell === 'Y' || cell === 'Z' ? (
                            <span className="text-amber-500 font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">{cell}</span>
                          ) : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Dynamic Submission Terminal (Scrollable) */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-slate-900/30 flex flex-col justify-between">
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Questions Core</h3>
            
            {setMockData.questions.map((q, idx) => (
              <div key={q.id} className="bg-gameCard border border-slate-800 rounded-2xl p-5 shadow-md">
                <span className="text-xs font-bold text-gameAccent bg-gameAccent/10 px-2.5 py-1 rounded-md">QUESTION 0{idx + 1}</span>
                <p className="text-slate-200 font-medium mt-3 mb-4 text-sm">{q.questionText}</p>

                {/* Conditional Rendering base on Question Type (MCQ vs TITA) */}
                {q.type === "MCQ" ? (
                  <div className="grid grid-cols-1 gap-2.5">
                    {Object.entries(q.options).map(([key, val]) => (
                      <button
                        key={key}
                        disabled={isSubmitted}
                        onClick={() => handleOptionChange(q.id, key)}
                        className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition flex items-center justify-between ${
                          userAnswers[q.id] === key
                            ? 'bg-gameAccent/20 border-gameAccent text-white shadow-md'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span><strong className="mr-2 text-gameAccent">{key}.</strong> {val}</span>
                        {userAnswers[q.id] === key && <div className="w-2 h-2 rounded-full bg-gameAccent" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  // TITA Input Block
                  <input
                    type="text"
                    disabled={isSubmitted}
                    placeholder={q.placeholder}
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => handleOptionChange(q.id, e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gameAccent transition font-mono"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Submission Panel */}
          <div className="mt-8 border-t border-slate-800 pt-5 shrink-0">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                className="w-full bg-gameNeon hover:bg-emerald-600 text-gameDark font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-gameNeon/10 transform active:scale-[0.99] transition"
              >
                <FaCheckCircle />
                <span>SUBMIT TARGET MISSION</span>
              </button>
            ) : (
              <div className="bg-gameNeon/10 border border-gameNeon/20 rounded-xl p-4 text-center">
                <p className="text-gameNeon font-bold text-sm">Answers locked! Synchronization with server complete. Check dashboard updates.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default PuzzlePlayer;
