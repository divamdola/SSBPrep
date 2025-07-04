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

export const testReducer = (
  state = { loading: false, tests: [], results: [], attempts: [], error: null },
  action
) => {
  switch (action.type) {
    case TEST_REQUEST:
    case TEST_SUBMIT_REQUEST:
    case TEST_RESULT_REQUEST:
      return { ...state, loading: true };

    case TEST_SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        results: action.payload,  // might be just one result
        error: null,
      };
    
    case TEST_RESULT_SUCCESS:
      return{
        ...state,
        loading:false,
        results:action.payload,
        error:null
      };

    case TEST_SUCCESS:
      return {
        ...state,
        loading: false,
        tests: Array.isArray(action.payload.tests) ? action.payload.tests : [],
        attempts: action.payload.attempts || [],
        error: null,
      };
    
    case TEST_FAIL:
    case TEST_SUBMIT_FAIL:
    case TEST_RESULT_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
}; 