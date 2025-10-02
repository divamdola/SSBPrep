import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PAUSE_TEST,
  CLEAR_ERRORS,
} from "../constants/productConstants";

const initialState = {
  loading: false,
  products: [],
  error: null,
  productsCount: 0,
};

export const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST:
      return { ...state, loading: true };

      case PAUSE_TEST:
      const updatedAttempt = action.payload;
      const attemptExists = state.attempts.some(
        (a) => a.test?.toString() === updatedAttempt.test?.toString()
      );

      return {
        ...state,
        attempts: attemptExists
          ? // If attempt exists, update it
            state.attempts.map((attempt) =>
              attempt.test?.toString() === updatedAttempt.test?.toString()
                ? updatedAttempt // Replace with the fresh data from the server
                : attempt
            )
          : // Otherwise, add the new paused attempt to the list
            [...state.attempts, updatedAttempt],
      };

    case ALL_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null,
      };

    case ALL_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };


    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
}; 