// import React, {
//   useEffect,
//   useState,
//   Fragment,
//   useCallback,
//   useRef,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { getTests, submitTest, getResult } from "../actions/productActions";
// import { pauseTest,resumeTest } from "../actions/productActions";
// import MetaData from "./layouts/MetaData";

// const Test = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { exam, mockTest, id } = useParams();

//   const { tests, error } = useSelector((state) => state.tests);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [currentTest, setCurrentTest] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isTestPaused, setIsTestPaused] = useState(false);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [skippedQuestions, setSkippedQuestions] = useState(new Set());
//   const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showTimeWarning, setShowTimeWarning] = useState(false);
//   const autoSubmitTimeoutRef = useRef(null);

//   const pauseModalRef = useRef(null);
//   const pauseModalInstanceRef = useRef(null);

//   const selectedExam = location.state?.selectedExam || exam;
//   const selectedMockTest = location.state?.selectedMockTest || mockTest;
//   const isResume = location.state?.isResume;

//   // For progress bar
//   const [progress, setProgress] = useState(100);

//   const handleSubmit = useCallback(async (isAutoSubmit = false) => {
//     if (!currentTest || !currentTest.questions) return;
//     if (isSubmitting) return;

//     try {
//       setIsSubmitting(true);

//       if (autoSubmitTimeoutRef.current) {
//         clearTimeout(autoSubmitTimeoutRef.current);
//       }

//       const formattedAnswers = currentTest.questions.map((question, index) => {
//         const selectedOption = answers[index] || "";
//         return {
//           question: question.questionText,
//           selectedOption: selectedOption || "Not Attempted",
//           isCorrect: selectedOption === question.answer
//         };
//       });

//       const payload = {
//         testId: currentTest._id,
//         answers: formattedAnswers,
//         timeTaken: currentTest.timeDuration * 60 - timeLeft
//       };

//       if (isAutoSubmit) {
//         alert("⏰ Time's up! Your test is being submitted automatically.");
//       }

//       await dispatch(submitTest(payload));
//       localStorage.removeItem("pausedTest");

//       if (document.fullscreenElement) {
//         await document.exitFullscreen?.() ||
//               document.webkitExitFullscreen?.() ||
//               document.mozCancelFullScreen?.() ||
//               document.msExitFullscreen?.();
//       }

//       await new Promise(resolve => setTimeout(resolve, 1000));

//       try {
//         await dispatch(getResult(currentTest._id));
//         navigate(`/${selectedExam}/${selectedMockTest}/test/result/${currentTest._id}`);
//       } catch (resultError) {
//         navigate(`/${selectedExam}/${selectedMockTest}/test/result/${currentTest._id}`);
//       }

//     } catch (error) {
//       alert("Failed to submit test. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [currentTest, answers, timeLeft, dispatch, navigate, selectedExam, selectedMockTest, isSubmitting]);

// useEffect(() => {
//   const test = tests.find((t) => t._id === id);
//   if (test) {
//     setCurrentTest(test);

//     if (isResume) {
//       // hit backend resume
//       dispatch(resumeTest(test._id)).then((res) => {
//         if (res.success) {
//           const attempt = res.attempt;
//           setTimeLeft(attempt.timeLeft || test.timeDuration * 60);
//           setAnswers(
//             attempt.answers?.reduce((acc, ans, idx) => {
//               acc[idx] = ans.selectedOption === "Not Attempted" ? "" : ans.selectedOption;
//               return acc;
//             }, {}) || {}
//           );
//           setCurrentQuestionIndex(attempt.currentQuestionIndex || 0);
//         }
//       });
//     } else {
//       setTimeLeft(test.timeDuration * 60);
//     }

//     if (window.innerWidth > 768 && isFullscreenAvailable()) {
//       const elem = document.documentElement;
//       if (!document.fullscreenElement) {
//         elem.requestFullscreen?.().catch(() => {});
//       }
//     }
//   }
// }, [tests, id, isResume, dispatch]);

//   useEffect(() => {
//     if (exam) {
//       dispatch(getTests(exam));
//     }
//   }, [dispatch, exam]);

//   useEffect(() => {
//     const test = tests.find((t) => t._id === id);
//     if (test) {
//       setCurrentTest(test);
//       const paused = JSON.parse(localStorage.getItem("pausedTest"));
//       if (isResume && paused?.timeLeft) {
//         setTimeLeft(paused.timeLeft);
//         setAnswers(paused.answers || {});
//         setCurrentQuestionIndex(paused.currentQuestionIndex || 0);
//       } else {
//         setTimeLeft(test.timeDuration * 60);
//       }

//       if (window.innerWidth > 768 && isFullscreenAvailable()) {
//         const elem = document.documentElement;
//         if (!document.fullscreenElement) {
//           elem.requestFullscreen?.().catch(() => {});
//         }
//       }
//     }
//   }, [tests, id, isResume]);

//   useEffect(() => {
//     setProgress(
//       currentTest
//         ? Math.max(
//             0,
//             (timeLeft / (currentTest.timeDuration * 60)) * 100
//           )
//         : 100
//     );
//   }, [timeLeft, currentTest]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (pauseModalRef.current && window.bootstrap?.Modal) {
//         pauseModalInstanceRef.current = new window.bootstrap.Modal(
//           pauseModalRef.current,
//           {
//             backdrop: "static",
//             keyboard: false,
//           }
//         );
//       }
//     }, 200);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//   const handleFullscreenChange = () => {
//     // Only trigger pause dialog if not already paused and not already showing the dialog
//     if (!document.fullscreenElement && !isTestPaused && !showConfirmDialog) {
//       handlePauseTest();
//     }
//   };

