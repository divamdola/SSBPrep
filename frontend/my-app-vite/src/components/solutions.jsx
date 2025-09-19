import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getResult } from "../actions/productActions";
import MetaData from "./layouts/MetaData";

const Solutions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: testId, exam, mockTest } = useParams();

  const { results, tests } = useSelector((state) => state.tests);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const testFromList = tests?.find((t) => t._id === testId);
  const testTitle = testFromList?.title || results?.test?.title || "Test Solutions";

  useEffect(() => {
    if (testId && !results) {
      dispatch(getResult(testId));
    }
  }, [dispatch, testId, results]);

  if (!results || !results.test) {
    return (
      <div className="loading-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  const questions = results.test.questions;
  const userAnswers = results.answers;

  const getQuestionStatusClass = (idx) => {
    const answer = userAnswers[idx];
    if (!answer || answer.selectedOption === "Not Attempted") return "";
    return answer.isCorrect ? "correct" : "incorrect";
  };

  const getOptionClass = (questionIdx, option) => {
    const answer = userAnswers[questionIdx];
    const correctAnswer = questions[questionIdx].answer;
    
    if (answer.selectedOption === option) {
      // Selected option
      return answer.isCorrect ? "correct-answer" : "wrong-answer";
    } else if (option === correctAnswer) {
      // Correct answer (if not selected)
      return "correct-answer";
    }
    return "";
  };

  return (
    <div className="test-container-fullscreen">
      <MetaData title={`${testTitle} - Solutions`} />
      
      <div className="test-layout">
        {/* Main question area */}
        <div className="question-area">
          <div className="test-content">
            {/* Header */}
            <div className="test-header">
              <div className="header-content">
                <h5 className="question-number">Question {currentQuestionIndex + 1}</h5>
                <div className="header-controls">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/${exam}/${mockTest}/test/result/${testId}`)}
                  >
                    Back to Result
                  </button>
                </div>
              </div>
            </div>

            {/* Question content */}
            <div className="question-container">
              <div className="question-content">
                <div className="question-text" style={{ whiteSpace: 'pre-line' }}>
                  {questions[currentQuestionIndex].questionText.split('\n').map((line, index) => (
                    <p key={index} className={index === 0 ? 'main-question' : 'sub-question'}>
                      {line}
                    </p>
                  ))}
                </div>

                <div className="options-grid">
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <div key={idx} className={`option-item ${getOptionClass(currentQuestionIndex, option)}`}>
                      <input
                        type="radio"
                        name={`question${currentQuestionIndex}`}
                        id={`option${idx}`}
                        value={option}
                        checked={userAnswers[currentQuestionIndex]?.selectedOption === option}
                        disabled
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
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Previous
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <i className="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Question palette */}
        <div className="question-palette-area">
          <div className="palette-content">
            <h5 className="palette-title">Question Palette</h5>
            <div className="palette-legend">
              <div className="legend-item">
                <span className="legend-color correct"></span>
                <span>Correct</span>
              </div>
              <div className="legend-item">
                <span className="legend-color incorrect"></span>
                <span>Incorrect</span>
              </div>
              <div className="legend-item">
                <span className="legend-color"></span>
                <span>Not Attempted</span>
              </div>
            </div>
            <div className="question-grid">
              {questions.map((_, idx) => (
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
    </div>
  );
};

export default Solutions; 