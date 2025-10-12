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
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.token) return; // Exit if no token

    try {
      const response = await sendRequest({
        method: "GET",
        url: "/vendor/user",
        headers: {
          Authorization: `Bearer ${storedUser.token}`,
        },
      });

      if (response?.data) {
        vendor.value = response.data;
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      // Only clear storage if 401 (unauthorized)
      if (err.response?.status === 401) {
        await clearLocalStorage();
        vendor.value = null;
        router.push({ name: "Login" });
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
        url: "/login",
        data: credentials,
      });

      if (loginResponse?.data) {
        await setLocalStorage(loginResponse.data);
        vendor.value = loginResponse.data;
        return loginResponse;
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err; // Rethrow so component can handle
    }
  }

  // ===============================
  // 🔹 Register (multipart/form-data)
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
        url: "/register",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (signupResponse?.data) {
        await setLocalStorage(signupResponse.data);
        vendor.value = signupResponse.data;
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
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
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
  // 🔹 Expose to components
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