//   document.addEventListener("fullscreenchange", handleFullscreenChange);
//   return () => {
//     document.removeEventListener("fullscreenchange", handleFullscreenChange);
//   };
// }, [isTestPaused, showConfirmDialog]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleSubmit(true);
//       return;
//     }

//     if (timeLeft === 300 && !showTimeWarning) {
//       setShowTimeWarning(true);
//       alert("⚠️ 5 minutes remaining!");
//     }
//     else if (timeLeft === 60 && !showTimeWarning) {
//       setShowTimeWarning(true);
//       alert("⚠️ 1 minute remaining!");
//     }
//     else if (timeLeft !== 300 && timeLeft !== 60) {
//       setShowTimeWarning(false);
//     }

//     if (isPaused) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     if (timeLeft === 5) {
//       autoSubmitTimeoutRef.current = setTimeout(() => {
//         handleSubmit(true);
//       }, 5000);
//     }

//     return () => {
//       clearInterval(timer);
//       if (autoSubmitTimeoutRef.current) {
//         clearTimeout(autoSubmitTimeoutRef.current);
//       }
//     };
//   }, [timeLeft, isPaused, handleSubmit, showTimeWarning]);

//   const formatTime = (seconds) => {
//     const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
//     const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
//     const s = String(seconds % 60).padStart(2, "0");
//     return `${h}:${m}:${s}`;
//   };

//   const handleOptionChange = (e) => {
//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [currentQuestionIndex]: e.target.value,
//     }));

//     if (skippedQuestions.has(currentQuestionIndex)) {
//       const newSkipped = new Set(skippedQuestions);
//       newSkipped.delete(currentQuestionIndex);
//       setSkippedQuestions(newSkipped);
//     }
//   };

//   const handleNext = () => {
//     const newVisited = new Set(visitedQuestions);
//     newVisited.add(currentQuestionIndex);
//     setVisitedQuestions(newVisited);

//     if (!answers[currentQuestionIndex]) {
//       const newSkipped = new Set(skippedQuestions);
//       newSkipped.add(currentQuestionIndex);
//       setSkippedQuestions(newSkipped);
//     } else {
//       const newSkipped = new Set(skippedQuestions);
//       newSkipped.delete(currentQuestionIndex);
//       setSkippedQuestions(newSkipped);
//     }

//     if (currentQuestionIndex < currentTest.questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleSkipQuestion = () => {
//     const newSkipped = new Set(skippedQuestions);
//     newSkipped.add(currentQuestionIndex);
//     setSkippedQuestions(newSkipped);
//     handleNext();
//   };

//   const isFullscreenAvailable = () => {
//     return (
//       document.fullscreenEnabled ||
//       document.webkitFullscreenEnabled ||
//       document.mozFullScreenEnabled ||
//       document.msFullscreenEnabled
//     );
//   };

//   const toggleFullScreen = () => {
//     const elem = document.documentElement;
//     if (!isFullscreenAvailable()) {
//       alert("Fullscreen is not supported on this device.");
//       return;
//     }

//     if (!document.fullscreenElement) {
//       elem.requestFullscreen?.() ||
//         elem.webkitRequestFullscreen?.() ||
//         elem.mozRequestFullScreen?.() ||
//         elem.msRequestFullscreen?.();
//     } else {
//       document.exitFullscreen?.() ||
//         document.webkitExitFullscreen?.() ||
//         document.mozCancelFullScreen?.() ||
//         document.msExitFullscreen?.();
//     }
//   };

//   const handlePauseTest = () => {
//     setShowConfirmDialog(true);
//   };

//  const confirmPause = async () => {
//   setShowConfirmDialog(false);
//   setIsTestPaused(true);
//   setIsPaused(true);   // <-- stop countdown

//   if (document.fullscreenElement) {
//     document.exitFullscreen();
//   }

//   await dispatch(
//     pauseTest({
//       testId: currentTest._id,
//       timeLeft,
//       answers,
//       currentQuestionIndex,
//       exam,
//       mockTest: selectedMockTest,
//     })
//   );
// };

// const handleResumeTest = () => {
//   setIsTestPaused(false);
//   setIsPaused(false);  
//   if (isFullscreenAvailable()) {
//     toggleFullScreen();
//   }
// };
//   const getQuestionStatusClass = (idx) => {
//     if (currentQuestionIndex === idx) return "active";
//     if (answers[idx]) return "answered";
//     if (skippedQuestions.has(idx)) return "skipped";
//     if (visitedQuestions.has(idx)) return "visited";
//     return "";
//   };

//   if (error) {
//     return <p style={{ color: "red" }}>❌ Failed to load test: {error}</p>;
//   }

//   if (!currentTest || !currentTest.questions?.length) {
//     return <p>Loading test...</p>;
//   }

//   // Progress bar color
//   const progressColor =
//     progress > 50
//       ? "#4caf50"
//       : progress > 20
//       ? "#ffc107"
//       : "#f44336";

//   return (
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
//   );
// };

// export default Test;


// import React, {
//   useEffect,
//   useState,
//   Fragment,
//   useCallback,
//   useRef,
// } from "react";

// // --- MOCK IMPLEMENTATIONS & PLACEHOLDERS ---

// // Mock Redux hooks
// const useDispatch = () => (action) => {
//   console.log("Dispatched Action:", action);
//   // Mock the async action response for resumeTest
//   if (action.type === 'RESUME_TEST') {
//     return Promise.resolve({ 
//       success: true, 
//       attempt: {
//         timeLeft: 500, // Example time left
//         inProgressAnswers: { 0: "Option A0", 2: "Correct Option C2" }, // Example saved answers
//         currentQuestionIndex: 2 // Example saved index
//       }
//     });
//   }
//   return Promise.resolve();
// };

