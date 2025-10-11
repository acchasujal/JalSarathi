import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000
});

export const getDemoLocations = () => axiosInstance.get("/rainwater/demo-locations").then(r => r.data);
export const calculateRainwater = (payload) => axiosInstance.post("/rainwater/calculate", payload).then(r => r.data);
export const generatePDF = (assessment) => axiosInstance.post("/rainwater/generate-pdf", assessment, { responseType: "blob" }).then(r => r.data);
export const getAdminStats = () => axiosInstance.get("/admin/stats").then(r => r.data);

export default axiosInstance;
