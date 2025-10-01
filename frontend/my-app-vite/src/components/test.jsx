import React, {
  useEffect,
  useState,
  Fragment,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getTests, submitTest, getResult } from "../actions/productActions";
import { pauseTest,resumeTest } from "../actions/productActions";
import MetaData from "./layouts/MetaData";

const Test = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { exam, mockTest, id } = useParams();

  const { tests, error } = useSelector((state) => state.tests);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentTest, setCurrentTest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTestPaused, setIsTestPaused] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const autoSubmitTimeoutRef = useRef(null);

  const pauseModalRef = useRef(null);
  const pauseModalInstanceRef = useRef(null);

  const selectedExam = location.state?.selectedExam || exam;
  const selectedMockTest = location.state?.selectedMockTest || mockTest;
  const isResume = location.state?.isResume;

  // For progress bar
  const [progress, setProgress] = useState(100);

  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (!currentTest || !currentTest.questions) return;
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
      }

      const formattedAnswers = currentTest.questions.map((question, index) => {
        const selectedOption = answers[index] || "";
        return {
          question: question.questionText,
          selectedOption: selectedOption || "Not Attempted",
          isCorrect: selectedOption === question.answer
        };
      });

      const payload = {
        testId: currentTest._id,
        answers: formattedAnswers,
        timeTaken: currentTest.timeDuration * 60 - timeLeft
      };

      if (isAutoSubmit) {
        alert("⏰ Time's up! Your test is being submitted automatically.");
      }

      await dispatch(submitTest(payload));
      localStorage.removeItem("pausedTest");

      if (document.fullscreenElement) {
        await document.exitFullscreen?.() ||
              document.webkitExitFullscreen?.() ||
              document.mozCancelFullScreen?.() ||
              document.msExitFullscreen?.();
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        await dispatch(getResult(currentTest._id));
        navigate(`/${selectedExam}/${selectedMockTest}/test/result/${currentTest._id}`);
      } catch (resultError) {
        navigate(`/${selectedExam}/${selectedMockTest}/test/result/${currentTest._id}`);
      }

    } catch (error) {
      alert("Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentTest, answers, timeLeft, dispatch, navigate, selectedExam, selectedMockTest, isSubmitting]);

useEffect(() => {
  const test = tests.find((t) => t._id === id);
  if (test) {
    setCurrentTest(test);

    if (isResume) {
      // hit backend resume
      dispatch(resumeTest(test._id)).then((res) => {
        if (res.success) {
          const attempt = res.attempt;
          setTimeLeft(attempt.timeLeft || test.timeDuration * 60);
          setAnswers(
            attempt.answers?.reduce((acc, ans, idx) => {
              acc[idx] = ans.selectedOption === "Not Attempted" ? "" : ans.selectedOption;
              return acc;
            }, {}) || {}
          );
          setCurrentQuestionIndex(attempt.currentQuestionIndex || 0);
        }
      });
    } else {
      setTimeLeft(test.timeDuration * 60);
    }

    if (window.innerWidth > 768 && isFullscreenAvailable()) {
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        elem.requestFullscreen?.().catch(() => {});
      }
    }
  }
}, [tests, id, isResume, dispatch]);

  useEffect(() => {
    if (exam) {
      dispatch(getTests(exam));
    }
  }, [dispatch, exam]);

  useEffect(() => {
    const test = tests.find((t) => t._id === id);
    if (test) {
      setCurrentTest(test);
      const paused = JSON.parse(localStorage.getItem("pausedTest"));
      if (isResume && paused?.timeLeft) {
        setTimeLeft(paused.timeLeft);
        setAnswers(paused.answers || {});
        setCurrentQuestionIndex(paused.currentQuestionIndex || 0);
      } else {
        setTimeLeft(test.timeDuration * 60);
      }

      if (window.innerWidth > 768 && isFullscreenAvailable()) {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
          elem.requestFullscreen?.().catch(() => {});
        }
      }
    }
  }, [tests, id, isResume]);

  useEffect(() => {
    setProgress(
      currentTest
        ? Math.max(
            0,
            (timeLeft / (currentTest.timeDuration * 60)) * 100
          )
        : 100
    );
  }, [timeLeft, currentTest]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pauseModalRef.current && window.bootstrap?.Modal) {
        pauseModalInstanceRef.current = new window.bootstrap.Modal(
          pauseModalRef.current,
          {
            backdrop: "static",
            keyboard: false,
          }
        );
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  const handleFullscreenChange = () => {
    // Only trigger pause dialog if not already paused and not already showing the dialog
    if (!document.fullscreenElement && !isTestPaused && !showConfirmDialog) {
      handlePauseTest();
    }
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  return () => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  };
}, [isTestPaused, showConfirmDialog]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    if (timeLeft === 300 && !showTimeWarning) {
      setShowTimeWarning(true);
      alert("⚠️ 5 minutes remaining!");
    }
    else if (timeLeft === 60 && !showTimeWarning) {
      setShowTimeWarning(true);
      alert("⚠️ 1 minute remaining!");
    }
    else if (timeLeft !== 300 && timeLeft !== 60) {
      setShowTimeWarning(false);
    }

    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    if (timeLeft === 5) {
      autoSubmitTimeoutRef.current = setTimeout(() => {
        handleSubmit(true);
      }, 5000);
    }

    return () => {
      clearInterval(timer);
      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
      }
    };
  }, [timeLeft, isPaused, handleSubmit, showTimeWarning]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleOptionChange = (e) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: e.target.value,
    }));

    if (skippedQuestions.has(currentQuestionIndex)) {
      const newSkipped = new Set(skippedQuestions);
      newSkipped.delete(currentQuestionIndex);
      setSkippedQuestions(newSkipped);
    }
  };

  const handleNext = () => {
    const newVisited = new Set(visitedQuestions);
    newVisited.add(currentQuestionIndex);
    setVisitedQuestions(newVisited);

    if (!answers[currentQuestionIndex]) {
      const newSkipped = new Set(skippedQuestions);
      newSkipped.add(currentQuestionIndex);
      setSkippedQuestions(newSkipped);
    } else {
      const newSkipped = new Set(skippedQuestions);
      newSkipped.delete(currentQuestionIndex);
      setSkippedQuestions(newSkipped);
    }

    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkipQuestion = () => {
    const newSkipped = new Set(skippedQuestions);
    newSkipped.add(currentQuestionIndex);
    setSkippedQuestions(newSkipped);
    handleNext();
  };

  const isFullscreenAvailable = () => {
    return (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  };

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!isFullscreenAvailable()) {
      alert("Fullscreen is not supported on this device.");
      return;
    }

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.() ||
        elem.webkitRequestFullscreen?.() ||
        elem.mozRequestFullScreen?.() ||
        elem.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.mozCancelFullScreen?.() ||
        document.msExitFullscreen?.();
    }
  };

  const handlePauseTest = () => {
    setShowConfirmDialog(true);
  };

 const confirmPause = async () => {
  setShowConfirmDialog(false);
  setIsTestPaused(true);
  setIsPaused(true);   // <-- stop countdown

  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  await dispatch(
    pauseTest({
      testId: currentTest._id,
      timeLeft,
      answers,
      currentQuestionIndex,
      exam,
      mockTest: selectedMockTest,
    })
  );
};

