import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { resetPassword } from "../actions/userActions";
import { CLEAR_ERRORS } from "../constants/userConstants";
import MetaData from "./layouts/MetaData";
import { toast } from "react-toastify";

const NewPassword = () => {
  const dispatch = useDispatch();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, success, error } = useSelector((state) => state.resetPassword);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!"); // ❌ toast for mismatch
      return;
    }

    dispatch(resetPassword(token, { password, confirmPassword }));
  };

  useEffect(() => {
    if (success) {
      toast.success("Password updated successfully! 🎉");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS });
      }, 3000);
    }

    if (error) {
      toast.error(error); // ❌ toast for error
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS });
      }, 3000);
    }
  }, [success, error, dispatch]);

  return (
    <Fragment>
      <MetaData title={"Reset Password"} />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow">
              <h2 className="text-center">Reset Password</h2>

              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Reset Password"}
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

export default NewPassword;