// const useSelector = (selector) => {
//     const mockState = {
//         tests: {
//             tests: [{
//                 _id: "123",
//                 timeDuration: 10, // in minutes
//                 questions: Array.from({ length: 20 }, (_, i) => ({
//                     questionText: `This is question number ${i + 1}? It might have multiple lines of text to check the wrapping and layout. How does it look?`,
//                     options: [`Option A${i}`, `Option B${i}`, `Correct Option C${i}`, `Option D${i}`],
//                     answer: `Correct Option C${i}`,
//                 })),
//             }],
//             error: null
//         }
//     };
//     return selector(mockState);
// };

// // Mock React Router DOM hooks
// const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);
// const useParams = () => ({ exam: "demo-exam", mockTest: "demo-mock-test", id: "123" });
// // Set isResume to true to test the resume logic
// const useLocation = () => ({ state: { isResume: true } });


// // Placeholder actions and component
// const getTests = (exam) => ({ type: 'GET_TESTS', payload: exam });
// const submitTest = (payload) => ({ type: 'SUBMIT_TEST', payload });
// const pauseTest = (payload) => ({ type: 'PAUSE_TEST', payload });
// const resumeTest = (id) => ({ type: 'RESUME_TEST', payload: id });
// const MetaData = ({ title }) => <title>{title}</title>;

// // --- HELPER FUNCTIONS ---
// const formatTime = (seconds) => {
//   if (isNaN(seconds) || seconds < 0) return "00:00:00";
//   const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
//   const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
//   const s = String(Math.floor(seconds % 60)).padStart(2, "0");
//   return `${h}:${m}:${s}`;
// };


// // --- CUSTOM HOOKS ---

// const useTimer = (onTimeout) => {
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isPaused, setIsPaused] = useState(true);
//   const timeoutCallback = useRef(onTimeout);

//   useEffect(() => {
//     timeoutCallback.current = onTimeout;
//   }, [onTimeout]);

//   useEffect(() => {
//     if (isPaused || timeLeft <= 0) return;
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft, isPaused]);

//   useEffect(() => {
//     if (timeLeft === 0 && !isPaused) {
//       timeoutCallback.current?.();
//     }
//     if (timeLeft === 300) console.log("⚠️ 5 minutes remaining!");
//     if (timeLeft === 60) console.log("⚠️ 1 minute remaining!");
//   }, [timeLeft, isPaused]);

//   const start = useCallback((time) => {
//     setTimeLeft(time);
//     setIsPaused(false);
//   }, []);

//   const pause = useCallback(() => {
//     setIsPaused(true);
//   }, []);

//   const resume = useCallback(() => {
//     setIsPaused(false);
//   }, []);

//   return { timeLeft, start, pause, resume };
// };

// const useFullscreen = (onExit) => {
//     const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
//     const exitCallback = useRef(onExit);

//     useEffect(() => {
//         exitCallback.current = onExit;
//     }, [onExit]);

//     const handleFullscreenChange = useCallback(() => {
//         const isCurrentlyFullscreen = !!document.fullscreenElement;
//         if (!isCurrentlyFullscreen && isFullscreen) {
//             exitCallback.current?.();
//         }
//         setIsFullscreen(isCurrentlyFullscreen);
//     }, [isFullscreen]);

//     useEffect(() => {
//         document.addEventListener("fullscreenchange", handleFullscreenChange);
//         return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
//     }, [handleFullscreenChange]);

//     const isFullscreenAvailable = useCallback(() => (
//         document.fullscreenEnabled || document.webkitFullscreenEnabled
//     ), []);

//     const toggleFullScreen = useCallback(async () => {
//         if (!isFullscreenAvailable()) return;
//         try {
//             if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
//             else await document.exitFullscreen();
//         } catch (err) {
//             console.error(`Fullscreen Error: ${err.message}`);
//         }
//     }, [isFullscreenAvailable]);

//     return { isFullscreen, toggleFullScreen, isFullscreenAvailable };
// };


