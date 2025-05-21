import axiosInstance from "../utils/axiosInstance";
import { persistor } from "../store";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CLEAR_ERRORS,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL,
} from "../constants/userConstants";

// Register User
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axiosInstance.post("/register", userData, config);

    localStorage.setItem("token", data.token);

    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {
    console.error("Registration error:", error);
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response?.data?.message || "Registration failed. Please try again.",
    });
  }
};

// Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axiosInstance.post("/login", { email, password }, config);

    localStorage.setItem("token", data.token);

    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.response?.data?.message || "Invalid credentials" });
  }
};


// Logout User
export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.post("/logout");

    dispatch({ type: LOGOUT_SUCCESS });

    await persistor.flush();
    persistor.purge();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response?.data?.message || "Logout failed",
    });
  }
};


// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token found");

    const { data } = await axiosInstance.get("/me");

    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    console.error("❌ Load User Failed:", error.response?.data);
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response?.data?.message || "Failed to load user",
    });
  }
};


//Forgot Password
export const forgotPassword = (email)=>async(dispatch)=>{
  try{
    dispatch({type:FORGOT_PASSWORD_REQUEST})

    const config={
      headers:{
        'Content-Type':'application/json'
      }
    }
    const { data } = await axiosInstance.post("/password/forgot", {email}, config);
    dispatch({
      type:FORGOT_PASSWORD_SUCCESS,
      payload:data.message
    })
  }catch(error){
    dispatch({
      type:FORGOT_PASSWORD_FAIL,
      payload:error.response.data.message
    })
  }
}

//Reset Password
export const resetPassword = (token,passwords)=>async(dispatch)=>{
  try{
    dispatch({type:NEW_PASSWORD_REQUEST})

    const config={
      headers:{
        'Content-Type':'application/json'
      }
    }
    const { data } = await axiosInstance.put(`/password/reset/${token}`, passwords, config);
    dispatch({
      type:NEW_PASSWORD_SUCCESS,
      payload:data.success
    })
  }catch(error){
    dispatch({
      type:NEW_PASSWORD_FAIL,
      payload:error.response.data.message
    })
  }
}

// Clear Errors
export const clearError = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
