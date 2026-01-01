import axios from "axios";

// Base backend URL from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Rainwater APIs

// GET demo cities
export const getDemoLocations = async () => {
  const res = await api.get("/api/rainwater/demo-locations");
  return res.data;
};

// POST rainwater calculation
export const calculateRainwater = async (payload) => {
  const res = await api.post("/api/rainwater/calculate", payload);
  return res.data;
};

// POST PDF generation
export const generatePDF = async (assessmentData) => {
  const res = await api.post(
    "/api/rainwater/generate-pdf",
    { assessmentData },
    { responseType: "blob" }
  );
  return res.data;
};

//Admin APIs (future-safe)

export const getAdminStats = async () => {
  const res = await api.get("/api/admin/stats");
  return res.data;
};

export default api;
