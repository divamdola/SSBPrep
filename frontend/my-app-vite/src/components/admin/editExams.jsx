import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTestsAdmin } from "../../actions/productActions";
import { updateTest, deleteTest } from "../../actions/adminActions";
import UploadCSVTest from "./uploads/uploadCSVTest";
import { toast } from "react-toastify";

const EditExams = () => {
  const dispatch = useDispatch();
  const { loading, tests, error } = useSelector((state) => state.tests);

  const [selectedTestId, setSelectedTestId] = useState(null);
  const [form, setForm] = useState({});
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [questionNumberInput, setQuestionNumberInput] = useState("1");

  useEffect(() => {
    dispatch(getAllTestsAdmin());
  }, [dispatch]);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        await dispatch(deleteTest(id));
        toast.success("Test deleted successfully ✅");
        dispatch(getAllTestsAdmin());
      } catch (err) {
        toast.error("Failed to delete the test ❌");
      }
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
    toast.success("Test updated successfully ✅");

    setSelectedTestId(null);
    setForm({});
    setSelectedQuestionIndex(0);
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    toast.error(error);
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="edit-exams container mt-5 mb-5">
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
                <td className="d-flex gap-4">
                  <button
                    type="button"
                    className="btn btn-success btn-circle btn-lg btn-circle"
                    onClick={() => handleEditClick(test)}
                  >
                    <img src="/images/edit.svg" alt="edit" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-circle btn-lg btn-circle"
                    onClick={() => handleDelete(test._id)}
                  >
                    <img src="/images/delete.svg" alt="delete" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Form */}
      {selectedTestId && form.questions && (
        <div className="container bg-body-tertiary p-4 rounded-top">
          <form className="row g-3" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="col-md-6">
              <label htmlFor="title" className="form-label text-secondary-emphasis fw-semibold">
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

            {/* Category */}
            <div className="col-md-6">
              <label htmlFor="category" className="form-label text-secondary-emphasis fw-semibold">
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

            {/* Type of Test */}
            <div className="col-md-6">
              <label htmlFor="typeOfTest" className="form-label text-secondary-emphasis fw-semibold">
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
                <option value="Daily Practice Paper (DPP)">Daily Practice Paper (DPP)</option>
              </select>
            </div>

            {/* Time Duration */}
            <div className="col-md-6">
              <label htmlFor="timeDuration" className="form-label text-secondary-emphasis fw-semibold">
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

            {/* Correct Marks */}
            <div className="col-md-6">
              <label htmlFor="correctMarks" className="form-label text-secondary-emphasis fw-semibold">
                Correct Marks
              </label>
              <div className="input-group">
                <span className="input-group-text fw-bold bg-success text-white">+</span>
                <input
                  type="number"
                  id="correctMarks"
                  value={form.correctMarks}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Incorrect Marks */}
            <div className="col-md-6">
              <label htmlFor="incorrectMarks" className="form-label text-secondary-emphasis fw-semibold">
                Incorrect Marks
              </label>
              <div className="input-group">
                <span className="input-group-text fw-bold bg-danger text-white">-</span>
                <input
                  type="number"
                  id="incorrectMarks"
                  value={form.incorrectMarks}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Question No */}
            <div className="col-md-6">
              <label htmlFor="questionNumber" className="form-label text-secondary-emphasis fw-semibold">
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
                  if (!isNaN(newIndex) && newIndex >= 0 && newIndex < form.questions.length) {
                    setSelectedQuestionIndex(newIndex);
                  }
                }}
              />
            </div>

            {/* Question Text */}
            <div className="col-md-6">
              <label htmlFor="questionText" className="form-label text-secondary-emphasis fw-semibold">
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

            {/* Options */}
            {[1, 2, 3, 4].map((num) => (
              <div className="col-md-6" key={num}>
                <label htmlFor={`option${num}`} className="form-label text-secondary-emphasis fw-semibold">
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

            {/* Correct Answer */}
            <div className="col-md-6">
              <label htmlFor="answer" className="form-label text-secondary-emphasis fw-semibold">
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

            <div className="col-12 d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Update Test
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedTestId(null);
                  setForm({});
                  setSelectedQuestionIndex(0);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <UploadCSVTest />
    </div>
  );
};

export default EditExams;