// // --- STYLES COMPONENT ---
// const TestStyles = () => (
//     <style>{`
//         :root {
//           --primary-color: #007bff;
//           --primary-light: #e3f2fd;
//           --success-color: #28a745;
//           --warning-color: #ffc107;
//           --danger-color: #dc3545;
//           --light-gray: #f4f7f9;
//           --medium-gray: #e0e0e0;
//           --dark-gray: #424242;
//           --text-color: #212121;
//         }
//         *, *::before, *::after {
//             box-sizing: border-box;
//         }
//         .test-container-fullscreen {
//           width: 100%;
//           min-height: 100vh;
//           display: flex;
//           flex-direction: column;
//           background: var(--light-gray);
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
//         }
//         .test-layout {
//           display: flex;
//           flex-grow: 1;
//           overflow: hidden;
//           width: 100%;
//           max-width: 1400px;
//           margin: 0 auto;
//         }
//         .test-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 12px 24px;
//           background: #ffffff;
//           border-bottom: 1px solid var(--medium-gray);
//           flex-shrink: 0;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.05);
//           position: sticky;
//           top: 0;
//           z-index: 100;
//         }
//         .test-header .question-number {
//           color: var(--text-color);
//           margin: 0;
//           font-size: 1.1rem;
//         }
//         .test-header .header-controls {
//           display: flex;
//           align-items: center;
//           gap: 20px;
//         }
//         .timer {
//           text-align: center;
//         }
//         .progress-bar-container {
//           width: 120px;
//           height: 6px;
//           background: var(--medium-gray);
//           border-radius: 3px;
//           margin-top: 4px;
//           overflow: hidden;
//         }
//         .progress-bar-fill {
//           height: 100%;
//           border-radius: 3px;
//           transition: width 0.5s ease-in-out, background 0.5s;
//         }
//         .question-area {
//           flex-grow: 1;
//           padding: 32px;
//           display: flex;
//           flex-direction: column;
//           overflow-y: auto;
//         }
//         .question-container {
//           background: #fff;
//           padding: 32px;
//           border-radius: 8px;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
//           margin-bottom: 24px;
//         }
//         .question-text {
//           font-size: 1.35rem;
//           line-height: 1.6;
//           margin-bottom: 32px;
//           color: var(--text-color);
//         }
//         .options-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 15px;
//         }
//         @media (min-width: 1024px) {
//             .options-grid {
//                 grid-template-columns: 1fr 1fr;
//                 gap: 20px;
//             }
//         }
//         .option-item {
//           display: flex;
//           align-items: center;
//           padding: 15px;
//           border: 1px solid #ccc;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           user-select: none;
//         }
//         .option-item:hover {
//           background: #f0f8ff;
//           border-color: var(--primary-color);
//           transform: translateY(-2px);
//         }
//         .option-item.selected {
//           background: var(--primary-light);
//           border-color: var(--primary-color);
//           font-weight: bold;
//           color: var(--primary-color);
//         }
//         .option-item input[type="radio"] {
//           margin-right: 12px;
//           width: 18px;
//           height: 18px;
//           accent-color: var(--primary-color);
//         }
//         .navigation-buttons {
//           display: flex;
//           justify-content: space-between;
//           padding: 24px;
//           background: #fff;
//           border-radius: 8px;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
//         }
//         .question-palette-area {
//           width: 320px;
//           flex-shrink: 0;
//           background: #ffffff;
//           border-left: 1px solid var(--medium-gray);
//           padding: 24px;
//           overflow-y: auto;
//         }
//         .palette-title { margin-bottom: 16px; font-size: 1.2rem; }
//         .palette-legend {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 10px;
//           font-size: 0.85rem;
//           margin-bottom: 24px;
//           align-items: center;
//         }
//         .legend-color {
//           width: 14px; height: 14px;
//           border-radius: 50%;
//           display: inline-block;
//           margin-right: 8px;
//           border: 1px solid #ccc;
//         }
//         .legend-color.answered { background-color: var(--success-color); }
//         .legend-color.skipped { background-color: var(--danger-color); }
//         .legend-color.visited { background-color: #90caf9; }
//         .question-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
//           gap: 10px;
//         }
//         .palette-btn {
//           aspect-ratio: 1 / 1;
//           border-radius: 50%;
//           border: 2px solid transparent;
//           background: var(--medium-gray); color: var(--dark-gray);
//           transition: all 0.2s;
//           cursor: pointer;
//           font-weight: 500;
//         }
//         .palette-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//         }
//         .palette-btn.visited { background: #90caf9; color: white; }
//         .palette-btn.skipped { background: var(--danger-color); color: white; }
//         .palette-btn.answered { background: var(--success-color); color: white; }
//         .palette-btn.active {
//             border-color: var(--primary-color);
//             font-weight: bold;
//             transform: scale(1.1);
//         }
//         .palette-toggle, .palette-close { display: none; }
//         .paused-test-overlay, .custom-modal-overlay {
//           position: fixed; top: 0; left: 0;
//           width: 100%; height: 100%;
//           background: rgba(0,0,0,0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//           animation: fadeIn 0.3s;
//         }
//         .pause-content, .custom-modal-glass {
//           background: white; padding: 40px; border-radius: 16px;
//           text-align: center;
//           max-width: 90%;
//           width: 500px;
//           box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//         }
//         .custom-modal-glass {
//             background: rgba(255, 255, 255, 0.7);
//             backdrop-filter: blur(15px);
//             -webkit-backdrop-filter: blur(15px);
//             border: 1px solid rgba(255, 255, 255, 0.3);
//         }
//         .custom-modal-actions {
//             display: flex;
//             gap: 15px;
//             margin-top: 20px;
//             justify-content: center;
//         }
//         .custom-modal-actions .custom-btn {
//             padding: 12px 24px;
//             border-radius: 8px;
//             border: none;
//             cursor: pointer;
//             font-weight: bold;
//             transition: transform 0.2s, box-shadow 0.2s;
//         }
//         .custom-modal-actions .custom-btn:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 4px 10px rgba(0,0,0,0.1);
//         }
//         .custom-btn-cancel { background-color: #f0f0f0; }
//         .custom-btn-confirm { background-color: var(--danger-color); color: white; }
//         .btn {
//           padding: 10px 20px;
//           border-radius: 8px;
//           border: 1px solid transparent;
//           cursor: pointer;
//           font-weight: 500;
//           transition: all 0.2s;
//         }
//         .btn:hover:not(:disabled) {
//             transform: translateY(-2px);
//             box-shadow: 0 4px 10px rgba(0,0,0,0.1);
//         }
//         .btn:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }
//         .btn-primary { background-color: var(--primary-color); color: white; }
//         .btn-secondary { background-color: #6c757d; color: white; }
//         .btn-success { background-color: var(--success-color); color: white; }
//         .btn-outline-warning { border-color: var(--warning-color); color: var(--warning-color); }
//         .btn-outline-warning:hover { background-color: var(--warning-color); color: white; }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @media (max-width: 768px) {
//             .test-layout {
//               flex-direction: column;
//               max-width: 100%;
//             }
//             .hide-mobile { display: none; }
//             .test-header { padding: 10px 15px; }
//             .question-area {
//                 padding: 15px;
//                 padding-bottom: 80px;
//             }
//             .question-container { padding: 16px; }
//             .question-text { font-size: 1.1rem; margin-bottom: 24px; }
//             .navigation-buttons { padding: 16px; }
//             .question-palette-area {
//               position: fixed;
//               bottom: 0; left: 0;
//               width: 100%;
//               height: 70vh;
//               transform: translateY(100%);
//               transition: transform 0.3s ease-in-out;
//               z-index: 900;
//               border-top: 1px solid #ccc;
//               box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
//               display: block !important;
//               padding: 20px;
//             }
//             .question-palette-area.open {
//               transform: translateY(0);
//             }
//             .palette-toggle {
//               display: flex;
//               justify-content: center; align-items: center;
//               position: fixed;
//               bottom: 0; left: 0;
//               width: 100%;
//               background: var(--primary-color);
//               color: white;
//               padding: 15px;
//               cursor: pointer;
//               z-index: 800;
//               border-top: 1px solid #ccc;
//               font-weight: 500;
//             }
//             .palette-close {
//               display: block;
//               position: absolute;
//               top: 10px; right: 20px;
//               font-size: 2rem;
//               color: #888;
//               background: none; border: none;
//               line-height: 1;
//             }
//         }
//     `}</style>
// );


