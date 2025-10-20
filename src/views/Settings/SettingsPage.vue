<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import SummernoteEditor from "vue3-summernote-editor";
import useAxios from "@/composables/useAxios.js";
import { toast } from "vue3-toastify";
import { useAuthStore } from "@/stores/useAuthStore.js";

const { loading, error, sendRequest } = useAxios();
const authStore = useAuthStore();

const tabs = [
  { id: "profile", name: "Profile Information" },
  { id: "password", name: "Change Password" },
  { id: "store", name: "Store Settings" },
];
const activeTab = ref("profile");

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

const selectedCountry = ref({
  code: "BD",
  name: "Bangladesh",
  dialCode: "+880",
});
const rawPhoneNumber = ref("");

const fullPhoneNumber = computed({
  get() {
    const cleaned = rawPhoneNumber.value.replace(/^(\+|\s)+/, "");
    return `${selectedCountry.value.dialCode}${cleaned}`;
  },
  set(value) {
    const code = selectedCountry.value.dialCode;
    rawPhoneNumber.value = value.startsWith(code)
      ? value.slice(code.length)
      : value;
  },
});

const selectCountry = (country) => {
  selectedCountry.value = country;
  showDropdown.value = false;
};

const form = ref({
  shopName: null,
  vendor_type: null,
  vendorName: null,
  documents: null,
  nid: null,
  email: null,
  licenseNumber: null,
  type: null,
  order_number: null,
  description: "",
  short_description: "",
  new_password: "",
  old_password: "",
  confirm_password: "",
  phoneNumber: "",
  image: null,
  cvrimage: null,
});

const profileImg = ref(null);
const coverImg = ref(null);
const fetchVendor = async () => {
  try {
    const response = await sendRequest({
      method: "get",
      url: `/v1/vendor/${authStore?.vendor?.vendor?.id}`,
    });

    const data = response.data?.data;
    if (!data) return;

    Object.keys(form.value).forEach((key) => {
      if (data[key] !== undefined) form.value[key] = data[key];
    });

    if (data.shops && data.shops.length > 0) {
      const shop = data.shops[0];

      form.value.shopName = shop.shopName ?? null;
      form.value.vendor_type = shop.vendor_type ?? null;
      form.value.short_description = shop.short_description ?? "";
      form.value.description = shop.description ?? "";
      form.value.order_number = shop.order_number ?? null;
      form.value.type = shop.type ?? null;

      profileImg.value = shop.image_url ?? null;
      coverImg.value = shop.cvrimage_url ?? null;
    }

    if (data.phoneNumber) {
      const matchedCountry = countries.find((c) =>
        data.phoneNumber.startsWith(c.dialCode)
      );
      if (matchedCountry) {
        selectedCountry.value = matchedCountry;
        rawPhoneNumber.value = data.phoneNumber.slice(
          matchedCountry.dialCode.length
        );
      } else {
        selectedCountry.value = { code: "", name: "", dialCode: "" };
        rawPhoneNumber.value = data.phoneNumber;
      }
    }
  } catch (err) {
    console.error("Error fetching vendor:", err);
  }
};

onMounted(fetchVendor);

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  form.value.image = file;
  profileImg.value = URL.createObjectURL(file);
};

const onCoverFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  form.value.cvrimage = file;
  coverImg.value = URL.createObjectURL(file);
};

const handleDocuments = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  form.value.documents = file;
};

watch([rawPhoneNumber, selectedCountry], () => {
  const cleaned = rawPhoneNumber.value.replace(/^(\+|\s)+/, "");
  form.value.phoneNumber = `${selectedCountry.value.dialCode}${cleaned}`;
});

