<script setup>
import { ref, onMounted, watch } from "vue";
import useAxios from "@/composables/useAxios";
import Modal2 from "@/components/Modal2.vue";
import SummernoteEditor from "vue3-summernote-editor";
import { toast } from "vue3-toastify";
const { loading, error, sendRequest } = useAxios();
// const products = ref(null);
const extractPage = (url) => {
  if (!url) return 1;

  const match = url.match(/page=(\d+)/);
  return match ? parseInt(match[1]) : 1;
};
const products = ref(null);
const search = ref("");

const getProducts = async (query = "", page = 1) => {
  const response = await sendRequest({
    method: "get",
    url: `/v1/product?search=${query}&page=${page}`,
  });
  if (response) {
    products.value = response?.data?.data;
  }
};

const isDeleteModalOpened = ref(false);
const deleteProductId = ref(null);
const deleteProductName = ref("");

const deleteProduct = (id) => {
  const prod = products.value.find((p) => p.id === id);
  deleteProductId.value = id;
  deleteProductName.value = prod?.name || "this product"; // fallback
  isDeleteModalOpened.value = true;
};

const confirmDelete = async () => {
  if (!deleteProductId.value) return;

  try {
    await sendRequest({
      method: "delete",
      url: `/v1/product/${deleteProductId.value}`,
    });

    toast.success(`🗑️ ${deleteProductName.value} deleted successfully`, {
      autoClose: 1500,
      theme: "dark",
    });

    await getProducts(); // refresh the products list
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete product");
  } finally {
    closeModal();
  }
};

const closeModal = () => {
  isDeleteModalOpened.value = false;
  deleteProductId.value = null;
  deleteProductName.value = "";
};

onMounted(() => {
  getProducts();
});

watch(search, (newValue) => {
  getProducts(newValue, 1);
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Product Management</h2>
      <router-link to="/dashboard/create-product">
        <button
          class="flex items-center gap-2 px-4 py-2 cursor-pointer bg-primary hover:bg-primary/90 text-white rounded-lg"
        >
          <Icon name="ph:plus" />
          Add Product
        </button>
      </router-link>
    </div>

    <!-- Products List -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div
        class="p-5 border-b border-gray-100 flex justify-between items-center"
      >
        <input
          type="text"
          id="table-search"
          v-model="search"
          placeholder="Search products..."
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock Status
              </th>

              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img
                      class="h-10 w-10 rounded-md object-cover"
                      :src="product.cover_image_url"
                      :alt="product.title"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="font-medium text-gray-900">
                      {{ product.title }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.price }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.stock }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800':
                      product.stock > product.low_stock_threshold * 1.2,
                    'bg-yellow-100 text-yellow-800':
                      product.stock > product.low_stock_threshold &&
                      product.stock <= product.low_stock_threshold * 1.2,
                    'bg-red-100 text-red-800':
                      product.stock <= product.low_stock_threshold,
                  }"
                >
                  {{
                    product.stock <= product.low_stock_threshold
                      ? "Out of Stock"
                      : product.stock <= product.low_stock_threshold * 1.2
                      ? "Low Stock"
                      : "In Stock"
                  }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    product.status === true || product.status === 'true'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{
                    product.status === true || product.status === "true"
                      ? "Active"
                      : "Inactive"
                  }}
                </span>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end gap-2">
                  <RouterLink
                    :to="`/edit-product/${product?.slug}`"
                    class="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-100"
                    title="Edit brand"
                  >
                    <Icon name="heroicons:pencil-square" class="w-5 h-5" />
                  </RouterLink>
                  <button
                    @click="deleteProduct(product.id)"
                    class="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Delete product"
                  >
                    <Icon name="heroicons:trash" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal2
      title="Delete Product"
      :isOpen="isDeleteModalOpened"
      @modal-close="closeModal"
      size="sm"
    >
      <div class="p-6 text-center">
        <Icon
          name="heroicons:exclamation-triangle"
          class="mx-auto text-red-500 w-12 h-12 mb-3"
        />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Are you sure you want to delete {{ deleteProductName }}?
        </h3>
        <p class="text-sm text-gray-500 mb-6">This action cannot be undone.</p>

        <div class="flex justify-center gap-3">
          <button
            @click="closeModal"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </Modal2>
  </div>
</template>