// // --- UI SUB-COMPONENTS ---

// const TestHeader = ({ timeLeft, totalTime, onPause, currentQuestionIndex, totalQuestions }) => {
//   const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
//   const progressColor = progress > 50 ? "#4caf50" : progress > 20 ? "#ffc107" : "#f44336";
//   return (
//     <header className="test-header">
//       <h5 className="question-number">Question {currentQuestionIndex + 1} of {totalQuestions}</h5>
//       <div className="header-controls">
//         <div className="timer">
//           <span style={{ fontWeight: 600, color: progressColor }}>{formatTime(timeLeft)}</span>
//           <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${progress}%`, background: progressColor }} /></div>
//         </div>
//         <button className="btn btn-outline-warning" onClick={onPause} title="Pause Test"><span className="hide-mobile">Pause</span></button>
//       </div>
//     </header>
//   );
// };

// const QuestionContent = ({ question, currentIndex, totalQuestions, selectedAnswer, onOptionChange, onNext, onPrevious, onSubmit, isSubmitting }) => (
//     <main className="question-area">
//       <div className="question-container">
//         <div className="question-text" style={{ whiteSpace: 'pre-line' }}>{question.questionText}</div>
//         <div className="options-grid">
//           {question.options.map((option, idx) => (
//             <label key={idx} className={`option-item${selectedAnswer === option ? " selected" : ""}`}>
//               <input type="radio" name={`question${currentIndex}`} value={option} checked={selectedAnswer === option} onChange={onOptionChange} />
//               <span>{option}</span>
//             </label>
//           ))}
//         </div>
//       </div>
//       <nav className="navigation-buttons">
//         <button className="btn btn-secondary" onClick={onPrevious} disabled={currentIndex === 0}>Previous</button>
//         {currentIndex === totalQuestions - 1 ? (
//           <button className="btn btn-success" onClick={() => onSubmit(false)} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
//         ) : (
//           <button className="btn btn-primary" onClick={onNext}>Next</button>
//         )}
//       </nav>
//     </main>
// );

// const QuestionPalette = ({ questions, currentIndex, answers, skipped, visited, onQuestionSelect }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const getStatusClass = (idx) => {
//         if (currentIndex === idx) return "active";
//         if (answers[idx]) return "answered";
//         if (skipped.has(idx)) return "skipped";
//         if (visited.has(idx)) return "visited";
//         return "";
//     };
//     const answeredCount = Object.values(answers).filter(Boolean).length;
//     return (
//         <>
//             <div className="palette-toggle" onClick={() => setIsOpen(!isOpen)}>Palette ({answeredCount}/{questions.length})</div>
//             <aside className={`question-palette-area ${isOpen ? 'open' : ''}`}>
//                 <div className="palette-content">
//                     <button className="palette-close" onClick={() => setIsOpen(false)}>&times;</button>
//                     <h5 className="palette-title">Question Palette</h5>
//                     <div className="palette-legend">
//                         <div><span className="legend-color answered"></span>Answered</div>
//                         <div><span className="legend-color skipped"></span>Not Answered</div>
//                         <div><span className="legend-color visited"></span>Visited</div>
//                         <div><span className="legend-color"></span>Not Visited</div>
//                     </div>
//                     <div className="question-grid">
//                         {questions.map((_, idx) => (
//                             <button key={idx} className={`palette-btn ${getStatusClass(idx)}`} onClick={() => { onQuestionSelect(idx); setIsOpen(false); }} title={`Go to question ${idx + 1}`}>{idx + 1}</button>
//                         ))}
//                     </div>
//                 </div>
//             </aside>
//         </>
//     );
// };

// const PauseScreen = ({ onResume }) => (
//   <div className="paused-test-overlay">
//     <div className="pause-content">
//       <h2>Test Paused</h2>
//       <p>Your progress is saved. Resume whenever you're ready.</p>
//       <button className="btn btn-primary btn-lg" onClick={onResume} autoFocus>Resume Test</button>
//     </div>
//   </div>
// );

// const ConfirmationModal = ({ onConfirm, onCancel }) => (
//   <div className="custom-modal-overlay">
//     <div className="custom-modal-glass">
//       <h2>Pause Test?</h2>
//       <p>Your answers and remaining time will be saved. You can resume this test later.</p>
//       <div className="custom-modal-actions">
//         <button className="custom-btn custom-btn-cancel" onClick={onCancel}>Cancel</button>
//         <button className="custom-btn custom-btn-confirm" onClick={onConfirm}>Confirm Pause</button>
//       </div>
//     </div>
//   </div>
// );


// // --- MAIN TEST COMPONENT ---

// const Test = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { exam, mockTest, id } = useParams();

//   const { tests, error } = useSelector((state) => state.tests);

//   const [currentTest, setCurrentTest] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [isTestPaused, setIsTestPaused] = useState(false);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [skippedQuestions, setSkippedQuestions] = useState(new Set());
//   const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const isResume = location.state?.isResume;
  