const onSubmit = async () => {
  try {
    const formData = new FormData();

    Object.keys(form.value).forEach((key) => {
      if (form.value[key] !== null && form.value[key] !== undefined) {
        if (
          ["image", "cvrimage", "documents"].includes(key) &&
          form.value[key] instanceof File
        ) {
          formData.append(key, form.value[key]);
        } else {
          formData.append(key, String(form.value[key]));
        }
      }
    });

    const response = await sendRequest({
      method: "post",
      url: `/v1/vendor/${authStore?.vendor?.vendor?.id}`,
      params: { _method: "PUT" },
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response?.data) {
      toast.success("Profile updated successfully", {
        autoclose: 1000,
        theme: "dark",
      });
      fetchVendor();
    }
  } catch (err) {
    console.error("Submission error:", err);
    toast.error("Failed to update profile");
  }
};

onUnmounted(() => {
  if (profileImg.value && profileImg.value.startsWith("blob:")) {
    URL.revokeObjectURL(profileImg.value);
  }
  if (coverImg.value && coverImg.value.startsWith("blob:")) {
    URL.revokeObjectURL(coverImg.value);
  }
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-primary mb-6">Vendor Settings</h2>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-xl shadow-sm mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Profile Information Tab -->
    <div
      v-if="activeTab === 'profile'"
      class="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
    >
      <div class="p-5 border-b border-gray-100">
        <h3 class="font-semibold text-gray-900">Profile Information</h3>
        <p class="text-sm text-gray-500">Update your Profile details</p>
      </div>

      <div class="p-5 space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Vendor Name</label
            >
            <input
              type="text"
              v-model="form.vendorName"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >License Number</label
            >
            <input
              type="text"
              v-model="form.licenseNumber"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >NID Number</label
            >
            <input
              type="text"
              v-model="form.nid"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              v-model="form.email"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Phone Number</label
            >
            <div class="flex gap-2">
              <div class="relative w-1/3">
                <button
                  type="button"
                  @click="showDropdown = !showDropdown"
                  class="w-full px-3 py-3 rounded-lg border border-primary/25 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition"
                >
                  <div class="flex items-center">
                    <img
                      :src="`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`"
                      :srcset="`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`"
                      class="w-5 h-3.5 mr-2 object-cover"
                      :alt="selectedCountry.code"
                    />
                    <span class="text-sm">{{ selectedCountry.dialCode }}</span>
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
                    <span class="text-sm"
                      >{{ country.name }} ({{ country.dialCode }})</span
                    >
                  </div>
                </div>
              </div>

              <input
                v-model="rawPhoneNumber"
                type="tel"
                class="flex-1 px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Business Documents</label
            >
            <label
              class="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            >
              <div class="flex flex-col items-center justify-center">
                <template v-if="form.documents">
                  <div class="flex flex-col items-center text-gray-600 mb-2">
                    <Icon
                      name="solar:file-download-bold-duotone"
                      class="text-5xl text-primary mb-2"
                    />
                    <p class="text-sm text-gray-700 font-medium text-center">
                      {{ form.documents.name }}
                    </p>
                  </div>
                </template>

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
                    <span class="font-medium">Click to upload</span> or drag and
                    drop
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
        </div>
      </div>
    </div>

    <!-- Change Password Tab -->
    <div
      v-if="activeTab === 'password'"
      class="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
    >
      <div class="p-5 border-b border-gray-100">
        <h3 class="font-semibold text-gray-900">Change Password</h3>
        <p class="text-sm text-gray-500">Update your password</p>
      </div>

      <div class="p-5 space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Old Password</label
            >
            <input
              type="password"
              v-model="form.old_password"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >New Password</label
            >
            <input
              type="password"
              v-model="form.new_password"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Confirm Password</label
            >
            <input
              type="password"
              v-model="form.confirm_password"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Store Settings Tab -->
    <div
      v-if="activeTab === 'store'"
      class="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
    >
      <div class="p-5 border-b border-gray-100">
        <h3 class="font-semibold text-gray-900">Store Information</h3>
        <p class="text-sm text-gray-500">
          Update your store details and preferences
        </p>
      </div>

      <div class="p-5 space-y-5">
        <div class="grid grid-cols-1 gap-5">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Store Name</label
            >
            <input
              type="text"
              v-model="form.shopName"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Vendor Type</label
            >
            <input
              type="text"
              v-model="form.vendor_type"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Store Type</label
            >
            <select
              v-model="form.type"
              class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            >
              <option value="inhouse_shop">In-house Shop</option>
              <option value="vendor_shop">Vendor Shop</option>
            </select>
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700"
            >Store Description</label
          >
          <textarea
            rows="4"
            v-model="form.short_description"
            class="block w-full px-4 py-2.5 rounded-lg border border-primary/25 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            placeholder="Describe your store for customers"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="space-y-2 lg:col-span-1">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <Icon
                name="mdi:camera-outline"
                class="w-4 h-4 mr-2 text-primary"
              />
              Shop Image <span class="text-red-500 ml-1">*</span>
            </label>
            <label
              for="profile_image"
              class="block w-auto aspect-square max-h-64 flex items-center justify-center p-4 border-2 border-dashed border-primary/30 rounded-full text-primary cursor-pointer bg-gradient-to-br from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 group overflow-hidden"
            >
              <input
                type="file"
                id="profile_image"
                hidden
                accept="image/*"
                @change="onFileChange"
              />
              <div v-if="!profileImg" class="text-center">
                <Icon
                  name="mdi:cloud-upload-outline"
                  class="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300"
                />
                <p class="text-sm font-medium text-gray-700">Upload Image</p>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG, WEBP</p>
              </div>
              <div v-else class="relative w-full h-full">
                <img
                  :src="profileImg"
                  class="w-full h-full object-cover rounded-full shadow-md"
                />
                <div
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center"
                >
                  <Icon name="mdi:camera-plus" class="w-8 h-8 text-white" />
                </div>
              </div>
            </label>
          </div>

          <div class="space-y-2 lg:col-span-2">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <Icon
                name="mdi:image-outline"
                class="w-4 h-4 mr-2 text-primary"
              />
              Cover Image <span class="text-red-500 ml-1">*</span>
            </label>
            <label
              for="cover_image"
              class="block w-full h-64 flex items-center justify-center gap-3 p-4 border-2 border-dashed border-primary/30 rounded-xl text-primary cursor-pointer bg-gradient-to-br from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 group"
            >
              <input
                type="file"
                id="cover_image"
                hidden
                accept="image/*"
                @change="onCoverFileChange"
              />
              <div v-if="!coverImg" class="text-center">
                <Icon
                  name="mdi:cloud-upload-outline"
                  class="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300"
                />
                <p class="text-sm font-medium text-gray-700">
                  Upload Cover Photo
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
              <div v-else class="relative w-full h-full">
                <img
                  :src="coverImg"
                  class="w-full h-full object-cover rounded-lg shadow-md"
                />
                <div
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center"
                >
                  <Icon name="mdi:camera-plus" class="w-8 h-8 text-white" />
                </div>
              </div>
            </label>
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700"
            >Detailed Description</label
          >
          <div class="editor_data">
            <SummernoteEditor v-model="form.description" />
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button
        @click="onSubmit"
        class="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
      >
        Save Changes
      </button>
    </div>
  </div>
</template>