const handleResumeTest = () => {
  setIsTestPaused(false);
  setIsPaused(false);  
  if (isFullscreenAvailable()) {
    toggleFullScreen();
  }
};
  const getQuestionStatusClass = (idx) => {
    if (currentQuestionIndex === idx) return "active";
    if (answers[idx]) return "answered";
    if (skippedQuestions.has(idx)) return "skipped";
    if (visitedQuestions.has(idx)) return "visited";
    return "";
  };

  if (error) {
    return <p style={{ color: "red" }}>❌ Failed to load test: {error}</p>;
  }

  if (!currentTest || !currentTest.questions?.length) {
    return <p>Loading test...</p>;
  }

  // Progress bar color
  const progressColor =
    progress > 50
      ? "#4caf50"
      : progress > 20
      ? "#ffc107"
      : "#f44336";

  return (
//     <Fragment>
//       <MetaData title={"Test"} />
//       {isTestPaused ? (
//         <div className="paused-test-overlay" style={{ animation: "fadeIn 0.5s" }}>
//           <div className="pause-content" tabIndex={0} aria-modal="true" role="dialog">
//             <h2 style={{ color: "#1976d2" }}>
//               <i className="fas fa-pause-circle"></i>
//               Test Paused
//             </h2>
//             <p>
//               <span role="img" aria-label="info">💾</span> Your test progress has been saved.<br />
//               <span role="img" aria-label="clock">⏳</span> Resume to continue from where you left off.
//             </p>
//             <button
//               className="btn btn-primary btn-lg"
//               onClick={handleResumeTest}
//               autoFocus
//             >
//               <i className="fas fa-play"></i>
//               Resume Test
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="test-container-fullscreen">
//           {currentTest && currentTest.questions && (
//             <div className="test-layout">
//               {/* Main question area */}
//               <div className="question-area">
//                 <div className="test-content">
//                   {/* Header with timer and pause button */}
//                   <div className="test-header" style={{ position: "sticky", top: 0, zIndex: 10 }}>
//                     <div className="header-content">
//                       <h5 className="question-number">
//                         <span style={{ color: "#1976d2" }}>
//                           <i className="fas fa-question-circle"></i>
//                         </span>{" "}
//                         Question {currentQuestionIndex + 1} of {currentTest.questions.length}
//                       </h5>
//                       <div className="header-controls" style={{ alignItems: "center" }}>
//                         <div className="timer" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                           <span style={{ fontWeight: 600, color: progressColor }}>
//                             <i className="fas fa-clock"></i> {formatTime(timeLeft)}
//                           </span>
//                           <div
//                             style={{
//                               width: 120,
//                               height: 8,
//                               background: "#e0e0e0",
//                               borderRadius: 4,
//                               marginTop: 4,
//                               overflow: "hidden",
//                             }}
//                           >
//                             <div
//                               style={{
//                                 width: `${progress}%`,
//                                 height: "100%",
//                                 background: progressColor,
//                                 transition: "width 0.5s",
//                               }}
//                             />
//                           </div>
//                         </div>
//                         <button
//                           className="btn btn-outline-warning"
//                           onClick={handlePauseTest}
//                           style={{ marginLeft: 16 }}
//                           title="Pause Test"
//                         >
//                           <i className="fas fa-pause"></i> Pause
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Question content */}
//                   <div className="question-container" style={{ animation: "fadeIn 0.3s" }}>
//                     <div className="question-content">
//                       <div className="question-text" style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>
//                         {currentTest.questions[currentQuestionIndex].questionText.split('\n').map((line, index) => (
//                           <p key={index} className={index === 0 ? 'main-question' : 'sub-question'}>
//                             {line}
//                           </p>
//                         ))}
//                       </div>

