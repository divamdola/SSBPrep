import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MetaData from "./layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../actions/userActions";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success("Login successful! 🎉");

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin-panel");
        } else {
          navigate("/");
        }
      }, 1500); // small delay before redirect
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, isAuthenticated, error, navigate, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Fragment>
      <MetaData title={"User Login"} />
      <div className="body-login">
        <div className="background-login">
          <div className="img-login">
            <img src="/images/login.svg" alt="login" />
          </div>
          <div className="login">
            <div className="container-login">
              <div className="logo-login">
                <img src="/images/logo.svg" alt="logo" className="icon" />
              </div>
              <h1>Login / Register</h1>
              <div className="data-login">
                <form onSubmit={submitHandler}>
                  <div className="email-login">
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="password-login">
                    <input
                      type="password"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Link to={"/forgot-password"}>
                    <div className="forgot-pass">Forgot Password?</div>
                  </Link>
                  <div className="submit-login">
                    <button type="submit">Login</button>
                  </div>
                  <div className="signup">
                    If not registered, please{" "}
                    <Link to={"/signup"}>Signup</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
