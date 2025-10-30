import axios from "axios";
import { Platform } from "react-native";

const API = axios.create({
  baseURL: Platform.OS === 'web' 
    ? "http://localhost:5000/api"
    : "http://YOUR_COMPUTER_IP:5000/api",
});

export default API;