//                       <div className="options-grid">
//                         {currentTest.questions[currentQuestionIndex].options.map((option, idx) => (
//                           <div
//                             key={idx}
//                             className={`option-item${answers[currentQuestionIndex] === option ? " selected" : ""}`}
//                             style={{
//                               border: answers[currentQuestionIndex] === option ? "2px solid #1976d2" : undefined,
//                               background: answers[currentQuestionIndex] === option ? "#e3f2fd" : undefined,
//                               transition: "all 0.2s",
//                             }}
//                             tabIndex={0}
//                             aria-checked={answers[currentQuestionIndex] === option}
//                             role="radio"
//                           >
//                             <input
//                               type="radio"
//                               name={`question${currentQuestionIndex}`}
//                               id={`option${idx}`}
//                               value={option}
//                               checked={answers[currentQuestionIndex] === option}
//                               onChange={handleOptionChange}
//                               style={{ accentColor: "#1976d2" }}
//                             />
//                             <label htmlFor={`option${idx}`} style={{ cursor: "pointer", width: "100%" }}>
//                               {option}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Navigation buttons */}
//                   <div className="navigation-buttons">
//                     <div className="nav-group">
//                       <button
//                         className="btn btn-secondary"
//                         onClick={handlePrevious}
//                         disabled={currentQuestionIndex === 0}
//                         title="Previous Question"
//                       >
//                         <i className="fas fa-arrow-left me-2"></i>
//                         Previous
//                       </button>
//                       <button
//                         className="btn btn-outline-info"
//                         onClick={handleSkipQuestion}
//                         disabled={currentQuestionIndex === currentTest.questions.length - 1}
//                         title="Skip Question"
//                       >
//                         <i className="fas fa-forward"></i> Skip
//                       </button>
//                     </div>
//                     {currentQuestionIndex === currentTest.questions.length - 1 ? (
//                       <button
//                         className="btn btn-success"
//                         onClick={handleSubmit}
//                         disabled={isSubmitting}
//                         title="Submit Test"
//                       >
//                         <i className="fas fa-check-circle me-2"></i>
//                         {isSubmitting ? "Submitting..." : "Submit Test"}
//                       </button>
//                     ) : (
//                       <button
//                         className="btn btn-primary"
//                         onClick={handleNext}
//                         title="Next Question"
//                       >
//                         Next
//                         <i className="fas fa-arrow-right ms-2"></i>
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Question palette */}
//               <div className="question-palette-area">
//                 <div className="palette-content">
//                   <h5 className="palette-title">
//                     <i className="fas fa-th"></i> Question Palette
//                   </h5>
//                   <div className="palette-legend">
//                     <div className="legend-item" title="Answered">
//                       <span className="legend-color answered"></span>
//                       <span>Answered</span>
//                     </div>
//                     <div className="legend-item" title="Not Answered">
//                       <span className="legend-color skipped"></span>
//                       <span>Not Answered</span>
//                     </div>
//                     <div className="legend-item" title="Visited">
//                       <span className="legend-color visited"></span>
//                       <span>Visited</span>
//                     </div>
//                     <div className="legend-item" title="Not Visited">
//                       <span className="legend-color"></span>
//                       <span>Not Visited</span>
//                     </div>
//                   </div>
//                   <div className="question-grid" style={{ marginTop: 12 }}>
//                     {currentTest.questions.map((_, idx) => (
//                       <button
//                         key={idx}
//                         className={`palette-btn ${getQuestionStatusClass(idx)}`}
//                         onClick={() => setCurrentQuestionIndex(idx)}
//                         aria-label={`Go to question ${idx + 1}`}
//                         title={`Go to question ${idx + 1}`}
//                         style={{
//                           border:
//                             currentQuestionIndex === idx
//                               ? "2px solid #1976d2"
//                               : undefined,
//                           background:
//                             answers[idx]
//                               ? "#4caf50"
//                               : skippedQuestions.has(idx)
//                               ? "#f44336"
//                               : visitedQuestions.has(idx)
//                               ? "#90caf9"
//                               : "#e0e0e0",
//                           color:
//                             currentQuestionIndex === idx
//                               ? "#1976d2"
//                               : answers[idx]
//                               ? "#fff"
//                               : skippedQuestions.has(idx)
//                               ? "#fff"
//                               : visitedQuestions.has(idx)
//                               ? "#fff"
//                               : "#424242",
//                           fontWeight: currentQuestionIndex === idx ? 700 : 500,
//                           transition: "all 0.2s",
//                         }}
//                       >
//                         {idx + 1}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//       {showConfirmDialog && (
//   <div className="custom-modal-overlay">
//     <div className="custom-modal-glass">
//       <div className="custom-modal-icon">
//         <i className="fas fa-pause-circle"></i>
//       </div>
//       <h2>Pause Test</h2>
//       <p>
//         <span role="img" aria-label="save">💾</span> All your answers and time will be saved.<br />
//         <span role="img" aria-label="resume">▶️</span> You can resume anytime.<br />
//         <span role="img" aria-label="fullscreen">🖥️</span> Fullscreen will be toggled automatically.
//       </p>
//       <div className="custom-modal-actions">
//         <button
//           className="custom-btn custom-btn-continue"
//           onClick={() => setShowConfirmDialog(false)}
//         >
//           <i className="fas fa-arrow-left"></i> Continue Test
//         </button>
//         <button
//           className="custom-btn custom-btn-pause"
//           onClick={confirmPause}
//         >
//           <i className="fas fa-pause"></i> Pause Now
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </Fragment>
 <Fragment>
      <MetaData title={"Test"} />
      {isTestPaused ? (
        // ✅ same paused overlay
        <div className="paused-test-overlay">
          <div className="pause-content">
            <h2><i className="fas fa-pause-circle"></i> Test Paused</h2>
            <p>💾 Progress saved. ⏳ Resume anytime.</p>
            <button className="btn btn-primary btn-lg" onClick={handleResumeTest}>
              <i className="fas fa-play"></i> Resume Test
            </button>
          </div>
        </div>
      ) : (
        <div className="test-container-fullscreen">
          {currentTest && (
            <div className="test-layout">
              {/* Main question area */}
              <div className="question-area">
                {/* Sticky header for mobile */}
                <div className="test-header">
                  <h5>
                    Question {currentQuestionIndex + 1} / {currentTest.questions.length}
                  </h5>
                  <div className="mobile-timer">
                    ⏰ {formatTime(timeLeft)}
                    <button className="btn btn-sm btn-warning" onClick={handlePauseTest}>
                      <i className="fas fa-pause"></i>
                    </button>
                  </div>
                </div>

                {/* Question */}
                <div className="question-content">
                  <p className="question-text">
                    {currentTest.questions[currentQuestionIndex].questionText}
                  </p>
                  <div className="options-grid">
                    {currentTest.questions[currentQuestionIndex].options.map((option, idx) => (
                      <label
                        key={idx}
                        className={`option-item ${answers[currentQuestionIndex] === option ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`q${currentQuestionIndex}`}
                          value={option}
                          checked={answers[currentQuestionIndex] === option}
                          onChange={handleOptionChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sticky footer navigation on mobile */}
                <div className="mobile-footer-nav">
                  <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    ◀ Prev
                  </button>
                  {currentQuestionIndex === currentTest.questions.length - 1 ? (
                    <button className="btn-success" onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  ) : (
                    <button className="btn-primary" onClick={handleNext}>
                      Next ▶
                    </button>
                  )}
                </div>
              </div>

              {/* Palette - Desktop: right column, Mobile: collapsible drawer */}
              <div className="question-palette-area">
                <h5>Question Palette</h5>
                <div className="question-grid">
                  {currentTest.questions.map((_, idx) => (
                    <button
                      key={idx}
                      className={`palette-btn ${getQuestionStatusClass(idx)}`}
                      onClick={() => setCurrentQuestionIndex(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default Test;
