import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getProducts } from "../actions/productActions";
import { useLocation } from "react-router-dom";
import MetaData from "./layouts/MetaData";

const Exams = () => {
  const location = useLocation();
  const selectedExam = location.state?.selectedExam || "Unknown";
  const dispatch = useDispatch();

  const { products} = useSelector(
    (state) => state.products
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedExam !== "Unknown") {
      dispatch(getProducts());
    }
  }, [dispatch, selectedExam]);

  const handleExamClick = (exam) => {
    navigate(`/${exam}`, {
      state: { selectedExam: exam },
    });
  };

  return (
    <Fragment>
      <MetaData title={"Exams"} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="exam-header">
              <h1>{selectedExam} Exams</h1>
              <p>Choose your exam and start your preparation</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="exam-cards">
              {products &&
                products.map((product) => (
                  <div key={product._id} className="exam-card">
                    <div className="card-header">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                    <div className="card-body">
                      <div className="exam-stats">
                        <div className="stat">
                          <span className="stat-number">{product.numOfTests}</span>
                          <span className="stat-label">Tests</span>
                        </div>
                        <div className="stat">
                          <span className="stat-number">{product.timeDuration}</span>
                          <span className="stat-label">Minutes</span>
                        </div>
                        <div className="stat">
                          <span className="stat-number">{product.questions}</span>
                          <span className="stat-label">Questions</span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleExamClick(product.name)}
                        >
                          Start Exam
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <>
          <div className="roadmap">
            <h1>View Complete Procedure of SSB</h1>
            <div className="button">
              <Link to="/timeline">
                <button>
                  <img src="/images/eye.svg" alt="eye" />
                  View
                </button>
              </Link>
            </div>
          </div>
        </>
      </div>
    </Fragment>
  );
};

export default Exams;
