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

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axiosInstance.post(
      `/test/submit/${testData.testId}`,
      {
        answers: testData.answers,
        timeTaken: testData.timeTaken
      },
      config
    );

    dispatch({
      type: TEST_SUBMIT_SUCCESS,
      payload: data
    });

    return { success: true, attempt: data.attempt };

  } catch (error) {
    console.error("Submit Test Error:", error.response?.data || error);
    dispatch({
      type: TEST_SUBMIT_FAIL,
      payload: error.response?.data?.message || "Failed to submit test"
    });
    throw error;
  }
};


//Get Result
export const getResult = (testId) => async (dispatch) => {
  try {
    dispatch({ type: TEST_RESULT_REQUEST });

    const { data } = await axiosInstance.get(`/test/result/${testId}`);
    
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch result");
    }

    dispatch({
      type: TEST_RESULT_SUCCESS,
      payload: {
        result: data.result,
        stats: data.stats
      }
    });

    return { success: true, result: data.result };

  } catch (error) {
    console.error("Get Result Error:", error.response?.data || error);
    dispatch({
      type: TEST_RESULT_FAIL,
      payload: error.response?.data?.message || "Failed to fetch result"
    });
    throw error;
  }
};

exports.pauseTest = async (req, res) => {
  try {
    const { testId, timeLeft, answers, currentQuestionIndex } = req.body;
    const userId = req.user._id;

    // ✅ Use findOneAndUpdate with upsert
    const attempt = await TestAttempt.findOneAndUpdate(
      { test: testId, user: userId },
      {
        $set: {
          answers,
          timeLeft,
          currentQuestionIndex,
          paused: true, // ✅ ensure it's stored
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const resumeTest = (testId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post("/test/resume", { testId });
    return { success: true, attempt: data.attempt };
  } catch (error) {
    console.error("Resume Test Error:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Failed to resume test" };
  }
};


// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    });
}; 