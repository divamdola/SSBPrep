import React, {
  useEffect,
  useState,
  Fragment,
  useCallback,
  useRef,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getTests,
  submitTest,
  pauseTest,
  resumeTest,
} from "../actions/productActions";
import MetaData from "./layouts/MetaData";

// --- Custom Styles Component ---
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
      --border-radius: 8px;
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
      max-width: 1600px;
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
      width: calc(100% - 320px);
    }
    .question-container {
      background: #fff;
      padding: 32px;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      margin-bottom: 24px;
    }
    .question-text {
      font-size: 1.35rem;
      line-height: 1.6;
      margin-bottom: 32px;
      color: var(--text-color);
      word-wrap: break-word;
      overflow-wrap: break-word;
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
      align-items: flex-start;
      padding: 15px;
      border: 1px solid #ccc;
      border-radius: var(--border-radius);
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
      margin-top: 2px;
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      accent-color: var(--primary-color);
    }
    .option-item span {
      word-wrap: break-word;
      overflow-wrap: break-word;
      line-height: 1.4;
    }
    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      padding: 24px;
      background: #fff;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      flex-shrink: 0;
      margin-top: auto;
    }
    .question-palette-area {
      width: 320px;
      flex-shrink: 0;
      background: #ffffff;
      border-left: 1px solid var(--medium-gray);
      padding: 24px;
      overflow-y: auto;
      order: 1;
    }
    
    .palette-info {
      background-color: var(--light-gray);
      padding: 12px;
      border-radius: var(--border-radius);
      margin-bottom: 20px;
    }
    .palette-summary {
        font-size: 0.9rem;
        margin-bottom: 12px;
        color: var(--dark-gray);
        text-align: center;
    }
    .palette-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
      font-size: 0.8rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .legend-color-box {
      width: 14px;
      height: 14px;
      border-radius: 3px;
    }
    .question-palette-area h5 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.2rem;
        color: var(--text-color);
    }
    .question-palette-area .question-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
        gap: 8px;
    }
    .palette-btn {
      aspect-ratio: 1 / 1;
      border-radius: var(--border-radius);
      border: 2px solid transparent;
      background: var(--medium-gray);
      color: var(--dark-gray);
      transition: all 0.2s;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    .palette-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .palette-btn.unvisited { background: #e0e0e0; color: var(--dark-gray); border-color: #bdbdbd; }
    .palette-btn.skipped { background: var(--danger-color); color: white; }
    .palette-btn.answered { background: var(--success-color); color: white; }
    .palette-btn.active {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-light);
        font-weight: bold;
        transform: scale(1.05);
        color: var(--primary-color);
        background: #fff;
    }
    
    .btn {
      padding: 10px 20px;
      border-radius: var(--border-radius);
      border: 1px solid transparent;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      min-width: 120px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
    .btn-danger { background-color: var(--danger-color); color: white; }
    .btn-success { background-color: var(--success-color); color: white; }
    .btn-outline-warning { border-color: var(--warning-color); color: var(--warning-color); background: #fff;}
    .btn-outline-warning:hover:not(:disabled) { background-color: var(--warning-color); color: white; }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
    }
    .modal-content {
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        max-width: 90%;
        width: 450px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        text-align: center;
    }
    .modal-content h3 {
        margin-top: 0;
        color: var(--primary-color);
    }
    .modal-content p {
        margin-bottom: 30px;
        color: var(--text-color);
    }
    .modal-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
    }

    .timeout-notification {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--danger-color);
      color: white;
      padding: 20px 40px;
      border-radius: var(--border-radius);
      font-size: 1.2rem;
      z-index: 300;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }

    /* --- MOBILE STYLES --- */
    @media (max-width: 1023px) {
      .test-layout { flex-direction: column; overflow-y: auto; }
      
      /* --- START OF CHANGES --- */

      /* MODIFIED: Make the Question Palette appear FIRST on mobile */
      .question-palette-area { 
        width: 100%; 
        border-left: none; 
        border-bottom: 1px solid var(--medium-gray); /* Change border to bottom */
        padding: 16px 12px; 
        flex-shrink: 0; 
        order: 1; /* Palette is now first */
      }
      
      /* MODIFIED: Make the Question Area appear SECOND on mobile */
      .question-area { 
        padding: 16px 12px; 
        overflow-y: visible; 
        width: 100%; 
        order: 2; /* Question area is now second */
      }
      
      /* --- END OF CHANGES --- */

      .question-container { padding: 18px; margin-bottom: 16px; }
      .question-text { font-size: 1.05rem; margin-bottom: 20px; }
      .question-palette-area .question-grid { grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); }
      .palette-btn { border-radius: 6px; }
      .navigation-buttons { padding: 12px 16px; border-radius: 0; margin-top: 16px; }
      .btn { min-width: 80px; padding: 8px 15px; font-size: 0.9rem; }
    }
  `}</style>
);

// --- Helpers and Custom Hooks (No changes here) ---
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "00:00:00";
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const useFullscreen = (elementRef) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const enterFullscreen = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }, [elementRef]);
  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  return { isFullscreen, enterFullscreen, exitFullscreen };
};

const useTimer = (initialTime, onTimeout) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(true);
  const timeoutCallback = useRef(onTimeout);
  useEffect(() => {
    timeoutCallback.current = onTimeout;
  }, [onTimeout]);
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);
  useEffect(() => {
    if (timeLeft === 0 && !isPaused) timeoutCallback.current?.();
  }, [timeLeft, isPaused]);
  const start = useCallback((t) => {
    setTimeLeft(t);
    setIsPaused(false);
  }, []);
  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  return { timeLeft, isPaused, start, pause, resume, setTimeLeft };
};

const useTestAttempt = (totalQuestions) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState(new Set([0]));
  const updateAnswer = useCallback((index, answer) => {
    setAnswers((a) => ({ ...a, [index]: answer }));
  }, []);
  const handleJump = useCallback(
    (index) => {
      if (index >= 0 && index < totalQuestions) {
        setVisited((v) => new Set(v).add(index));
        setCurrentIndex(index);
      }
    },
    [totalQuestions]
  );
  const handleNext = useCallback(() => handleJump(currentIndex + 1), [
    currentIndex,
    handleJump,
  ]);
  const handlePrev = useCallback(() => handleJump(currentIndex - 1), [
    currentIndex,
    handleJump,
  ]);
  return {
    currentIndex,
    answers,
    visited,
    updateAnswer,
    handleJump,
    handleNext,
    handlePrev,
    setCurrentIndex,
    setAnswers,
    setVisited,
  };
};

// --- UI Components (No changes here) ---
const TestHeader = memo(
  ({ timeLeft, totalTime, onPause, currentIndex, total }) => {
    const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    const progressColor =
      progress > 50 ? "#4caf50" : progress > 20 ? "#ffc107" : "#f44336";
    return (
      <header className="test-header">
        <h5 className="question-number">
          Question <b>{currentIndex + 1}</b> of {total}
        </h5>
        <div className="header-controls">
          <div className="timer">
            <span style={{ fontWeight: 600, color: progressColor }}>
              {formatTime(timeLeft)}
            </span>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%`, background: progressColor }}
              />
            </div>
          </div>
          <button className="btn btn-outline-warning" onClick={onPause}>
            Pause
          </button>
        </div>
      </header>
    );
  }
);

