import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/slices/authSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { useRouter } from "expo-router";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleRegister = () => {
    dispatch(registerUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") router.push("/auth/login");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Registration</Text>
      <TextInput placeholder="Name" style={styles.input} value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} />
      <TextInput placeholder="Email" style={styles.input} value={form.email} onChangeText={(text) => setForm({ ...form, email: text })} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={form.password} onChangeText={(text) => setForm({ ...form, password: text })} />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { textAlign: "center", color: "#007bff", marginTop: 10 },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
});
