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
</script>

<template>
  <!-- Banner Section -->
  <section
    class="w-full h-48 md:h-64 lg:h-80 bg-no-repeat bg-cover relative overflow-hidden"
    :style="{
      backgroundImage: vendorDetails?.shops?.[0]?.cvrimage_url
        ? `url(${vendorDetails.shops[0].cvrimage_url})`
        : `url('/src/assets/images/vendor3.png')`,
    }"
  >
    <div class="absolute inset-0 flex items-start justify-center pt-20">
      <div class="text-center text-black px-4">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
          Vendor Dashboard
        </h1>

        <p class="text-lg md:text-xl opacity-90">
          Manage your store and track your sales
        </p>
      </div>
    </div>
  </section>
</template>