//   const isPausingIntentionally = useRef(false);
  
//   const { isFullscreen, toggleFullScreen, isFullscreenAvailable } = useFullscreen(() => {
//     if (isPausingIntentionally.current) {
//         isPausingIntentionally.current = false;
//         return;
//     }
//     if (!isTestPaused && !showConfirmDialog) handlePauseTest();
//   });

//   const { timeLeft, start, pause, resume } = useTimer(() => handleSubmit(true));

//   const handleSubmit = useCallback(async (isAutoSubmit = false) => {
//     if (!currentTest || isSubmitting) return;
//     setIsSubmitting(true);
//     if (isAutoSubmit) alert("⏰ Time's up! Submitting your test automatically.");

//     const payload = {
//       testId: currentTest._id,
//       answers: currentTest.questions.map((q, i) => ({
//         question: q.questionText,
//         selectedOption: answers[i] || "Not Attempted",
//         isCorrect: answers[i] === q.answer,
//       })),
//       timeTaken: currentTest.timeDuration * 60 - timeLeft,
//     };

//     try {
//       await dispatch(submitTest(payload));
//       if (isFullscreen) await document.exitFullscreen();
//       navigate(`/${exam}/${mockTest}/test/result/${currentTest._id}`);
//     } catch (err) {
//       alert("Failed to submit test. Please try again.");
//       setIsSubmitting(false);
//     }
//   }, [ currentTest, isSubmitting, answers, navigate, exam, mockTest, dispatch, isFullscreen, timeLeft ]);

//   useEffect(() => {
//     if (exam) dispatch(getTests(exam));
//   }, [dispatch, exam]);

//   useEffect(() => {
//     const test = tests.find((t) => t._id === id);
//     if (!test) return;
//     setCurrentTest(test);
//     const initialTime = test.timeDuration * 60;

//     if (isResume) {
//       console.log("Attempting to resume test...");
//       dispatch(resumeTest(test._id)).then((res) => {
//         if (res && res.attempt) {
//           console.log("Resume data received:", res.attempt);
//           start(res.attempt.timeLeft || initialTime);
//           setAnswers(res.attempt.inProgressAnswers || {});
//           setCurrentQuestionIndex(res.attempt.currentQuestionIndex || 0);
//         } else {
//           start(initialTime);
//         }
//       });
//     } else {
//       start(initialTime);
//     }
//     if (window.innerWidth > 768 && isFullscreenAvailable()) toggleFullScreen();
//   }, [tests, id, isResume, dispatch, start, isFullscreenAvailable, toggleFullScreen]);

//   const handlePauseTest = () => setShowConfirmDialog(true);

//   const confirmPause = async () => {
//     setShowConfirmDialog(false);
//     setIsTestPaused(true);
//     pause();
    
//     isPausingIntentionally.current = true;
//     if (isFullscreen) await document.exitFullscreen();

//     dispatch(pauseTest({ testId: currentTest._id, timeLeft, answers, currentQuestionIndex }));
//   };

//   const handleResumeTest = () => {
//     setIsTestPaused(false);
//     resume();
//     if (isFullscreenAvailable()) toggleFullScreen();
//   };

//   const handleOptionChange = (e) => {
//     setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: e.target.value }));
//     setSkippedQuestions((prev) => {
//         const newSkipped = new Set(prev);
//         newSkipped.delete(currentQuestionIndex);
//         return newSkipped;
//     });
//   };

