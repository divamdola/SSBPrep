import {
  TEST_REQUEST,
  TEST_SUCCESS,
  TEST_FAIL,
  TEST_SUBMIT_REQUEST,
  TEST_SUBMIT_SUCCESS,
  TEST_SUBMIT_FAIL,
  TEST_RESULT_REQUEST,
  TEST_RESULT_SUCCESS,
  TEST_RESULT_FAIL,
  CLEAR_ERRORS,
} from "../constants/productConstants";

const initialState = {
  tests: [],
  attempts: [],
  results: null,
  stats: null,
  loading: false,
  error: null,
  submitting: false,
  submitError: null
};

export const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case TEST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case TEST_SUCCESS:
      return {
        ...state,
        loading: false,
        tests: action.payload.tests,
        attempts: action.payload.attempts
      };

    case TEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case TEST_SUBMIT_REQUEST:
      return {
        ...state,
        submitting: true,
        submitError: null
      };

    case TEST_SUBMIT_SUCCESS:
      return {
        ...state,
        submitting: false,
        submitError: null
      };

    case TEST_SUBMIT_FAIL:
      return {
        ...state,
        submitting: false,
        submitError: action.payload
      };

    case TEST_RESULT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case TEST_RESULT_SUCCESS:
      return {
        ...state,
        loading: false,
        results: action.payload.result,
        stats: action.payload.stats
      };

    case TEST_RESULT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        submitError: null
      };

    default:
      return state;
  }
}; 