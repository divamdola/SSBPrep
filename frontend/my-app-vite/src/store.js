import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import thunk from "redux-thunk";

import { authReducer, forgotPasswordReducer } from "./reducers/userReducer";
import { productsReducer } from "./reducers/productsReducer";
import { testReducer } from "./reducers/testReducer";
import {adminReducer} from "./reducers/adminReducer";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  tests:testReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: forgotPasswordReducer,
  admin: adminReducer,
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], //  Ignore these actions
      },
    }).concat(thunk), //  Correct import
  devTools: import.meta.env.MODE !== "production", // Updated for Vite
});

// Create persistor
export const persistor = persistStore(store);

export default store;
