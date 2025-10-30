import { Provider } from "react-redux";
import { Slot } from "expo-router";
import { store } from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
