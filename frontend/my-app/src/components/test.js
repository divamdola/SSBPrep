import React, {
  useEffect,
  useState,
  Fragment,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getTests } from "../actions/productActions";
import { submitTest } from "../actions/productActions";
import { getResult } from "../actions/productActions";
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

  const pauseModalRef = useRef(null);
  const pauseModalInstanceRef = useRef(null);

  const selectedExam = location.state?.selectedExam || exam;
  const selectedMockTest = location.state?.selectedMockTest || mockTest;
  const isResume = location.state?.isResume;

  const handleSubmit = useCallback(async () => {
    if (!currentTest || !currentTest.questions) return;

    const payload = {
        testId: currentTest._id,
        answers: currentTest.questions.map((_, idx) => answers[idx] || ""),
        timeTaken: (currentTest.timeDuration * 60) - timeLeft,
      };

    try {
      await dispatch(submitTest(payload));

      alert("✅ Test submitted!");
      localStorage.removeItem("pausedTest");
      await dispatch(getResult(currentTest._id));
      navigate(
        `/${selectedExam}/${selectedMockTest}/test/result/${currentTest._id}`
      );
    } catch (error) {
      console.error("❌ Error submitting test:", error);
      alert("❌ Something went wrong while submitting the test.");
    }
  }, [
    answers,
    currentTest,
    timeLeft,
    dispatch,
    navigate,
    selectedExam,
    selectedMockTest,
  ]);

  useEffect(() => {
    if (exam) {
      dispatch(getTests(exam));
    }
  }, [dispatch, exam]);

  useEffect(() => {
    const test = tests.find((t) => t._id === id);
    if (test) {
      setCurrentTest(test);

      // Resume time if test was paused
      const paused = JSON.parse(localStorage.getItem("pausedTest"));
      if (isResume && paused?.timeLeft) {
        setTimeLeft(paused.timeLeft);
        setAnswers(paused.answers || {});
        setCurrentQuestionIndex(paused.currentQuestionIndex || 0);
      } else {
        setTimeLeft(test.timeDuration * 60);
      }

      // Enter fullscreen
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        elem
          .requestFullscreen()
          .catch((err) => console.error("Failed to enter full screen:", err));
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
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPaused(true);

        // Save pause state to localStorage
        localStorage.setItem(
          "pausedTest",
          JSON.stringify({
            testId: currentTest._id,
            exam,
            mockTest: window.location.pathname.split("/")[2],
            timeLeft,
            answers,
            currentQuestionIndex,
          })
        );

        pauseModalInstanceRef.current?.show();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [timeLeft, answers, currentQuestionIndex, currentTest, exam]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, handleSubmit]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleOptionChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  if (error) {
    return <p style={{ color: "red" }}>❌ Failed to load test: {error}</p>;
  }

  if (!currentTest || !currentTest.questions?.length) {
    return <p>Loading test...</p>;
  }

  const question = currentTest.questions[currentQuestionIndex];
  const selected = answers[currentQuestionIndex] || "";

  return (
    <Fragment>
    <MetaData title={`${currentTest.title} - Test`} />
      <div className="test-body">
        {isPaused && (
          <div className="resume-container">
            <div className="resume-content">
              <p className="resume-text">
                You have paused the test. Resume to continue.
              </p>
              <button
                className="resume-btn"
                onClick={() => {
                  setIsPaused(false);
                  const elem = document.documentElement;
                  if (!document.fullscreenElement) {
                    elem
                      .requestFullscreen()
                      .catch((err) =>
                        console.error("Failed to re-enter full screen:", err)
                      );
                  }
                }}
              >
                Resume
              </button>
            </div>
          </div>
        )}

        <div className="test-head">
          <div className="test-name">
            <p>{currentTest.title}</p>
          </div>
          <div className="timeleft">
            <p>Time left {formatTime(timeLeft)}</p>
          </div>
          <div className="full-button">
            <button
              className="pause-btn"
              onClick={(e) => {
                e.preventDefault();
                pauseModalInstanceRef.current?.show();
              }}
            >
              Pause
            </button>

            <button className="full-btn" onClick={toggleFullScreen}>
              Enter Full Screen
            </button>
          </div>
        </div>

        <div className="test-content">
          <div className="test-section">
            <div className="ques">
              <p>Question No. {currentQuestionIndex + 1}</p>
            </div>
            <div className="section-marks">
              <div className="correct">
                <p>Correct</p>
                <p>+{currentTest.marksCorrect}</p>
              </div>
              <div className="incorrect">
                <p>Incorrect</p>
                <p>-{currentTest.marksWrong}</p>
              </div>
            </div>
          </div>

          <div className="test-question">
            <div className="question">
              <p>{question.questionText}</p>
            </div>
            <div className="test-options">
              {question.options.map((option, idx) => (
                <div key={idx}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={selected === option}
                      onChange={handleOptionChange}
                    />
                    <span>{option}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="test-submit">
          <div className="test-save">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous Question
            </button>
            <button
              onClick={handleNext}
              disabled={
                currentQuestionIndex === currentTest.questions.length - 1
              }
            >
              Save & Next
            </button>
          </div>
          <div className="test-save">
            <button
              className="submit-btn btn btn-success"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      <div
        className="modal fade"
        id="pauseConfirmModal"
        tabIndex="-1"
        aria-labelledby="pauseConfirmModalLabel"
        aria-hidden="true"
        ref={pauseModalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-dark text-dark">
              <h5
                className="modal-title text-white"
                id="pauseConfirmModalLabel"
              >
                Pause Test?
              </h5>
              <button
                type="button"
                className="btn-close"
                style={{ filter: "invert(1)", opacity: 1 }}
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              Are you sure you want to pause the test? Timer will stop and
              questions will be hidden.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => {
                  setIsPaused(true);
                  pauseModalInstanceRef.current?.hide();
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  }
                }}
              >
                Yes, Pause
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Test;
