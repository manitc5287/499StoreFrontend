import { Provider } from "react-redux";
import { Slot } from "expo-router";
import { store } from "./redux/store";
import { initializeAuth } from "./redux/slices/authSlice";

// Initialize auth state from AsyncStorage on app start
store.dispatch(initializeAuth());

export default function App() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
