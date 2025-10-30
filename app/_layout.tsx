import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ToastProvider } from "../contexts/ToastContext";

export default function Layout() {
  return (
    <>
      <Provider store={store}>
        <ToastProvider>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
                <Stack.Screen name="admin-dashboard" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="cart" options={{ headerShown: false }} />
                <Stack.Screen name="checkout" options={{ headerShown: false }} />
                <Stack.Screen name="add-address" options={{ headerShown: false }} />
                <Stack.Screen name="product/[id]" options={{ title: "Product Details" }} />
          </Stack>
        </ToastProvider>
      </Provider>
    </>
  );
}