//   const updateVisitedAndSkipped = (index) => {
//     setVisitedQuestions((prev) => new Set(prev).add(index));
//     if (!answers[index]) setSkippedQuestions((prev) => new Set(prev).add(index));
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < currentTest.questions.length - 1) {
//       updateVisitedAndSkipped(currentQuestionIndex);
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
//   };

//   if (error) return <p className="error-message">❌ Failed to load test: {error}</p>;
//   if (!currentTest) return <p className="loading-message">Loading test...</p>;

//   return (
//     <Fragment>
//       <TestStyles />
//       <MetaData title={"Test in Progress"} />
//       {isTestPaused ? (
//         <PauseScreen onResume={handleResumeTest} />
//       ) : (
//         <div className="test-container-fullscreen">
//           <TestHeader
//             timeLeft={timeLeft}
//             totalTime={currentTest.timeDuration * 60}
//             onPause={handlePauseTest}
//             currentQuestionIndex={currentQuestionIndex}
//             totalQuestions={currentTest.questions.length}
//           />
//           <div className="test-layout">
//             <QuestionContent
//               question={currentTest.questions[currentQuestionIndex]}
//               currentIndex={currentQuestionIndex}
//               totalQuestions={currentTest.questions.length}
//               selectedAnswer={answers[currentQuestionIndex]}
//               onOptionChange={handleOptionChange}
//               onNext={handleNext}
//               onPrevious={handlePrevious}
//               onSubmit={handleSubmit}
//               isSubmitting={isSubmitting}
//             />
//             <QuestionPalette
//               questions={currentTest.questions}
//               currentIndex={currentQuestionIndex}
//               answers={answers}
//               skipped={skippedQuestions}
//               visited={visitedQuestions}
//               onQuestionSelect={setCurrentQuestionIndex}
//             />
//           </div>
//         </div>
//       )}
//       {showConfirmDialog && (
//         <ConfirmationModal
//           onConfirm={confirmPause}
//           onCancel={() => setShowConfirmDialog(false)}
//         />
//       )}
//     </Fragment>
//   );
// };

// export default Test;

import React, {
  useEffect,
  useState,
  Fragment,
  useCallback,
  useRef,
  memo
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getTests, submitTest, pauseTest, resumeTest } from "../actions/productActions";
import MetaData from "./layouts/MetaData";

const TestStyles = () => (
    <style>{`
        :root {
          --primary-color: #007bff;
          --primary-light: #e3f2fd;
          --success-color: #28a745;
          --warning-color: #ffc107;
          --danger-color: #dc3545;
          --light-gray: #f4f7f9;
          --medium-gray: #e0e0e0;
          --dark-gray: #424242;
          --text-color: #212121;
        }
        *, *::before, *::after {
            box-sizing: border-box;
        }
        .test-container-fullscreen {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--light-gray);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .test-layout {
          display: flex;
          flex-grow: 1;
          overflow: hidden;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .test-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          background: #ffffff;
          border-bottom: 1px solid var(--medium-gray);
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .test-header .question-number {
          color: var(--text-color);
          margin: 0;
          font-size: 1.1rem;
        }
        .test-header .header-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .timer {
          text-align: center;
        }
        .progress-bar-container {
          width: 120px;
          height: 6px;
          background: var(--medium-gray);
          border-radius: 3px;
          margin-top: 4px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease-in-out, background 0.5s;
        }
        .question-area {
          flex-grow: 1;
          padding: 32px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .question-container {
          background: #fff;
          padding: 32px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          margin-bottom: 24px;
        }
        .question-text {
          font-size: 1.35rem;
          line-height: 1.6;
          margin-bottom: 32px;
          color: var(--text-color);
        }
        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }
        @media (min-width: 1024px) {
            .options-grid {
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
        }
        .option-item {
          display: flex;
          align-items: center;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .option-item:hover {
          background: #f0f8ff;
          border-color: var(--primary-color);
          transform: translateY(-2px);
        }
        .option-item.selected {
          background: var(--primary-light);
          border-color: var(--primary-color);
          font-weight: bold;
          color: var(--primary-color);
        }
        .option-item input[type="radio"] {
          margin-right: 12px;
          width: 18px;
          height: 18px;
          accent-color: var(--primary-color);
        }
        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          padding: 24px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .question-palette-area {
          width: 320px;
          flex-shrink: 0;
          background: #ffffff;
          border-left: 1px solid var(--medium-gray);
          padding: 24px;
          overflow-y: auto;
        }
        .palette-title { margin-bottom: 16px; font-size: 1.2rem; }
        .palette-legend {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          font-size: 0.85rem;
          margin-bottom: 24px;
          align-items: center;
        }
        .legend-color {
          width: 14px; height: 14px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
          border: 1px solid #ccc;
        }
        .legend-color.answered { background-color: var(--success-color); }
        .legend-color.skipped { background-color: var(--danger-color); }
        .legend-color.visited { background-color: #90caf9; }
        .question-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
          gap: 10px;
        }
        .palette-btn {
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          border: 2px solid transparent;
          background: var(--medium-gray); color: var(--dark-gray);
          transition: all 0.2s;
          cursor: pointer;
          font-weight: 500;
        }
        .palette-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .palette-btn.visited { background: #90caf9; color: white; }
        .palette-btn.skipped { background: var(--danger-color); color: white; }
        .palette-btn.answered { background: var(--success-color); color: white; }
        .palette-btn.active {
            border-color: var(--primary-color);
            font-weight: bold;
            transform: scale(1.1);
        }
        .palette-toggle, .palette-close { display: none; }
        .paused-test-overlay, .custom-modal-overlay {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s;
        }
        .pause-content, .custom-modal-glass {
          background: white; padding: 40px; border-radius: 16px;
          text-align: center;
          max-width: 90%;
          width: 500px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .custom-modal-glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .custom-modal-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            justify-content: center;
        }
        .custom-modal-actions .custom-btn {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .custom-modal-actions .custom-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .custom-btn-cancel { background-color: #f0f0f0; }
        .custom-btn-confirm { background-color: var(--danger-color); color: white; }
        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-primary { background-color: var(--primary-color); color: white; }
        .btn-secondary { background-color: #6c757d; color: white; }
        .btn-success { background-color: var(--success-color); color: white; }
        .btn-outline-warning { border-color: var(--warning-color); color: var(--warning-color); }
        .btn-outline-warning:hover { background-color: var(--warning-color); color: white; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 768px) {
            .test-layout {
              flex-direction: column;
              max-width: 100%;
            }
            .hide-mobile { display: none; }
            .test-header { padding: 10px 15px; }
            .question-area {
                padding: 15px;
                padding-bottom: 80px;
            }
            .question-container { padding: 16px; }
            .question-text { font-size: 1.1rem; margin-bottom: 24px; }
            .navigation-buttons { padding: 16px; }
            .question-palette-area {
              position: fixed;
              bottom: 0; left: 0;
              width: 100%;
              height: 70vh;
              transform: translateY(100%);
              transition: transform 0.3s ease-in-out;
              z-index: 900;
              border-top: 1px solid #ccc;
              box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
              display: block !important;
              padding: 20px;
            }
            .question-palette-area.open {
              transform: translateY(0);
            }
            .palette-toggle {
              display: flex;
              justify-content: center; align-items: center;
              position: fixed;
              bottom: 0; left: 0;
              width: 100%;
              background: var(--primary-color);
              color: white;
              padding: 15px;
              cursor: pointer;
              z-index: 800;
              border-top: 1px solid #ccc;
              font-weight: 500;
            }
            .palette-close {
              display: block;
              position: absolute;
              top: 10px; right: 20px;
              font-size: 2rem;
              color: #888;
              background: none; border: none;
              line-height: 1;
            }
        }
    `}</style>
);

// --- Helpers ---
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "00:00:00";
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

// Timer Hook
const useTimer = (onTimeout) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const timeoutCallback = useRef(onTimeout);

  useEffect(() => { timeoutCallback.current = onTimeout; }, [onTimeout]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);

  useEffect(() => {
    if (timeLeft === 0 && !isPaused) timeoutCallback.current?.();
  }, [timeLeft, isPaused]);

  return {
    timeLeft,
    start: (t) => { setTimeLeft(t); setIsPaused(false); },
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
  };
};

