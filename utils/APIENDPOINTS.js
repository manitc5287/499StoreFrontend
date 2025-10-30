export const BASE_URL = "http://10.0.2.2:5000";

export const ENDPOINTS = {
  AUTH: "/api/auth",
  PRODUCTS: "/api/products",
  USERS: "/api/users",
};

export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}${ENDPOINTS.AUTH}/login`,
  REGISTER: `${BASE_URL}${ENDPOINTS.AUTH}/register`,
  UPDATE_USER: `${BASE_URL}${ENDPOINTS.AUTH}/update`,
  CHANGE_PASSWORD: `${BASE_URL}${ENDPOINTS.AUTH}/change-password`,
};