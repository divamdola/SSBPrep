import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
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
