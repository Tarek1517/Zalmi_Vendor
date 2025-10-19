import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token automatically to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function useAxios() {
  const loading = ref(false);
  const error = ref(null);

  const sendRequest = async (config) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance(config);
      return response;
    } catch (err) {
      error.value = err.response ? err.response.data : err.message;
      toast.error(error.value?.message || "An error occurred", {
        autoClose: 2000,
        theme: "dark",
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    sendRequest,
  };
}
