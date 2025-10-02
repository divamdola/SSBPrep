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
              // Find the attempt record for this specific test from the Redux store.
              const attemptedTest = attempts?.find(
                (a) => a.test?.toString() === test._id
              );

              // Determine if the test is paused based *only* on the attempt record.
              const isPausedTest = attemptedTest && attemptedTest.paused;

              return (
                <div className="mock-container" key={test._id}>
                  <p>{test.title}</p>
                  {attemptedTest && (
                    <div className="test-score">
                      <p style={{ marginBottom: "8px" }}>
                        Score:{" "}
                        <span className="score-value">
                          {/* Show 'In Progress' for paused tests */}
                          {isPausedTest
                            ? "In Progress"
                            : formatScore(attemptedTest.score)}
                        </span>
                      </p>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      // Ensure fullscreen before navigation on larger screens
                      if (
                        window.innerWidth > 768 &&
                        document.documentElement.requestFullscreen &&
                        !document.fullscreenElement
                      ) {
                        try {
                          await document.documentElement.requestFullscreen();
                        } catch (e) {
                          // User canceled fullscreen request
                        }
                      }

                      // If test is completed (attempt exists and is not paused), go to result.
                      if (attemptedTest && !attemptedTest.paused) {
                        navigate(
                          `/${selectedExam}/${selectedMockTest}/test/result/${attemptedTest.test}`
                        );
                      } else {
                        // Otherwise, go to the test page.
                        // isResume will be true if the test was found and is paused.
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