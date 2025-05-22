import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTestsAdmin } from "../../actions/productActions";

const EditExams = () => {
  const dispatch = useDispatch();

  // Destructure from redux state (adjust key if you use different root)
  const { loading, tests, error } = useSelector((state) => state.tests);

  useEffect(() => {
    dispatch(getAllTestsAdmin()); // fetch all tests (pass category if needed)
  }, [dispatch]);
  
const testArray = Array.isArray(tests) ? tests : [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="edit-exams">
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
        <td className="d-flex gap-3">
          <button
            type="button"
            className="btn btn-success btn-circle btn-lg"
          >
            <img src="/images/edit.svg" alt="edit" />
          </button>
          <button
            type="button"
            className="btn btn-danger btn-circle btn-lg"
          >
            <img src="/images/delete.svg" alt="delete" />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
      </table>
    </div>
  );
};

export default EditExams;
