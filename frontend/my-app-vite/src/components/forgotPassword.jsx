import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../actions/userActions";
import { CLEAR_ERRORS } from "../constants/userConstants";
import MetaData from "./layouts/MetaData";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { loading, message, error } = useSelector(
    (state) => state.forgotPassword
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      toast.success(message); // ✅ Success toast
      setEmail("");
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS });
      }, 3000);
    }

    if (error) {
      toast.error(error); // ❌ Error toast
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS });
      }, 3000);
    }
  }, [message, error, dispatch]);

  return (
    <Fragment>
      <MetaData title={"Forgot Password"} />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow">
              <h2 className="text-center">Forgot Password</h2>

              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
