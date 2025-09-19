import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "./layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../actions/userActions";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Registration successful! 🎉 Redirecting...");
      setTimeout(() => navigate("/"), 2000); // Redirect after 2s
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, isAuthenticated, error, navigate]);

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.warning("Please accept the terms & conditions.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    dispatch(register(formData));
  };

  return (
    <Fragment>
      <MetaData title={"Register User"} />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow">
              <h2 className="text-center">Registration</h2>

              <form
                className="form-signup"
                onSubmit={submitHandler}
                encType="multipart/form-data"
              >
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={termsAccepted}
                    onChange={handleCheckboxChange}
                    id="termsCheckbox"
                  />
                  <label className="form-check-label" htmlFor="termsCheckbox">
                    I accept all terms & conditions
                  </label>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Register Now
                  </button>
                </div>
                <div className="text-center mt-3">
                  <p>
                    Already have an account?{" "}
                    <Link to={"/login"}>Login now</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Signup;
