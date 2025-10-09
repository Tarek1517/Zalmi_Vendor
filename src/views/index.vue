<script setup>
import { ref, computed, watch } from "vue";
import useAxios from "@/composables/useAxios";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
const { loading, error, sendRequest } = useAxios();
// State
const activeTab = ref("login");
const showDropdown = ref(false);

const countries = [
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "BD", name: "Bangladesh", dialCode: "+880" },
  { code: "IN", name: "India", dialCode: "+91" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "AU", name: "Australia", dialCode: "+61" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "JP", name: "Japan", dialCode: "+81" },
  { code: "SG", name: "Singapore", dialCode: "+65" },
];

// Default country
const selectedCountry = ref({
  code: "BD",
  name: "Bangladesh",
  dialCode: "+880",
});

const rawPhoneNumber = ref("");

const fullPhoneNumber = computed(() => {
  const cleanedNumber = rawPhoneNumber.value.replace(/^(\+|\s)+/, "");
  return `${selectedCountry.value.dialCode}${cleanedNumber}`;
});

const form = ref({
  shopName: "",
  vendorName: "",
  licenseNumber: "",
  nid: "",
  email: "",
  password: "",
  termsAccepted: false,
  documents: "",
  phoneNumber: fullPhoneNumber.value,
});

const documentsPreview = ref(null);
const isImage = ref(false);

const handleDocuments = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert("File size must be less than 5MB");
    return;
  }

  form.value.documents = file;

  const fileType = file.type.toLowerCase();

  if (fileType.startsWith("image/")) {
    isImage.value = true;
    documentsPreview.value = URL.createObjectURL(file);
  } else {
    isImage.value = false;
    documentsPreview.value = null;
  }
};

const selectCountry = (country) => {
  selectedCountry.value = country;
  showDropdown.value = false;
};

