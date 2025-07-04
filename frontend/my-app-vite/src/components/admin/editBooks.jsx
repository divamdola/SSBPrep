import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import {
  updateProduct,
  addProduct,
  deleteProduct,
} from "../../actions/adminActions";
import { UPDATE_PRODUCT_RESET } from "../../constants/adminConstants";
import { clearError } from "../../actions/userActions";
import MetaData from "../layouts/MetaData";

const EditBooks = () => {
  const dispatch = useDispatch();

  const [booksByCategory, setBooksByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", url: "", pdfUrl: "" });

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    pdfUrl: "",
    exam: "",
    examName: "",
    price: "",
    rating: "",
    checked: false,
  });

  const { error, updateSuccess, loading: updateLoading } = useSelector((state) => state.admin);

  const refetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/products");
      if (data.success) {
        setBooksByCategory(data.booksByCategory);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchBooks();
  }, []);

  const handleEditClick = (book) => {
    setEditingBook(book._id);
    setEditForm({
      title: book.title,
      url: book.images?.[0]?.url || "",
      pdfUrl: book.images?.[0]?.pdfUrl || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = (bookId) => {
    const updatedBook = {
      title: editForm.title,
      images: [{ url: editForm.url, pdfUrl: editForm.pdfUrl }],
    };

    setBooksByCategory((prev) => {
      const updated = { ...prev };
      for (const category in updated) {
        updated[category] = updated[category].map((book) =>
          book._id === bookId ? { ...book, ...updatedBook } : book
        );
      }
      return updated;
    });

    setEditingBook(null);
    dispatch(updateProduct(bookId, updatedBook));
  };

  useEffect(() => {
    if (updateSuccess) {
      setMessage("Book updated successfully ✅");
      refetchBooks();
      setTimeout(() => setMessage(""), 3000);
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [updateSuccess, dispatch]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "exam") {
      const nameMap = {
        NDA: "National Defence Academy Examination",
        CDS: "Combined Defence Services Examination",
        SSB: "Services Selection Board(SSB)",
      };
      setForm((prev) => ({
        ...prev,
        exam: value,
        examName: nameMap[value] || "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      ratings: Number(form.rating),
      examName: form.examName,
      category: form.exam,
      type: "Book",
      images: [
        {
          url: form.imageUrl,
          pdfUrl: form.pdfUrl,
        },
      ],
    };

    await dispatch(addProduct(productData));
    refetchBooks();

    setForm({
      title: "",
      description: "",
      imageUrl: "",
      pdfUrl: "",
      exam: "",
      examName: "",
      price: "",
      rating: "",
      checked: false,
    });

    setMessage("Book added successfully ✅");
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearError());
      }, 3000);
    }
  }, [error, dispatch]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await dispatch(deleteProduct(productId));
      refetchBooks();
      setMessage("Book deleted successfully ✅");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const examFullNames = {
    NDA: "National Defence Academy Examination",
    CDS: "Combined Defence Services Examination",
    SSB: "Services Selection Board (SSB)",
  };

  return (
    <Fragment>
        <MetaData title={"Edit Books - Admin"} />
      <div className="container-fluid px-0 mt-4">
        {message && <p className="alert alert-success">{message}</p>}
        {error && <p className="text-danger">Error: {error}</p>}

        {loading ? (
          <p>Loading books...</p>
        ) : Object.keys(booksByCategory).length > 0 ? (
          Object.entries(booksByCategory).map(([category, books], index) => (
            <div
              key={category}
              className={`mb-5 p-4 rounded ${index % 2 !== 0 ? "bg-light" : "bg-white"}`}
            >
              <h4 className="mt-5 fs-2 text-center h3-exam">
                {examFullNames[category] || category}
              </h4>
              <div className="d-flex flex-wrap gap-5 mt-4 px-5">
                {books.map((book) => {
                  const isEditing = editingBook === book._id;

                  return (
                    <div
                      className={`card d-flex flex-column ${isEditing ? "border-warning" : ""}`}
                      style={{ width: "16rem", minHeight: "100%" }}
                      key={book._id}
                    >
                      <img
                        src={book.images?.[0]?.url || "/default.jpg"}
                        className="card-img-top"
                        alt={book.title}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        {isEditing ? (
                          <>
                            <label className="form-label fw-bold">Title</label>
                            <input
                              type="text"
                              name="title"
                              value={editForm.title}
                              onChange={handleEditChange}
                              className="form-control mb-2"
                            />
                            <label className="form-label fw-bold">Image URL</label>
                            <input
                              type="text"
                              name="url"
                              value={editForm.url}
                              onChange={handleEditChange}
                              className="form-control mb-2"
                            />
                            <label className="form-label fw-bold">PDF URL</label>
                            <input
                              type="text"
                              name="pdfUrl"
                              value={editForm.pdfUrl}
                              onChange={handleEditChange}
                              className="form-control mb-2"
                            />
                            <div className="d-flex justify-content-between mt-auto">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleSave(book._id)}
                                disabled={updateLoading}
                              >
                                {updateLoading ? "Saving..." : "Save"}
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setEditingBook(null)}
                                disabled={updateLoading}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <h5 className="card-title">{book.title}</h5>
                            <p className="card-text">{book.author}</p>
                            <div className="d-flex mt-auto">
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleEditClick(book)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm ms-auto"
                                onClick={() => handleDelete(book._id)}
                                disabled={updateLoading}
                              >
                                {updateLoading ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>

      <div className="container bg-body-tertiary p-4 rounded-top">
        <h2 className="text-dark-emphasis m-4">Add Book</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label
              htmlFor="title"
              className="form-label text-secondary-emphasis fw-semibold"
            >
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="col-6">
            <label
              htmlFor="description"
              className="form-label text-secondary-emphasis fw-semibold"
            >
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label
              htmlFor="imageUrl"
              className="form-label text-secondary-emphasis fw-semibold"
            >
              Image URL
            </label>
            <input
              type="text"
              className="form-control"
              id="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label
              htmlFor="pdfUrl"
              className="form-label text-secondary-emphasis fw-semibold"
            >
              PDF URL
            </label>
            <input
              type="text"
              className="form-control"
              id="pdfUrl"
              value={form.pdfUrl}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            <label
              htmlFor="exam"
              className="form-label text-secondary-emphasis fw-semibold"
            >
              Exam
            </label>
            <select
              id="exam"
              className="form-select text-secondary-emphasis fw-semibold"
              value={form.exam}
              onChange={handleChange}
            >
              <option value="">Choose...</option>
              <option value="NDA">NDA</option>
              <option value="CDS">CDS</option>
              <option value="SSB">SSB</option>
            </select>
          </div>

          <div className="col-md-4">
            <label
              htmlFor="examName"
              className="form-label text-secondary-emphasis fw-semibold"
            >
              Exam Name
            </label>
            <input
              type="text"
              className="form-control"
              id="examName"
              value={form.examName}
              disabled
            />
          </div>

          <div className="col-md-2">
            <label
              htmlFor="price"
              className="form-label text-secondary-emphasis fw-semibold"
            >
              Price
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-2">
            <label
              htmlFor="rating"
              className="form-label text-secondary-emphasis fw-semibold"
            >
              Ratings
            </label>
            <input
              type="number"
              className="form-control"
              id="rating"
              value={form.rating}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="checked"
                checked={form.checked}
                onChange={handleChange}
              />
              <label
                className="form-check-label text-secondary-emphasis fw-semibold"
                htmlFor="checked"
              >
                Check me out
              </label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default EditBooks; 