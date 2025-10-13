<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/useAuthStore.js";
import useAxios from "@/composables/useAxios.js";
const { loading, error, sendRequest } = useAxios();
const authStore = useAuthStore();

const vendorDetails = ref([]);

const fetchVendor = async () => {
  try {
    const response = await sendRequest({
      method: "get",
      url: `/v1/vendor/${authStore?.vendor?.id}`,
    });

    const data = response?.data?.data;
    if (!data) return;

    // Normalize URLs
    vendorDetails.value = {
      ...data,
      shops: data.shops?.map((shop) => ({
        ...shop,
        image_url: shop.image_url?.replace(/\\/g, "/"),
        cvrimage_url: shop.cvrimage_url?.replace(/\\/g, "/"),
      })),
    };
  } catch (error) {
    console.error("Error fetching vendor:", error);
  }
};

onMounted(() => {
  fetchVendor();
});

// Vendor data
const vendor = ref({
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  join_date: "2023-01-15T10:30:00Z",
  store_name: "Tech Haven",
  store_slug: "tech-haven",
  total_products: 24,
  total_orders: 128,
  total_revenue: 28500.75,
  pending_orders: 5,
  rating: 4.8,
  reviews_count: 89,
  balance: 3250.75,
  pending_balance: 450.25,
});
const currency_symbol = "$";
</script>

<template>
  <!-- Vendor Profile Header -->
  <div
    class="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 relative z-10"
  >
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div
        class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-blue-100 flex items-center justify-center"
      >
        <img
          :src="vendorDetails?.shops?.[0]?.image_url"
          alt="Shop Image"
          class="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>
      <div class="flex-1">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">
              {{ vendorDetails?.shops?.[0]?.shopName }}
            </h2>

            <p class="text-gray-600 mb-2">
              Managed by {{ vendorDetails?.vendorName }}
            </p>

            <div class="flex flex-wrap items-center gap-3">
              <span
                class="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-sm font-medium"
              >
                <Icon name="ph:star" class="text-blue-600 text-lg" />
                {{ vendor.rating }} ({{ vendor.reviews_count }} reviews)
              </span>
              <span
                class="inline-flex items-center gap-2 bg-green-50 text-green-600 rounded-full px-3 py-1 text-sm font-medium"
              >
                <Icon name="ph:package" class="text-green-600 text-lg" />
                {{ vendor.total_products }} products
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Available Balance</p>
            <p class="text-2xl font-bold text-green-600">
              {{ currency_symbol }}{{ vendor.balance.toFixed(2) }}
            </p>
            <button
              @click="requestPayout"
              class="mt-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm"
            >
              Request Payout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Earnings Summary -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-green-100 rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Revenue</p>
          <p class="text-2xl font-bold text-green-900">
            {{ currency_symbol }}{{ vendor.total_revenue.toFixed(2) }}
          </p>
        </div>
        <div class="p-3 bg-green-400 rounded-lg text-green-800">
          <Icon name="ph:currency-dollar" class="text-2xl" />
        </div>
      </div>
    </div>

    <div class="bg-amber-100 rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pending Balance</p>
          <p class="text-2xl font-bold text-amber-600">
            {{ currency_symbol }}{{ vendor.pending_balance.toFixed(2) }}
          </p>
        </div>
        <div class="p-3 bg-amber-400 rounded-lg text-amber-800">
          <Icon name="ph:clock" class="text-2xl" />
        </div>
      </div>
    </div>

    <div class="bg-blue-100 rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pending Orders</p>
          <p class="text-2xl font-bold text-blue-600">
            {{ vendor.pending_orders }}
          </p>
        </div>
        <div class="p-3 bg-blue-400 rounded-lg text-blue-800">
          <Icon name="ph:shopping-cart" class="text-2xl" />
        </div>
      </div>
    </div>
  </div>
</template>
