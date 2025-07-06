import React, { useEffect } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getResult } from "../actions/productActions";
import MetaData from "./layouts/MetaData";

const Result = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: testId, exam, mockTest } = useParams();

  const { results, tests, stats, loading, error } = useSelector((state) => state.tests);

  const testFromList = tests?.find((t) => t._id === testId);
  const testTitle = testFromList?.title || results?.test?.title || "Test Name";

  useEffect(() => {
    if (testId) {
      dispatch(getResult(testId));
    }
  }, [dispatch, testId]);

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const formatScore = (score) => {
    return Number(score || 0).toFixed(2);
  };

  const totalAttempted = results?.correctAnswers + results?.wrongAnswers;
  const accuracy =
    totalAttempted > 0
      ? ((results?.correctAnswers / totalAttempted) * 100).toFixed(2)
      : "0.00";

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate(`/${exam}/${mockTest}`)}>
          Go Back to Tests
        </button>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="error-container">
        <h2>No Results Found</h2>
        <p>The test results could not be found. Please try again.</p>
        <button className="btn btn-primary" onClick={() => navigate(`/${exam}/${mockTest}`)}>
          Go Back to Tests
        </button>
      </div>
    );
  }

  return (
    <Fragment>
      <MetaData title={`${testTitle} - Result`} />
      <div className="result-head">
        <div className="result-logo">
          <img src="/images/logo.svg" alt="logo" />
          <p className="test-name">{testTitle}</p>
        </div>
        <div className="question-sol">
          <button
            className="btn btn-light"
            onClick={() => navigate(`/${exam}/${mockTest}`)}
          >
            Go to Tests
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/test/solutions/${results?.test?._id}`)}
          >
            Solutions
          </button>
        </div>
      </div>

      <div className="result-container">
        <div className="overall-performance">
          <p className="result-heading">Overall Performance</p>
          <div className="performance text-bg-light">
            <div className="con">
              <div className="performance-img">
                <img src="/images/rank.svg" alt="rank" />
              </div>
              <div>
                <p>{stats?.userRank || '--'}/{stats?.totalAttempts || '--'}</p>
                <p className="para-text">Rank</p>
              </div>
            </div>
            <div className="con">
              <div className="performance-img">
                <img src="/images/score.svg" alt="Score" />
              </div>
              <div>
                <p>{formatScore(results?.score)}</p>
                <p className="para-text">Score</p>
              </div>
            </div>
            <div className="con">
              <div className="performance-img">
                <img src="/images/attempted.svg" alt="Attempted Question" />
              </div>
              <div>
                <p>{totalAttempted || 0}</p>
                <p className="para-text">Attempted</p>
              </div>
            </div>
            <div className="con">
              <div className="performance-img">
                <img src="/images/accuracy.svg" alt="Accuracy" />
              </div>
              <div>
                <p>{accuracy}%</p>
                <p className="para-text">Accuracy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="summary">
          <p className="result-heading">Summary</p>
          <div className="table">
            <table className="text-bg-light">
              <thead>
                <tr>
                  <th></th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                  <th>Score</th>
                  <th>Cut-off</th>
                  <th>Time Taken</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>You</th>
                  <td>{results?.correctAnswers || 0}</td>
                  <td>{results?.wrongAnswers || 0}</td>
                  <td>{formatScore(results?.score)}</td>
                  <td>100</td>
                  <td>{formatTime(results?.timeTaken)}</td>
                </tr>
                <tr>
                  <th>Average</th>
                  <td>{stats?.average?.correctAnswers || '--'}</td>
                  <td>{stats?.average?.wrongAnswers || '--'}</td>
                  <td>{formatScore(stats?.average?.score)}</td>
                  <td>100</td>
                  <td>{formatTime(stats?.average?.timeTaken)}</td>
                </tr>
                <tr>
                  <th>Topper</th>
                  <td>{stats?.topper?.correctAnswers || '--'}</td>
                  <td>{stats?.topper?.wrongAnswers || '--'}</td>
                  <td>{formatScore(stats?.topper?.score)}</td>
                  <td>100</td>
                  <td>{formatTime(stats?.topper?.timeTaken)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Result; 