const onSubmit = async () => {
  const response = await sendRequest({
    method: "post",
    url: "/register ",
    data: form.value,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response?.data) {
    toast.success(`Profile Submitted Successfully`, { autoclose: 1000 });
  }
};

watch([rawPhoneNumber, selectedCountry], () => {
  const cleanedNumber = rawPhoneNumber.value.replace(/^(\+|\s)+/, "");
  form.value.phoneNumber = `${selectedCountry.value.dialCode}${cleanedNumber}`;
});
</script>

<template>
  <AppLayout>
    <div class="bg-gradient-to-br from-gray-50 to-gray-100">
      <main class="px-4 py-8 md:py-12">
        <!-- Hero Section -->
        <section class="mb-12 md:mb-16 text-center">
          <div class="max-w-4xl mx-auto">
            <h1
              class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
            >
              Grow Your Business with <span class="text-primary">Zalmi</span>
            </h1>
            <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of sellers reaching millions of customers worldwide
              with our powerful e-commerce platform.
            </p>
          </div>
        </section>

        <!-- Tab System -->
        <div class="flex justify-center mb-12">
          <div
            class="inline-flex bg-white p-1 rounded-full shadow-md border border-primary/55"
          >
            <button
              @click="activeTab = 'login'"
              :class="{
                'bg-primary text-white': activeTab === 'login',
                'text-primary': activeTab !== 'login',
              }"
              class="py-2 px-6 font-medium text-sm rounded-full transition-all duration-300 cursor-pointer"
            >
              Sign In
            </button>
            <button
              @click="activeTab = 'register'"
              :class="{
                'bg-primary text-white': activeTab === 'register',
                'text-primary': activeTab !== 'register',
              }"
              class="py-2 px-6 font-medium text-sm rounded-full transition-all duration-300 cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
        
        <!-- Tab Content -->
        <div class="max-w-5xl mx-auto">
          <!-- Login Tab -->
          <div
            v-if="activeTab === 'login'"
            class="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div class="md:flex">
              <div class="md:w-1/2 p-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                  Welcome Back
                </h2>

                <form class="space-y-5">
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Email</label
                    >
                    <input
                      id="email"
                      type="email"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <label
                        for="password"
                        class="block text-sm font-medium text-gray-700"
                        >Password</label
                      >
                      <RouterLink
                        to="/forget-password"
                        class="text-sm text-primary hover:text-secondary transition"
                      >
                        Forgot password?
                      </RouterLink>
                    </div>
                    <input
                      id="password"
                      type="password"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                      placeholder="••••••••"
                    />
                  </div>

                  <div class="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      for="remember"
                      class="ml-2 block text-sm text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>

                  <button
                    type="submit"
                    class="w-full bg-primary text-white font-medium py-3 px-4 rounded-lg transition shadow-md"
                  >
                    Sign In
                  </button>
                </form>

                <div class="mt-6">
                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                      <span class="px-2 bg-white text-gray-500"
                        >Or continue with</span
                      >
                    </div>
                  </div>

                  <div class="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      @click="signInWithGoogle"
                      class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <svg
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span class="ml-2">Google</span>
                    </button>
                    <button
                      type="button"
                      @click="signInWithFacebook"
                      class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <svg
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          fill="#1877F2"
                        />
                      </svg>
                      <span class="ml-2">Facebook</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="md:w-1/2 bg-gradient-to-br from-primary to-secondary p-8 flex items-center justify-center"
              >
                <div class="text-center text-white">
                  <img
                    src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                    alt="Seller"
                    class="w-48 h-48 rounded-full object-cover mx-auto mb-6 shadow-lg"
                  />
                  <h3 class="text-xl font-bold mb-2">New to Zalmi?</h3>
                  <p class="mb-4">
                    Join our marketplace and start selling to millions of
                    customers
                  </p>
                  <!-- <button
                  @click="activeTab = 'register'"
                  class="px-4 py-2 bg-white text-primary rounded-md font-medium hover:bg-gray-100 transition"
                >
                  Create Account
                </button> -->
                  <RouterLink
                    to="/dashboard"
                    class="px-4 py-2 bg-white text-primary rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    Seller Dashboard
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Register Tab -->
          <div
            v-if="activeTab === 'register'"
            class="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div class="md:flex">
              <div class="md:w-1/2 p-8 space-y-4">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                  Become a Seller
                </h2>
               
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="shopName"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Shop/Brand Name</label
                    >
                    <input
                      id="shopName"
                      v-model="form.shopName"
                      type="text"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                      placeholder="Your shop name"
                    />
                  </div>

                  <div>
                    <label
                      for="registrantName"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Your Name</label
                    >
                    <input
                      id="registrantName"
                      v-model="form.vendorName"
                      type="text"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="licenseNumber"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >License Number</label
                    >
                    <input
                      id="licenseNumber"
                      v-model="form.licenseNumber"
                      type="text"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                      placeholder="Business license"
                    />
                  </div>

                  <div>
                    <label
                      for="nid"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >NID Number</label
                    >
                    <input
                      id="nid"
                      v-model="form.nid"
                      type="text"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                      placeholder="National ID"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="regEmail"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Email</label
                    >
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      for="password"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Password</label
                    >
                    <input
                      id="password"
                      v-model="form.password"
                      type="password"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <div class="flex gap-2">
                    <!-- Country Selector -->
                    <div class="relative w-1/3">
                      <button
                        type="button"
                        @click="showDropdown = !showDropdown"
                        class="w-full px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center">
                          <img
                            :src="`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`"
                            :srcset="`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`"
                            class="w-5 h-3.5 mr-2 object-cover"
                            :alt="selectedCountry.code"
                          />
                          <span class="text-sm">{{
                            selectedCountry.dialCode
                          }}</span>
                        </div>
                        <svg
                          class="h-4 w-4 ml-1 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <!-- Dropdown -->
                      <div
                        v-if="showDropdown"
                        class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                      >
                        <div
                          v-for="country in countries"
                          :key="country.code"
                          @click="selectCountry(country)"
                          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        >
                          <img
                            :src="`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`"
                            :srcset="`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`"
                            class="w-5 h-3.5 mr-2 object-cover"
                            :alt="country.code"
                          />
                          <span class="text-sm">
                            {{ country.name }} ({{ country.dialCode }})
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Phone Input -->
                    <input
                      v-model="rawPhoneNumber"
                      type="tel"
                      class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Business Documents
                  </label>

                  <label
                    class="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div class="flex flex-col items-center justify-center">
                      <template v-if="form.documents">
                        <!-- Image Preview -->
                        <img
                          v-if="isImage"
                          :src="documentsPreview"
                          class="h-32 w-32 object-contain mb-2"
                          alt="Preview"
                        />

                        <!-- Document Placeholder -->
                        <div
                          v-else
                          class="flex flex-col items-center text-gray-600 mb-2"
                        >
                          <Icon
                            name="solar:file-download-bold-duotone"
                            class="text-5xl text-primary mb-2"
                          />
                          <p
                            class="text-sm text-gray-700 font-medium text-center"
                          >
                            {{ form.documents.name }}
                          </p>
                        </div>
                      </template>

                      <!-- Default Upload UI -->
                      <template v-else>
                        <svg
                          class="h-8 w-8 text-gray-500 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p class="text-sm text-gray-600">
                          <span class="font-medium">Click to upload</span> or
                          drag and drop
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                        </p>
                      </template>
                    </div>

                    <input
                      id="documents"
                      type="file"
                      class="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      @change="handleDocuments"
                    />
                  </label>
                </div>

                <div class="flex items-start mt-4">
                  <div class="flex items-center h-5">
                    <input
                      id="terms"
                      v-model="form.termsAccepted"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="terms" class="font-medium text-gray-700">
                      I agree to the
                      <a href="/terms" class="text-primary hover:underline">
                        Terms of Service
                      </a>
                      and
                      <a href="/privacy" class="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                <button
                  @click="onSubmit"
                  type="submit"
                  :disabled="!form.termsAccepted"
                  :class="[
                    'w-full font-medium py-3 px-4 rounded-lg transition shadow-md',
                    form.termsAccepted
                      ? 'bg-primary cursor-pointer text-white hover:bg-primary/90'
                      : 'bg-gray-300 cursor-not-allowed text-gray-600',
                  ]"
                >
                  Apply Now
                </button>
              </div>

              <div
                class="md:w-1/2 bg-gradient-to-br from-primary to-secondary p-8 flex items-center justify-center"
              >
                <div class="text-center text-white">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                    alt="Seller"
                    class="w-48 h-48 rounded-full object-cover mx-auto mb-6 shadow-lg"
                  />
                  <h3 class="text-xl font-bold mb-2">
                    Already have an account?
                  </h3>
                  <p class="mb-4">
                    Sign in to manage your store and view your sales
                  </p>
                  <button
                    @click="activeTab = 'login'"
                    class="px-4 py-2 bg-white text-primary rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Features Section -->
      <section class="bg-white py-12 md:py-16">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Sell With <span class="text-primary"> Zalmi?</span>
            </h2>
            <p class="text-lg text-gray-600">
              Our platform gives you everything you need to start, run, and grow
              your business.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
              <div
                class="bg-primary/25 w-14 h-14 rounded-xl flex items-center justify-center mb-6 mx-auto"
              >
                <svg
                  class="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-center mb-3">
                Grow Your Sales
              </h3>
              <p class="text-gray-600 text-center">
                Access millions of customers and benefit from our marketing
                tools to increase your sales.
              </p>
            </div>

            <div class="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
              <div
                class="bg-primary/25 w-14 h-14 rounded-xl flex items-center justify-center mb-6 mx-auto"
              >
                <svg
                  class="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-center mb-3">
                Secure Payments
              </h3>
              <p class="text-gray-600 text-center">
                Get paid securely and on time with our reliable payment system
                that protects both you and your customers.
              </p>
            </div>

            <div class="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
              <div
                class="bg-primary/25 w-14 h-14 rounded-xl flex items-center justify-center mb-6 mx-auto"
              >
                <svg
                  class="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-center mb-3">
                Mobile Friendly
              </h3>
              <p class="text-gray-600 text-center">
                Manage your business on the go with our mobile-optimized seller
                app available on iOS and Android.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="bg-gray-50 py-12 md:py-16">
        <div class="container mx-auto px-4">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of Sellers
            </h2>
            <p class="text-lg text-gray-600">
              Hear from sellers who grew their business with Zalmi
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div class="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="Sarah J."
                  class="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 class="font-bold">Sarah J.</h4>
                  <p class="text-gray-600 text-sm">Fashion Store Owner</p>
                </div>
              </div>
              <p class="text-gray-700">
                "Since joining zalmi, my sales have increased by 300%. The
                platform is easy to use and the customer support is excellent."
              </p>
              <div class="flex mt-4 text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>

            <div
              class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div class="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/44.jpg"
                  alt="Michael T."
                  class="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 class="font-bold">Michael T.</h4>
                  <p class="text-gray-600 text-sm">Electronics Seller</p>
                </div>
              </div>
              <p class="text-gray-700">
                "The analytics tools helped me understand my customers better
                and optimize my inventory. My business has never been more
                profitable."
              </p>
              <div class="flex mt-4 text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>

            <div
              class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div class="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Aisha K."
                  class="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 class="font-bold">Aisha K.</h4>
                  <p class="text-gray-600 text-sm">Handmade Crafts</p>
                </div>
              </div>
              <p class="text-gray-700">
                "As a small business owner, zalmi gave me the tools to compete
                with bigger brands. The seller community is incredibly
                supportive."
              </p>
              <div class="flex mt-4 text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style>
/* Smooth transitions for all interactive elements */
button,
input,
a,
select {
  transition: all 0.2s ease;
}

/* Custom focus styles */
input:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Animation for dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
