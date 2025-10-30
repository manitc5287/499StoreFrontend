import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // or your server IP
});

export default API;
