// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import storeReducer from './slices/storeSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    auth: authReducer,
    cart: cartReducer,
    store: storeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
