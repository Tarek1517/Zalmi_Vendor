<script setup>
import useAxios from "@/composables/useAxios";
import { ref, watch, inject, onMounted } from "vue";
import { onClickOutside } from "@vueuse/core";

const { loading, error, sendRequest } = useAxios();
const search = ref(null);
const target = ref(null);
const products = ref(null);
const isPreview = ref(false);
const data = inject("data");

function closePreview() {
  isPreview.value = false;
}
const getProducts = async () => {
  const response = await sendRequest({
    method: "get",
    url: "/frontend/v1/products-search",
    params: {
      search: search.value,
    },
  });
  if (response) {
    products.value = response.data?.data;
    isPreview.value = true;
  }
};
onClickOutside(target, () => {
  isPreview.value = false;
});

onMounted(() => {
  window.scrollTo(0, 0);
  getProducts();
});

watch(search, getProducts, { deep: true });
</script>
<template>
  <div
    class="flex items-center justify-between relative border border-primary/15 my-3 w-full hover:border-secondary/15 bg-white"
  >
    <!-- Search Input -->
    <input
      v-model="search"
      type="text"
      class="py-2 pl-3 focus:outline-0 w-full text-sm sm:text-base"
      placeholder="Search...."
      @focus="isPreview = true"
    />

    <!-- Search Button -->
    <RouterLink
      :to="{
        path: '/products',
        query: { search: search },
      }"
      class="-ml-[49px] h-full bg-primary border hover:border-primary/35 hover:text-primary text-white flex items-center font-marcellus gap-2 py-2 px-4 sm:px-6 hover:bg-secondary"
    >
      <Icon name="radix-icons:magnifying-glass" class="text-xl lg:text-2xl" />
    </RouterLink>

    <!-- Search Preview Box -->
    <div
      v-if="isPreview && search"
      ref="target"
      class="absolute top-12 sm:top-14 left-0 right-0 w-full h-[70vh] max-h-[600px] overflow-y-auto bg-white z-30 shadow-lg rounded-md pt-10"
    >
      <!-- Top Bar with Info + Close -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 absolute top-0 right-0 left-0 bg-white border-b gap-1 sm:gap-0"
      >
        <p class="text-sm sm:text-base">Searching for: "{{ search }}"</p>
        <div class="flex items-center gap-2">
          <p class="text-sm sm:text-base">
            {{ products.length }} results found
          </p>
          <button
            @click="closePreview"
            class="text-gray-500 hover:text-red-500 transition"
            title="Close"
          >
            <Icon name="mdi:close" class="text-xl sm:text-2xl" />
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="products?.length === 0"
        class="w-full h-full p-4 sm:p-5 flex flex-col items-center gap-3 sm:gap-4"
      >
        <p class="text-center text-sm sm:text-lg">
          Oops! It looks like we don't have what you're looking for. Please
          search again with different keywords.
        </p>
        <RouterLink
          to="/products"
          class="text-blue-600 flex items-center gap-1 text-sm sm:text-base"
        >
          All Products
          <Icon
            name="material-symbols:arrow-right-alt-rounded"
            class="text-lg sm:text-xl"
          />
        </RouterLink>
      </div>

      <!-- Search Results -->
      <div v-else class="flex flex-col gap-1 sm:gap-2">
        <RouterLink
          v-for="product in products"
          :key="product.id"
          :to="`/product/${product?.slug}`"
          class="flex gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-slate-100"
        >
          <img
            class="w-12 sm:w-16 min-h-12 sm:min-h-16 h-auto"
            :src="product?.cover_image_url"
            alt="Product"
          />
          <div class="flex flex-col justify-center">
            <h3 class="text-sm sm:text-base line-clamp-1">
              {{ product?.title }}
            </h3>
            <p class="text-xs sm:text-sm">
              {{ data?.currency_symbol }} {{ product?.price }}
            </p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
