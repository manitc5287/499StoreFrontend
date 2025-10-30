import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function ProfileScreen() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>👤 Profile</Text>
      <Text>Name: {user.name}</Text>
      <Text>Status: {user.loggedIn ? "Logged In" : "Guest"}</Text>
    </View>
  );
}
