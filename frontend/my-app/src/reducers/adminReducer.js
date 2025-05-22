import {
  ALL_USER_REQUEST,
  ALL_USER_SUCCESS,
  ALL_USER_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_RESET,
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_TEST_REQUEST,
  UPDATE_TEST_SUCCESS,
  UPDATE_TEST_FAIL,
} from "../constants/adminConstants";

const initialState = {
  users: [],
  loading: false,
  error: null,
  updateSuccess: false,
};

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_TEST_REQUEST:
      return {
        ...state,
        loading: true,
        updateSuccess: false,
      };

    case DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ADD_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ALL_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };

    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };

    case ALL_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_PRODUCT_REQUEST:
      return { ...state, loading: true, updateSuccess: false };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
      };

    case UPDATE_TEST_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
      };

    case UPDATE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_TEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_PRODUCT_RESET:
      return {
        ...state,
        loading: false,
        updateSuccess: false,
      };

    default:
      return state;
  }
};
