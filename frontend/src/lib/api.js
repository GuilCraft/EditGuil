import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("editguil_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("editguil_token");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export function resolveImage(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BACKEND_URL}${url}`;
}
