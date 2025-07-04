import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Papa from "papaparse";
import { addTest } from "../../../actions/adminActions";
import { getAllTestsAdmin } from "../../../actions/productActions";
// assumed action

const UploadCSVTest = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file || !category) {
      alert("Please select a category and choose a CSV file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsedData = results.data;
        const testData = transformCSVToTest(parsedData, category);
        if (testData) {
          dispatch(addTest(testData)).then(() => {
            alert("Test added from CSV successfully!");
            dispatch(getAllTestsAdmin()); // Re-fetch updated test list
            setFile(null); // reset state
            setCategory("");
          });
        } else {
          alert("Invalid CSV format.");
        }
      },
    });
  };

  const transformCSVToTest = (rows, selectedCategory) => {
    if (rows.length === 0) return null;

    const firstRow = rows[0];
    const commonFields = {
      title: firstRow.title,
      category: selectedCategory,
      typeOfTest: firstRow.typeOfTest,
      timeDuration: Number(firstRow.timeDuration),
      marksCorrect: Number(firstRow.marksCorrect),
      marksWrong: Number(firstRow.marksWrong),
    };

    const questions = rows.map((row) => ({
      questionText: row.questionText,
      options: [row.option1, row.option2, row.option3, row.option4],
      answer: row.answer,
    }));

    return { ...commonFields, questions };
  };

  return (
    <div className="my-4">
      <h2 className="text-dark-emphasis mt-5">Add Test</h2>
      <div className="row">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Select Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            <option value="NDA">NDA</option>
            <option value="CDS">CDS</option>
            <option value="AFCAT">AFCAT</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Upload Test via CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Upload Test
      </button>
    </div>
  );
};

export default UploadCSVTest; 