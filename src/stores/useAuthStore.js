import { defineStore } from "pinia";
import { ref, computed } from "vue";
import useAxios from "@/composables/useAxios";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const vendor = ref(JSON.parse(localStorage.getItem("user")) ?? null);
  const isLoggedIn = computed(() => !!vendor.value);

  const { loading, error, sendRequest } = useAxios();

  // ===============================
  // 🔹 Fetch User
  // ===============================
  async function fetchUser() {
    const token = getToken();
    if (!token) return; // skip fetching if no token

    try {
      const response = await sendRequest({
        method: "GET",
        url: "/vendor/user",
      });

      if (response?.data) {
        // Fix: Preserve the existing structure from localStorage
        const currentData = JSON.parse(localStorage.getItem("user")) || {};
        const updatedData = {
          ...currentData,
          vendor: response.data,
        };

        vendor.value = updatedData;
        localStorage.setItem("user", JSON.stringify(updatedData));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        await logout();
      }
    }
  }

  // ===============================
  // 🔹 Login
  // ===============================
  async function login(credentials) {
    try {
      const loginResponse = await sendRequest({
        method: "POST",
        url: "/vendor/login",
        data: credentials,
      });

      if (loginResponse?.data) {
        const data = loginResponse.data.vendor
          ? loginResponse.data
          : { vendor: loginResponse.data, token: loginResponse.data.token };
        await setLocalStorage(data);
        vendor.value = data;
        return loginResponse;
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  }

  // ===============================
  // 🔹 Register
  // ===============================
  async function register(signupData) {
    try {
      const formData = new FormData();
      for (const key in signupData) {
        if (signupData[key] != null) {
          if (key === "documents" && Array.isArray(signupData[key])) {
            signupData[key].forEach((file) =>
              formData.append("documents[]", file)
            );
          } else {
            formData.append(key, signupData[key]);
          }
        }
      }

      const signupResponse = await sendRequest({
        method: "POST",
        url: "/vendor/register",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (signupResponse?.data) {
        const data = signupResponse.data.vendor
          ? signupResponse.data
          : { vendor: signupResponse.data, token: signupResponse.data.token };
        await setLocalStorage(data);
        vendor.value = data;
        return signupResponse;
      }
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    }
  }

  // ===============================
  // 🔹 Logout
  // ===============================
  async function logout() {
    try {
      await sendRequest({
        url: "/logout",
        method: "POST",
      });
    } catch (err) {
      console.warn("Logout request failed — proceeding to clear session.");
    } finally {
      vendor.value = null;
      await clearLocalStorage();
      router.push({ name: "Home" });
    }
  }

  // ===============================
  // 🔹 Local Storage Helpers
  // ===============================
  async function setLocalStorage(data) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  async function clearLocalStorage() {
    localStorage.removeItem("user");
  }

  function getToken() {
    return JSON.parse(localStorage.getItem("user"))?.token ?? null;
  }

  // ===============================
  // 🔹 Expose
  // ===============================
  return {
    vendor,
    isLoggedIn,
    login,
    register,
    fetchUser,
    logout,
    loading,
    error,
    getToken,
  };
});
