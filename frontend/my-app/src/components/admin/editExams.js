import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTestsAdmin } from "../../actions/productActions";
import { updateTest } from "../../actions/adminActions";

const EditExams = () => {
  const dispatch = useDispatch();
  const { loading, tests, error } = useSelector((state) => state.tests);

  const [selectedTestId, setSelectedTestId] = useState(null);
  const [form, setForm] = useState({});
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  useEffect(() => {
    dispatch(getAllTestsAdmin());
  }, [dispatch]);

  const [questionNumberInput, setQuestionNumberInput] = useState("1");
  useEffect(() => {
    if (form.questions) {
      setQuestionNumberInput(String(selectedQuestionIndex + 1));
    }
  }, [selectedQuestionIndex, form.questions]);

  const testArray = Array.isArray(tests) ? tests : [];

  const handleEditClick = (test) => {
    setSelectedTestId(test._id);
    setForm({
      title: test.title,
      category: test.category,
      typeOfTest: test.typeOfTest,
      timeDuration: test.timeDuration,
      correctMarks: test.marksCorrect,
      incorrectMarks: test.marksWrong,
      questions: test.questions,
    });
    setSelectedQuestionIndex(0);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id.startsWith("option")) {
      const index = parseInt(id.replace("option", "")) - 1;
      const updatedOptions = [...form.questions[selectedQuestionIndex].options];
      updatedOptions[index] = value;
      updateQuestionField("options", updatedOptions);
    } else if (["questionText", "answer"].includes(id)) {
      updateQuestionField(id, value);
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const updateQuestionField = (field, value) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[selectedQuestionIndex] = {
      ...updatedQuestions[selectedQuestionIndex],
      [field]: value,
    };
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTestId) return;

    dispatch(updateTest(selectedTestId, form));
    alert("Test updated successfully.");

    // Hide the form
    setSelectedTestId(null);
    setForm({});
    setSelectedQuestionIndex(0);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="edit-exams container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Category</th>
            <th>Type of Test</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {testArray.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No tests available.
              </td>
            </tr>
          ) : (
            testArray.map((test, index) => (
              <tr key={test._id}>
                <th scope="row">{index + 1}</th>
                <td>{test.title}</td>
                <td>{test.category}</td>
                <td>{test.typeOfTest}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => handleEditClick(test)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Form */}
      {selectedTestId && form.questions && (
        <form className="row g-3 mt-4" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="title" className="form-label fw-semibold">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="category" className="form-label fw-semibold">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={form.category}
              onChange={handleChange}
              className="form-control"
              disabled
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="typeOfTest" className="form-label fw-semibold">
              Type of Test
            </label>
            <select
              id="typeOfTest"
              value={form.typeOfTest}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Type</option>
              <option value="Full Mock Test">Full Mock Test</option>
              <option value="Daily Practice Paper (DPP)">
                Daily Practice Paper (DPP)
              </option>
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="timeDuration" className="form-label fw-semibold">
              Time Duration (minutes)
            </label>
            <input
              type="number"
              id="timeDuration"
              value={form.timeDuration}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="correctMarks" className="form-label fw-semibold">
              Correct Marks
            </label>
            <div className="input-group">
              <span
                className="input-group-text fw-bold bg-success text-white"
                id="basic-addon-correct"
              >
                +
              </span>
              <input
                type="number"
                id="correctMarks"
                value={form.correctMarks}
                onChange={handleChange}
                className="form-control"
                aria-describedby="basic-addon-correct"
              />
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="incorrectMarks" className="form-label fw-semibold">
              Incorrect Marks
            </label>
            <div className="input-group">
              <span
                className="input-group-text fw-bold bg-danger text-white"
                id="basic-addon-incorrect"
              >
                -
              </span>
              <input
                type="number"
                id="incorrectMarks"
                value={form.incorrectMarks}
                onChange={handleChange}
                className="form-control"
                aria-describedby="basic-addon-incorrect"
              />
            </div>
          </div>

          {/* Question Selector */}
          <div className="col-md-6">
            <label htmlFor="questionNumber" className="form-label fw-semibold">
              Question No.
            </label>
            <input
              type="number"
              id="questionNumber"
              className="form-control"
              min={1}
              max={form.questions.length}
              value={questionNumberInput}
              onChange={(e) => {
                const val = e.target.value;
                setQuestionNumberInput(val);

                const newIndex = parseInt(val, 10) - 1;
                if (
                  !isNaN(newIndex) &&
                  newIndex >= 0 &&
                  newIndex < form.questions.length
                ) {
                  setSelectedQuestionIndex(newIndex);
                }
              }}
            />
          </div>

          {/* Selected Question */}
          <div className="col-md-6">
            <label htmlFor="questionText" className="form-label fw-semibold">
              Question Text
            </label>
            <input
              type="text"
              id="questionText"
              value={form.questions[selectedQuestionIndex].questionText}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {[1, 2, 3, 4].map((num) => (
            <div className="col-md-6" key={num}>
              <label
                htmlFor={`option${num}`}
                className="form-label fw-semibold"
              >
                Option {num}
              </label>
              <input
                type="text"
                id={`option${num}`}
                value={form.questions[selectedQuestionIndex].options[num - 1]}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          ))}

          <div className="col-md-6">
            <label htmlFor="answer" className="form-label fw-semibold">
              Correct Answer
            </label>
            <input
              type="text"
              id="answer"
              value={form.questions[selectedQuestionIndex].answer}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Update Test
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditExams;
