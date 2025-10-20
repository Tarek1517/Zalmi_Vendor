<script setup>
import { useAuthStore } from "@/stores/useAuthStore.js";
import { ref, onMounted, onUnmounted } from "vue";

const authStore = useAuthStore();
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);
const buttonRef = ref(null);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleLogout = () => {
  authStore?.logout();
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (
    dropdownRef.value &&
    buttonRef.value &&
    !dropdownRef.value.contains(event.target) &&
    !buttonRef.value.contains(event.target)
  ) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="bg-white/95 py-2 backdrop-blur-sm border-b border-gray-100 shadow-sm relative z-40"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <div class="flex items-center space-x-2">
            <img
              src="@/assets/images/logo.png"
              alt="Vendor Portal"
              class="h-8 w-auto transition-transform duration-200 hover:scale-105"
            />
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-6">
          <router-link
            to="/"
            class="text-gray-700 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50/80"
            active-class="text-primary bg-blue-50/50"
          >
            Home
          </router-link>

          <router-link
            to="/affiliate"
            class="text-gray-700 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50/80"
            active-class="text-primary bg-blue-50/50"
          >
            Vendor Program
          </router-link>

          <router-link
            to="/players"
            class="text-gray-700 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50/80"
            active-class="text-primary bg-blue-50/50"
          >
            Terms & Conditions
          </router-link>

          <router-link
            to="/matches"
            class="text-gray-700 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50/80"
            active-class="text-primary bg-blue-50/50"
          >
            Privacy Policy
          </router-link>
        </nav>

        <!-- Right side items -->
        <div class="flex items-center space-x-3">
          <!-- Notifications -->
          <button
            class="relative p-2.5 text-primary transition-all duration-200 hover:bg-primary/25 rounded-lg"
          >
            <Icon name="ph:bell" class="text-lg" />
            <span
              class="absolute top-1.5 right-1.5 bg-red-500 rounded-full w-2 h-2 border border-white"
            ></span>
          </button>

          <div class="relative" ref="dropdownRef">
            <div v-if="authStore?.vendor?.vendor">
              <button
                ref="buttonRef"
                @click="toggleDropdown"
                class="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm"
                >
                  <span class="text-white font-semibold text-sm">V</span>
                </div>
                <div
                  v-if="authStore?.vendor"
                  class="flex items-center space-x-2"
                >
                  <span class="hidden md:block text-gray-600">{{
                    authStore?.vendor?.vendor?.shop?.[0]?.shopName
                  }}</span>
                  <Icon
                    name="ph:caret-down"
                    class="text-lg text-gray-400 transition-transform duration-200"
                    :class="{ 'rotate-180': isDropdownOpen }"
                  />
                </div>
              </button>
            </div>

            
            <!-- Dropdown Menu -->
            <div
              v-if="isDropdownOpen"
              class="fixed md:absolute right-4 md:right-0 top-20 md:top-full mt-0 md:mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[100] transition-all duration-200"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-semibold text-gray-900">
                  {{ authStore?.vendor?.shop?.[0]?.shopName }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ authStore?.vendor?.email }}
                </p>
              </div>

              <!-- Menu Items -->
              <div class="py-2">
                <RouterLink v-if="authStore?.vendor" to="/dashboard">
                  <div
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <Icon
                      name="material-symbols:dashboard-outline-rounded"
                      class="text-lg mr-3"
                    />
                    Dashboard
                  </div>
                </RouterLink>
                <a
                  href="#"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
                  <Icon name="ph:user" class="text-lg mr-3" />
                  Profile
                </a>
                <a
                  href="#"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
                  <Icon name="ph:gear" class="text-lg mr-3" />
                  Settings
                </a>

                <div class="border-t border-gray-100">
                  <button
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                  >
                    <Icon
                      name="line-md:log-out"
                      class="text-lg mr-3 group-hover:scale-110 transition-transform duration-150"
                    />
                    Log out
                  </button>
                </div>
              </div>

              <!-- Logout Button -->
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            class="p-2.5 text-gray-500 hover:text-blue-600 transition-all duration-200 hover:bg-gray-100 rounded-lg"
          >
            <Icon name="ph:list" class="text-xl" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
