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

  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (!currentTest || !currentTest.questions) return;
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Clear any existing auto-submit timeout
      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
      }

      // Format answers according to the schema
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

      // If it's an auto-submit, show an alert
      if (isAutoSubmit) {
        alert("Time's up! Your test is being submitted automatically.");
      }

      // Submit test
      const submitResponse = await dispatch(submitTest(payload));
      
      // Clear saved test state
      localStorage.removeItem("pausedTest");

      // Exit fullscreen mode if active
      if (document.fullscreenElement) {
        await document.exitFullscreen?.() ||
              document.webkitExitFullscreen?.() ||
              document.mozCancelFullScreen?.() ||
              document.msExitFullscreen?.();
      }

      // Wait a moment for the submission to be processed and fullscreen to exit
      await new Promise(resolve => setTimeout(resolve, 1500));

      try {
        // Try to fetch result
        await dispatch(getResult(currentTest._id));
        navigate(`/${selectedExam}/${selectedMockTest}/test/result/${currentTest._id}`);
      } catch (resultError) {
        console.error("Failed to fetch result:", resultError);
        // Even if result fetch fails, still navigate to result page
        // It will handle showing loading state or retry fetching
        navigate(`/${selectedExam}/${selectedMockTest}/test/result/${currentTest._id}`);
      }

    } catch (error) {
      console.error("Test submission error:", error);
      alert("Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentTest, answers, timeLeft, dispatch, navigate, selectedExam, selectedMockTest, isSubmitting]);

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
          elem.requestFullscreen?.().catch((err) =>
            console.error("Failed to enter full screen:", err)
          );
        }
      }
    }
  }, [tests, id, isResume]);

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
    if (isFullscreenAvailable()) {
      toggleFullScreen();
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isTestPaused) {
        handlePauseTest();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    // Show warning when 5 minutes are left
    if (timeLeft === 300 && !showTimeWarning) {
      setShowTimeWarning(true);
      alert("⚠️ 5 minutes remaining!");
    }
    // Show warning when 1 minute is left
    else if (timeLeft === 60 && !showTimeWarning) {
      setShowTimeWarning(true);
      alert("⚠️ 1 minute remaining!");
    }
    // Reset warning flag when time changes
    else if (timeLeft !== 300 && timeLeft !== 60) {
      setShowTimeWarning(false);
    }

    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Set up auto-submit 5 seconds before time ends
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

  const confirmPause = () => {
    setIsTestPaused(true);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    localStorage.setItem(
      "pausedTest",
      JSON.stringify({
        testId: currentTest._id,
        exam,
        mockTest: selectedMockTest,
        timeLeft,
        answers,
        currentQuestionIndex,
      })
    );
    setShowConfirmDialog(false);
  };

  const handleResumeTest = () => {
    setIsTestPaused(false);
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

  return (
    <Fragment>
      <MetaData title={"Test"} />
      {isTestPaused ? (
        <div className="paused-test-overlay">
          <div className="pause-content">
            <h2>
              <i className="fas fa-pause-circle"></i>
              Test Paused
            </h2>
            <p>
              Your test progress has been saved successfully.
              <br /><br />
              When you resume, you'll continue from exactly where you left off.
              <br />
              All your answers and remaining time will be preserved.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleResumeTest}
            >
              <i className="fas fa-play"></i>
              Resume Test Now
            </button>
          </div>
        </div>
      ) : (
        <div className="test-container-fullscreen">
          {currentTest && currentTest.questions && (
            <div className="test-layout">
              {/* Main question area */}
              <div className="question-area">
                <div className="test-content">
                  {/* Header with timer and pause button */}
                  <div className="test-header">
                    <div className="header-content">
                      <h5 className="question-number">Question {currentQuestionIndex + 1}</h5>
                      <div className="header-controls">
                        <div className="timer">
                          Time Left: {formatTime(timeLeft)}
                        </div>
                        <button 
                          className="btn btn-outline-warning"
                          onClick={handlePauseTest}
                        >
                          <i className="fas fa-pause"></i> Pause Test
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Question content */}
                  <div className="question-container">
                    <div className="question-content">
                      <div className="question-text" style={{ whiteSpace: 'pre-line' }}>
                        {currentTest.questions[currentQuestionIndex].questionText.split('\n').map((line, index) => (
                          <p key={index} className={index === 0 ? 'main-question' : 'sub-question'}>
                            {line}
                          </p>
                        ))}
                      </div>

                      <div className="options-grid">
                        {currentTest.questions[currentQuestionIndex].options.map((option, idx) => (
                          <div key={idx} className="option-item">
                            <input
                              type="radio"
                              name={`question${currentQuestionIndex}`}
                              id={`option${idx}`}
                              value={option}
                              checked={answers[currentQuestionIndex] === option}
                              onChange={handleOptionChange}
                            />
                            <label htmlFor={`option${idx}`}>
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation buttons */}
                  <div className="navigation-buttons">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                      disabled={currentQuestionIndex === 0}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Previous
                    </button>
                    {currentQuestionIndex === currentTest.questions.length - 1 ? (
                      <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                      >
                        <i className="fas fa-check-circle me-2"></i>
                        Submit Test
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={handleNext}
                      >
                        Next
                        <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Question palette */}
              <div className="question-palette-area">
                <div className="palette-content">
                  <h5 className="palette-title">Question Palette</h5>
                  <div className="palette-legend">
                    <div className="legend-item">
                      <span className="legend-color answered"></span>
                      <span>Answered</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color skipped"></span>
                      <span>Not Answered</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color visited"></span>
                      <span>Visited</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color"></span>
                      <span>Not Visited</span>
                    </div>
                  </div>
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
            </div>
          )}
        </div>
      )}

      {/* Pause Confirmation Modal */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-pause-circle"></i>
                  Pause Test
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowConfirmDialog(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Would you like to pause your test?
                  <br /><br />
                  Don't worry - we'll save your progress automatically:
                  <br />
                  • All your answers will be saved
                  <br />
                  • Your remaining time will be preserved
                  <br />
                  • You can resume exactly where you left off
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowConfirmDialog(false)}
                >
                  <i className="fas fa-arrow-left"></i>
                  Continue Test
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={confirmPause}
                >
                  <i className="fas fa-pause"></i>
                  Pause Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Test; 