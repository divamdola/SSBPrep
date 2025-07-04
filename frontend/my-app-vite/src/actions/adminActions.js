import axiosInstance from "../utils/axiosInstance";
import {
  ALL_USER_REQUEST,
  ALL_USER_SUCCESS,
  ALL_USER_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_FAIL,
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_TEST_REQUEST,
  UPDATE_TEST_SUCCESS,
  UPDATE_TEST_FAIL,
  DELETE_TEST_REQUEST,
  DELETE_TEST_SUCCESS,
  DELETE_TEST_FAIL,
} from "../constants/adminConstants";

import {TEST_REQUEST, TEST_SUCCESS, TEST_FAIL} from "../constants/productConstants";

//Load All Users
export const loadAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USER_REQUEST });
    const { data } = await axiosInstance.get("/admin/users");
    dispatch({ type: ALL_USER_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({
      type: ALL_USER_FAIL,
      payload: error.response?.data?.message || "Error fetching users",
    });
  }
};

//Add Product (Books)
export const addProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PRODUCT_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post(
      "/admin/product/new",
      productData,
      config
    );
    dispatch({ type: ADD_PRODUCT_SUCCESS, payload: data.product });
  } catch (error) {
    dispatch({
      type: ADD_PRODUCT_FAIL,
      payload: error.response?.data?.message || "Error adding Books",
    });
  }
};

//Update User Role
export const updateUserRole = (userId, role) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const { data } = await axiosInstance.put(`/admin/user/${userId}`, { role });

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response?.data?.message || "Error updating user role",
    });
  }
};

//Delete User
export const deleteUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    await axiosInstance.delete(`/admin/user/${userId}`);

    dispatch(loadAllUsers());
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response?.data?.message || "Error deleting user",
    });
  }
};

//Delete Product
export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    await axiosInstance.delete(`/admin/product/${productId}`);

    dispatch({ type: DELETE_PRODUCT_SUCCESS });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response?.data?.message || "Error deleting product",
    });
  }
};

//Update Product
export const updateProduct = (productId, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axiosInstance.put(
      `/admin/product/${productId}`,
      productData,
      config
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response?.data?.message || "Error updating product",
    });
  }
};

//Update Test
export const updateTest = (testId, testData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TEST_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axiosInstance.put(
      `/admin/test/${testId}`,
      testData,
      config
    );

    dispatch({
      type: UPDATE_TEST_SUCCESS,
      payload: data.test,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TEST_FAIL,
      payload: error.response?.data?.message || "Error updating test",
    });
  }
};

//Delete Test
export const deleteTest = (testId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TEST_REQUEST });

    await axiosInstance.delete(`/admin/test/${testId}`);

    dispatch({ type: DELETE_TEST_SUCCESS });
  } catch (error) {
    dispatch({
      type: DELETE_TEST_FAIL,
      payload: error.response?.data?.message || "Error deleting test",
    });
  }
};

//Add Test
export const addTest = (testData) => async (dispatch) => {
  try {
    dispatch({ type: TEST_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axiosInstance.post(
      "/admin/test/new",
      testData,
      config
    );

    dispatch({ type: TEST_SUCCESS, payload: data.test });
  } catch (error) {
    dispatch({
      type: TEST_FAIL,
      payload: error.response?.data?.message || "Error adding test",
    });
  }
}; 