// --- Memoized UI ---
const TestHeader = memo(({ timeLeft, totalTime, onPause, currentIndex, total }) => {
  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const progressColor = progress > 50 ? "#4caf50" : progress > 20 ? "#ffc107" : "#f44336";
  return (
    <header className="test-header">
      <h5 className="question-number">Question {currentIndex + 1} of {total}</h5>
      <div className="header-controls">
        <div className="timer">
          <span style={{ fontWeight: 600, color: progressColor }}>{formatTime(timeLeft)}</span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%`, background: progressColor }} />
          </div>
        </div>
        <button className="btn btn-outline-warning" onClick={onPause}>Pause</button>
      </div>
    </header>
  );
});

const QuestionContent = memo(({ question, currentIndex, total, selectedAnswer, onOptionChange, onNext, onPrev, onSubmit, isSubmitting }) => (
  <main className="question-area">
    <div className="question-container">
      <div className="question-text">{question.questionText}</div>
      <div className="options-grid">
        {question.options.map((opt, idx) => (
          <label key={idx} className={`option-item${selectedAnswer === opt ? " selected" : ""}`}>
            <input
              type="radio"
              name={`q${currentIndex}`}
              value={opt}
              checked={selectedAnswer === opt}
              onChange={onOptionChange}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
    <nav className="navigation-buttons">
      <button className="btn btn-secondary" onClick={onPrev} disabled={currentIndex === 0}>Previous</button>
      {currentIndex === total - 1 ? (
        <button className="btn btn-success" onClick={() => onSubmit(false)} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      ) : (
        <button className="btn btn-primary" onClick={onNext}>Next</button>
      )}
    </nav>
  </main>
));

const QuestionPalette = memo(({ questions, currentIndex, answers, skipped, visited, onJump }) => {
  const getStatus = (i) => {
    if (currentIndex === i) return "active";
    if (answers[i]) return "answered";
    if (skipped.has(i)) return "skipped";
    if (visited.has(i)) return "visited";
    return "";
  };
  return (
    <aside className="question-palette-area">
      <h5>Question Palette</h5>
      <div className="question-grid">
        {questions.map((_, i) => (
          <button
            key={i}
            className={`palette-btn ${getStatus(i)}`}
            onClick={() => onJump(i)}
          >{i + 1}</button>
        ))}
      </div>
    </aside>
  );
});

// --- Main Component ---
const Test = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { exam, mockTest, id } = useParams();
  const { tests, error } = useSelector((state) => state.tests);

  const [currentTest, setCurrentTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState(new Set());
  const [visited, setVisited] = useState(new Set([0]));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isResume = location.state?.isResume;

  const { timeLeft, start, pause, resume } = useTimer(() => handleSubmit(true));

  // Fetch test
  useEffect(() => { if (exam) dispatch(getTests(exam)); }, [exam, dispatch]);

  useEffect(() => {
    const test = tests.find((t) => t._id === id);
    if (!test) return;
    setCurrentTest(test);
    const totalTime = test.timeDuration * 60;
    if (isResume) {
      dispatch(resumeTest(test._id)).then((res) => {
        if (res?.attempt) {
          start(res.attempt.timeLeft || totalTime);
          setAnswers(res.attempt.inProgressAnswers || {});
          setCurrentIndex(res.attempt.currentQuestionIndex || 0);
        } else start(totalTime);
      });
    } else start(totalTime);
  }, [tests, id, isResume, dispatch, start]);

  const handleSubmit = useCallback(async (auto = false) => {
    if (!currentTest || isSubmitting) return;
    setIsSubmitting(true);
    if (auto) alert("Time's up! Submitting automatically...");
    const payload = {
      testId: currentTest._id,
      answers: currentTest.questions.map((q, i) => ({
        question: q.questionText,
        selectedOption: answers[i] || "Not Attempted",
        isCorrect: answers[i] === q.answer,
      })),
      timeTaken: currentTest.timeDuration * 60 - timeLeft,
    };
    await dispatch(submitTest(payload));
    navigate(`/${exam}/${mockTest}/test/result/${currentTest._id}`);
  }, [answers, currentTest, timeLeft, exam, mockTest, dispatch, navigate, isSubmitting]);

  const handleNext = () => {
    if (currentIndex < currentTest.questions.length - 1) {
      setVisited((v) => new Set(v).add(currentIndex + 1));
      if (!answers[currentIndex]) setSkipped((s) => new Set(s).add(currentIndex));
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (error) return <p>❌ {error}</p>;
  if (!currentTest) return <p>Loading...</p>;

  return (
    <Fragment>
      <MetaData title="Test in Progress" />
      <div className="test-container-fullscreen">
        <TestHeader
          timeLeft={timeLeft}
          totalTime={currentTest.timeDuration * 60}
          currentIndex={currentIndex}
          total={currentTest.questions.length}
          onPause={() => pause()}
        />
        <div className="test-layout">
          <QuestionContent
            question={currentTest.questions[currentIndex]}
            currentIndex={currentIndex}
            total={currentTest.questions.length}
            selectedAnswer={answers[currentIndex]}
            onOptionChange={(e) => setAnswers((a) => ({ ...a, [currentIndex]: e.target.value }))}
            onNext={handleNext}
            onPrev={() => setCurrentIndex((i) => i - 1)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          <QuestionPalette
            questions={currentTest.questions}
            currentIndex={currentIndex}
            answers={answers}
            skipped={skipped}
            visited={visited}
            onJump={setCurrentIndex}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Test;