const QuestionContent = memo(
  ({
    question,
    currentIndex,
    total,
    selectedAnswer,
    onOptionChange,
    onNext,
    onPrev,
    onSubmit,
    isSubmitting,
    questionAreaRef,
  }) => {
    useEffect(() => {
      if (questionAreaRef.current) {
        questionAreaRef.current.scrollTop = 0;
      }
    }, [currentIndex, questionAreaRef]);
    if (!question)
      return (
        <div className="question-area">
          <p>Loading question...</p>
        </div>
      );
    return (
      <main className="question-area" ref={questionAreaRef}>
        <div className="question-container">
          <div className="question-text">{question.questionText}</div>
          <div className="options-grid">
            {question.options.map((opt, idx) => (
              <label
                key={idx}
                className={`option-item${
                  selectedAnswer === opt ? " selected" : ""
                }`}
              >
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
          <button
            className="btn btn-secondary"
            onClick={onPrev}
            disabled={currentIndex === 0 || isSubmitting}
          >
            Previous
          </button>
          {currentIndex === total - 1 ? (
            <button
              className="btn btn-success"
              onClick={() => onSubmit(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onNext}
              disabled={isSubmitting}
            >
              Next
            </button>
          )}
        </nav>
      </main>
    );
  }
);

const PaletteLegend = () => (
  <div className="palette-legend">
    <div className="legend-item">
      <div
        className="legend-color-box"
        style={{ background: "#28a745" }}
      ></div>
      <span>Answered</span>
    </div>
    <div className="legend-item">
      <div
        className="legend-color-box"
        style={{ background: "#dc3545" }}
      ></div>
      <span>Skipped</span>
    </div>
    <div className="legend-item">
      <div
        className="legend-color-box"
        style={{ background: "#e0e0e0", border: "1px solid #bdbdbd" }}
      ></div>
      <span>Unvisited</span>
    </div>
  </div>
);

const QuestionPalette = memo(
  ({ totalQuestions, currentIndex, answers, visited, onJump }) => {
    const getStatus = (i) => {
      if (currentIndex === i) return "active";
      if (answers[i]) return "answered";
      if (visited.has(i)) return "skipped";
      return "unvisited";
    };
    const answeredCount = Object.keys(answers).length;
    const skippedCount = Array.from(
      { length: totalQuestions },
      (_, i) => i
    ).filter((i) => visited.has(i) && !answers[i]).length;

    return (
      <aside className="question-palette-area">
        <h5>Question Palette</h5>
        <div className="palette-info">
          <p className="palette-summary">
            <b>{answeredCount}</b> Answered | <b>{skippedCount}</b> Skipped |{" "}
            <b>{totalQuestions}</b> Total
          </p>
          <PaletteLegend />
        </div>
        <div className="question-grid">
          {Array.from({ length: totalQuestions }, (_, i) => i).map((i) => (
            <button
              key={i}
              className={`palette-btn ${getStatus(i)}`}
              onClick={() => onJump(i)}
              title={`Question ${i + 1}: ${getStatus(i).toUpperCase()}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </aside>
    );
  }
);

const ConfirmPauseModal = memo(({ onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Confirm Pause</h3>
      <p>Are you sure you want to pause the test? Your progress will be saved.</p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm}>
          Pause Test
        </button>
      </div>
    </div>
  </div>
));

const ResumeModal = memo(({ onResume, onSubmit }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Test Paused</h3>
      <p>
        The test is paused. Resume to continue or submit your current progress.
      </p>
      <div className="modal-actions">
        <button className="btn btn-primary" onClick={onResume}>
          Resume Test
        </button>
        <button className="btn btn-success" onClick={onSubmit}>
          Submit Now
        </button>
      </div>
    </div>
  </div>
));

// --- Main Component (No changes here) ---
const Test = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { exam, mockTest, id } = useParams();

  const questionAreaRef = useRef(null);
  const fullscreenRef = useRef(null);

  const { tests, error } = useSelector((state) => state.tests);

  const [currentTest, setCurrentTest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeoutNotification, setTimeoutNotification] = useState(false);

  const [showConfirmPauseModal, setShowConfirmPauseModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const isResume = location.state?.isResume;
  const initialTimeDuration = 3600;

  const { enterFullscreen, exitFullscreen } = useFullscreen(fullscreenRef);

  const timerControls = useRef({});
  const totalQuestions = currentTest?.questions?.length || 0;
  const {
    currentIndex,
    answers,
    visited,
    updateAnswer,
    handleJump,
    handleNext,
    handlePrev,
    setCurrentIndex,
    setAnswers,
    setVisited,
  } = useTestAttempt(totalQuestions);

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (!currentTest || isSubmitting) return;
      setIsSubmitting(true);
      timerControls.current.pause();
      setShowResumeModal(false);
      if (auto) {
        setTimeoutNotification(true);
        setTimeout(() => setTimeoutNotification(false), 3000);
      }
      const payload = {
        testId: currentTest._id,
        answers: currentTest.questions.map((q, i) => ({
          question: q.questionText,
          selectedOption: answers[i] || "Not Attempted",
          isCorrect: answers[i] === q.answer,
        })),
        timeTaken:
          currentTest.timeDuration * 60 - timerControls.current.timeLeft,
      };
      try {
        const result = await dispatch(submitTest(payload));
        if (result.error) {
          throw new Error(result.error.message || "Submission failed");
        }
        exitFullscreen();
        navigate(`/${exam}/${mockTest}/test/result/${currentTest._id}`);
      } catch (e) {
        setIsSubmitting(false);
        console.error("Submission failed:", e);
        alert(`Failed to submit test. Please try again. Error: ${e.message}`);
        if (!auto) timerControls.current.resume();
      }
    },
    [
      answers,
      currentTest,
      exam,
      mockTest,
      dispatch,
      navigate,
      isSubmitting,
      exitFullscreen,
    ]
  );

  const handleTimeUp = useCallback(() => handleSubmit(true), [handleSubmit]);
  const { timeLeft, start, pause, resume, isPaused } = useTimer(
    initialTimeDuration,
    handleTimeUp
  );

  useEffect(() => {
    timerControls.current = { pause, resume, timeLeft };
  }, [pause, resume, timeLeft]);

  useEffect(() => {
    if (exam && !tests.length) dispatch(getTests(exam));
  }, [exam, dispatch, tests.length]);

  useEffect(() => {
    if (!tests.length) return;
    const test = tests.find((t) => t._id === id);
    if (!test) return;
    setCurrentTest(test);
    enterFullscreen();
    const totalTime = test.timeDuration * 60;

    if (isResume) {
      dispatch(resumeTest(test._id))
        .then((res) => {
          const attempt = res?.payload?.attempt;
          if (attempt) {
            const index = attempt.currentQuestionIndex || 0;
            setAnswers(attempt.inProgressAnswers || {});
            setCurrentIndex(index);
            const attemptedIndices = Object.keys(
              attempt.inProgressAnswers
            ).map(Number);
            setVisited(new Set([...attemptedIndices, index]));
            start(attempt.timeLeft || totalTime);
          } else {
            start(totalTime);
          }
        })
        .catch((err) => {
          console.error("Resume failed:", err);
          start(totalTime);
        });
    } else {
      start(totalTime);
    }
  }, [
    tests,
    id,
    isResume,
    dispatch,
    start,
    setCurrentIndex,
    setAnswers,
    setVisited,
    enterFullscreen,
  ]);

  const handlePause = () => {
    if (!currentTest || isSubmitting) return;
    setShowConfirmPauseModal(false);
    pause();
    exitFullscreen();
    setShowResumeModal(true);
    dispatch(
      pauseTest({
        testId: currentTest._id,
        timeLeft: timeLeft,
        inProgressAnswers: answers,
        currentQuestionIndex: currentIndex,
      })
    );
  };

  const handleResume = () => {
    if (isSubmitting) return;
    enterFullscreen();
    resume();
    setShowResumeModal(false);
  };

  const requestPause = () => {
    if (isSubmitting) return;
    setShowConfirmPauseModal(true);
  };

  if (error)
    return <p className="error-message">❌ Error loading test: {error}</p>;
  if (!currentTest || !currentTest.questions)
    return <p className="loading-message">Loading test details...</p>;
  if (currentTest.questions.length === 0)
    return <p className="empty-message">No questions found for this test.</p>;

  const currentQuestion = currentTest.questions[currentIndex];

  return (
    <Fragment>
      <MetaData title="Test in Progress" />
      <TestStyles />
      {timeoutNotification && (
        <div className="timeout-notification">
          Time's up! Submitting automatically...
        </div>
      )}

      {showConfirmPauseModal && (
        <ConfirmPauseModal
          onConfirm={handlePause}
          onCancel={() => setShowConfirmPauseModal(false)}
        />
      )}

      {isPaused && showResumeModal && (
        <ResumeModal
          onResume={handleResume}
          onSubmit={() => handleSubmit(false)}
        />
      )}

      <div className="test-container-fullscreen" ref={fullscreenRef}>
        <TestHeader
          timeLeft={timeLeft}
          totalTime={currentTest.timeDuration * 60}
          currentIndex={currentIndex}
          total={totalQuestions}
          onPause={requestPause}
        />
        <div className="test-layout">
          <QuestionContent
            question={currentQuestion}
            currentIndex={currentIndex}
            total={totalQuestions}
            selectedAnswer={answers[currentIndex]}
            onOptionChange={(e) => updateAnswer(currentIndex, e.target.value)}
            onNext={handleNext}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            questionAreaRef={questionAreaRef}
          />
          <QuestionPalette
            totalQuestions={totalQuestions}
            currentIndex={currentIndex}
            answers={answers}
            visited={visited}
            onJump={handleJump}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Test;