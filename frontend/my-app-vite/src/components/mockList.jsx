import React, { Fragment, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTests } from "../actions/productActions";
import MetaData from "./layouts/MetaData";

const MockList = () => {
  const location = useLocation();
  const { exam, mockTest } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedExam = location.state?.selectedExam || exam;
  const selectedMockTest = location.state?.selectedMockTest || mockTest;

  const { tests, attempts, loading, error } = useSelector(
    (state) => state.tests
  );

  const pausedTest = JSON.parse(localStorage.getItem("pausedTest"));

  useEffect(() => {
    if (selectedExam) {
      dispatch(getTests(selectedExam));
    }
  }, [dispatch, selectedExam]);

  const formatScore = (score) => {
    return Number(score || 0).toFixed(2);
  };

  return (
    <Fragment>
      <MetaData title={`${selectedExam}`} />
      <div className="head-home mock-test">
        <h1>
          {selectedMockTest?.toLowerCase() === "dpp"
            ? `${selectedExam} - Daily Practice Papers`
            : `${selectedExam} - Full Mock Tests`}
        </h1>
      </div>

      {loading ? (
        <p>Loading tests...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="mocks">
          {tests.length > 0 ? (
            tests.map((test) => {
              const isPausedTest =
                (pausedTest?.testId === test._id &&
                  pausedTest?.exam === selectedExam &&
                  pausedTest?.mockTest === selectedMockTest) ||
                attempts?.some(
                  (a) => a.test?.toString() === test._id && a.paused
                );

              const attemptedTest = attempts?.find(
                (a) => a.test?.toString() === test._id
              );

              return (
                <div className="mock-container" key={test._id}>
                  <p>{test.title}</p>
                  {attemptedTest && (
                    <div className="test-score">
                      <p style={{ marginBottom: "8px" }}>
                        Score:{" "}
                        <span className="score-value">
                          {formatScore(attemptedTest.score)}
                        </span>
                      </p>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (isPausedTest) {
                        localStorage.removeItem("pausedTest"); // clear stale paused test
                      }

                      // Ensure fullscreen before navigation
                      if (
                        window.innerWidth > 768 &&
                        document.documentElement.requestFullscreen &&
                        !document.fullscreenElement
                      ) {
                        try {
                          await document.documentElement.requestFullscreen();
                        } catch (e) {
                          // user canceled
                        }
                      }

                      if (attemptedTest && !attemptedTest.paused) {
                        navigate(
                          `/${selectedExam}/${selectedMockTest}/test/result/${attemptedTest.test}`
                        );
                      } else {
                        navigate(
                          `/${selectedExam}/${selectedMockTest}/test/${test._id}`,
                          {
                            state: {
                              selectedExam,
                              selectedMockTest,
                              isResume: isPausedTest,
                            },
                          }
                        );
                      }
                    }}
                  >
                    {attemptedTest && !attemptedTest.paused
                      ? "View Result"
                      : isPausedTest
                      ? "Resume Test"
                      : "Start Test"}
                  </button>
                </div>
              );
            })
          ) : (
            <p>No tests found for this exam.</p>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default MockList;
