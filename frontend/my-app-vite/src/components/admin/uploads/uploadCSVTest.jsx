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
      complete: async function (results) {
        const parsedData = results.data;
        
        // Validate CSV structure
        const requiredColumns = ['title', 'typeOfTest', 'timeDuration', 'marksCorrect', 'marksWrong', 
                               'questionText', 'option1', 'option2', 'option3', 'option4', 'answer'];
        const missingColumns = requiredColumns.filter(col => !results.meta.fields.includes(col));
        
        if (missingColumns.length > 0) {
          alert(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        const testData = transformCSVToTest(parsedData, category);
    
        if (!testData || testData.questions.length === 0) {
          alert("Invalid CSV format or no questions found.");
          return;
        }

        // Validate test data
        if (testData.timeDuration < 1) {
          alert("Time duration must be at least 1 minute");
          return;
        }
        if (testData.marksCorrect < 1) {
          alert("Marks for correct answer must be at least 1");
          return;
        }
        if (testData.marksWrong < 0) {
          alert("Negative marks cannot be less than 0");
          return;
        }

        // Validate questions
        const invalidQuestions = [];
        testData.questions.forEach((q, index) => {
          const rowNumber = index + 1;
          if (q.options.length !== 4) {
            invalidQuestions.push({
              rowNumber,
              questionText: q.questionText,
              error: `Question has ${q.options.length} options instead of 4`,
              options: q.options
            });
          } else if (!q.options.includes(q.answer)) {
            invalidQuestions.push({
              rowNumber,
              questionText: q.questionText,
              error: "Answer doesn't match any option",
              answer: q.answer,
              options: q.options
            });
          }
        });

        if (invalidQuestions.length > 0) {
          console.log("Invalid questions details:", invalidQuestions);
          let errorMessage = `Found ${invalidQuestions.length} invalid questions:\n\n`;
          invalidQuestions.forEach(q => {
            errorMessage += `Row ${q.rowNumber}: "${q.questionText.substring(0, 50)}..."\n`;
            errorMessage += `Error: ${q.error}\n`;
            if (q.options) errorMessage += `Options: ${q.options.join(", ")}\n`;
            if (q.answer) errorMessage += `Answer: ${q.answer}\n`;
            errorMessage += "\n";
          });
          alert(errorMessage);
          return;
        }
    
        try {
          const response = await dispatch(addTest(testData));
          if (response && response.success) {
            alert("Test added from CSV successfully!");
            dispatch(getAllTestsAdmin());
            setFile(null);
            setCategory("");
          } else {
            alert("Failed to add test. Please check the console for details.");
          }
        } catch (error) {
          alert(`Upload failed: ${error.message || 'Unknown error occurred'}`);
          console.error("Upload error:", error);
        }
      },
      error: function(error) {
        alert(`Error parsing CSV file: ${error}`);
      }
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