import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import useAxios from '@/composables/useAxios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const user = ref(JSON.parse(localStorage.getItem('user')) ?? null);
    const isLoggedIn = computed(() => !!user.value);
    const { loading, error, sendRequest } = useAxios();

    async function fetchUser() {
		try {
			const storedUser = JSON.parse(localStorage.getItem('user'));
			if (storedUser?.token) {
				const response = await sendRequest({
					method: 'get',
					url: '/user',
					headers: {
						"Authorization": `Bearer ${storedUser.token}`
					}
				});
				if (response?.data) {
				} else {
					await clearLocalStorage();
				}
			} else {
				await clearLocalStorage();
			}
		} catch (err) {
			console.error("Error fetching user:", err);
			await clearLocalStorage();
		}
	}

    async function login(credential) {
        try {
            await sendRequest({
                method: 'get',
                url: "/sanctum/csrf-cookie",
            });

            const loginResponse = await sendRequest({
                method: "post",
                url: "/customer/login",
                data: credential
            });
            if (loginResponse.data) {
                await setLocalStorage(loginResponse.data);
                user.value = loginResponse.data;
                return loginResponse;
            }
        } catch (err) {
            throw err;
        }
    }

    async function signup(signupData) {
        try {
            const signupResponse = await sendRequest({
                method: "POST",
                url: "/customer/register",
                data: signupData
            });
            
            if (signupResponse?.data) {
                await setLocalStorage(signupResponse?.data);
                user.value = signupResponse?.data;
                return signupResponse;
            }
        } catch (err) {
            throw err;
        }
    }

    async function logout() {
        try {
            await sendRequest({
                url: "/api/logout",
                method: "GET"
            });
            user.value = null;
            await clearLocalStorage();
            router.push({ name: "Home" });
        } catch (err) {
            console.error("Logout failed", error.value);
        }
    }

    async function setLocalStorage(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    async function clearLocalStorage() {
        localStorage.removeItem('user');
    }

    async function getLocalStorage() {
        return localStorage.getItem('user');
    }

    function getToken() {
        return JSON.parse(localStorage.getItem("user"))?.token;
    }

    return { user, login, signup, isLoggedIn, fetchUser, logout, loading, error }
});