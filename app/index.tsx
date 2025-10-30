import { useEffect } from "react";
import { router } from "expo-router";

export default function IndexScreen() {
  useEffect(() => {
    // Redirect to login screen on app start
    router.replace('/login' as any);
  }, []);

  return null;
}