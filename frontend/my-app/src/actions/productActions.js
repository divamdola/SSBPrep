import axiosInstance from "../utils/axiosInstance";
import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    CLEAR_ERRORS,
    TEST_REQUEST,
    TEST_SUCCESS,
    TEST_FAIL,
    TEST_SUBMIT_REQUEST,
    TEST_SUBMIT_SUCCESS,
    TEST_SUBMIT_FAIL,
    TEST_RESULT_REQUEST,
    TEST_RESULT_SUCCESS,
    TEST_RESULT_FAIL,
} from "../constants/productConstants";

export const getProducts = (category) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCTS_REQUEST });

    const { data } = await axiosInstance.get(`/products?category=${category}`);

    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: data.booksByCategory[category] || [],
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response?.data?.message || "Error fetching products",
    });
  }
};

// For Admin: Get all tests (flattened from groupedTests)
export const getAllTestsAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: TEST_REQUEST });

    const { data: testData } = await axiosInstance.get(`/test`); // fetch all, no category filter

    const grouped = testData.groupedTests || {};
    const flattenedTests = Object.values(grouped).flat();

    const { data: attemptsData } = await axiosInstance.get(`/test/my-attempts`);

    dispatch({
      type: TEST_SUCCESS,
      payload: {
        tests: flattenedTests,
        attempts: attemptsData.attempts || [],
      },
    });

  } catch (error) {
    console.error("❌ Admin Test API Error:", error.response?.data || error.message);
    dispatch({
      type: TEST_FAIL,
      payload: error.response?.data?.message || "Error fetching admin tests",
    });
  }
};


// Get All Test
export const getTests = (category) => async (dispatch) => {
  try {
    dispatch({ type: TEST_REQUEST });

    // Fetch tests by category
    const { data: testData } = await axiosInstance.get(`/test?category=${category}`);

    // Fetch user's attempts
    const { data: attemptsData } = await axiosInstance.get(`/test/my-attempts`);

    dispatch({
      type: TEST_SUCCESS,
      payload: {
        tests: testData.tests || [],
        attempts: attemptsData.attempts || [],
      },
    });

  } catch (error) {
    console.error("❌ Test API Error:", error.response?.data || error.message);
    dispatch({
      type: TEST_FAIL,
      payload: error.response?.data?.message || "Error fetching tests",
    });
  }
};


//Submit Test
export const submitTest = (testData) => async (dispatch) => {
  try {
    dispatch({ type: TEST_SUBMIT_REQUEST });

    const { data } = await axiosInstance.post(`/test/submit/${testData.testId}`, testData);

    dispatch({
      type: TEST_SUBMIT_SUCCESS,
      payload: data.attempt,// assuming response is { attempt: {...} }
    });
  } catch (error) {
    dispatch({
      type: TEST_SUBMIT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


//Get Result
export const getResult = (testId) => async (dispatch) => {
  try {
    dispatch({ type: TEST_RESULT_REQUEST });

    const { data } = await axiosInstance.get(`/test/result/${testId}`);

    dispatch({
      type: TEST_RESULT_SUCCESS,
      payload: data.result,
    });
  } catch (error) {
    dispatch({
      type: TEST_RESULT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    });
};
