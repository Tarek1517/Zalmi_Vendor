<script setup>
import SummernoteEditor from "vue3-summernote-editor";
import { ref, onMounted, computed } from "vue";
import useAxios from "@/composables/useAxios";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "@/stores/useAuthStore.js";

const authStore = useAuthStore();
const { sendRequest, loading } = useAxios();
const router = useRouter();
const route = useRoute();

// === Toggles ===
const status = ref(false);
const featured = ref(false);
const trackInventory = ref(false);
const variant = ref(false);

// === Image States ===
const coverImg = ref(null);
const hoverImg = ref(null);
const prevImages = ref([]); // previously uploaded images

// === Categories ===
const parentCategories = ref([]);
const getParentCategories = async () => {
  try {
    const res = await sendRequest({
      method: "get",
      url: "/v1/parent/categories",
    });
    const allCats = res?.data?.data || [];
    parentCategories.value = flattenCategories(allCats);
  } catch (err) {
    console.error(err);
  }
};

const flattenCategories = (categories, level = 0) => {
  const result = [];
  categories.forEach((cat) => {
    result.push({ id: cat.id, name: `${"— ".repeat(level)}${cat.name}` });
    if (cat.children?.length)
      result.push(...flattenCategories(cat.children, level + 1));
  });
  return result;
};

// === Form ===
const form = ref({
  id: null,
  title: null,
  price: 0,
  cost_price: 0,
  vendor_id: authStore?.vendor?.vendor?.id || null,
  category_id: null,
  brand_id: null,
  discount_price: 0,
  stock: 1,
  low_stock_threshold: 5,
  cover_image: null,
  hover_image: null,
  product_info: null,
  short_description: null,
  specification: null,
  newImages: [],
  images: [],
  key_features: [{ name: null }],
  status: computed(() => (status.value ? 1 : 0)),
  is_variant: computed(() => (variant.value ? 1 : 0)),
  featured: computed(() => (featured.value ? 1 : 0)),
  track_inventory: computed(() => (trackInventory.value ? 1 : 0)),
});

// === Load Product ===
const getProduct = async () => {
  try {
    const response = await sendRequest({
      method: "get",
      url: `/v1/product/${route.params.slug}`,
    });
    const data = response.data?.data;
    if (!data) return;

    // Map data to form
    form.value.id = data.id;
    form.value.title = data.title || "";
    form.value.price = data.price || 0;
    form.value.cost_price = data.cost_price || 0;
    form.value.category_id = data.category_id || null;
    form.value.brand_id = data.brand_id || 0;
    form.value.discount_price = data.discount_price || 0;
    form.value.stock = data.stock || 1;
    form.value.low_stock_threshold = data.low_stock_threshold || 5;
    form.value.short_description = data.short_description || "";
    form.value.product_info = data.product_info || "";
    form.value.specification = data.specification || "";
    form.value.key_features = data.key_features?.length
      ? data.key_features
      : [{ name: null }];
    form.value.newImages = [];
    form.value.images =
      data.images?.map((img) => ({
        id: img.id,
        url: img.image_url || img.url,
      })) || [];

    // Cover & hover
    coverImg.value = data.cover_image_url || null;
    hoverImg.value = data.hover_image_url || null;

    // Previous images
    prevImages.value = form.value.images;

    // Toggles
    status.value = data.status === 1 || data.status === true;
    featured.value = data.featured === 1 || data.featured === true;
    trackInventory.value =
      data.track_inventory === 1 || data.track_inventory === true;
    variant.value = data.is_variant === 1 || data.is_variant === true;
  } catch (error) {
    toast.error("Failed to load product data");
  }
};
const brands = ref(null);
const getBrands = async () => {
  try {
    const res = await sendRequest({
      method: "get",
      url: "/v1/brands", // this should return nested categories
    });

    brands.value = res?.data?.data || [];
  } catch (err) {
    console.error(err);
  }
};

// === Image Handlers ===
const coverImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.cover_image = file;
    coverImg.value = URL.createObjectURL(file);
  }
};

// Multiple image upload
const handleFileChange = (event) => {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    form.value.newImages.push({ url: URL.createObjectURL(file), file });
  }
};

const removeMedia = (index) => {
  const removed = form.value.newImages[index];
  if (removed?.url?.startsWith("blob:")) URL.revokeObjectURL(removed.url);
  form.value.newImages.splice(index, 1);
};

// === Key Features ===
const addItem = () => form.value.key_features.push({ name: null });
const removeItem = (index) => {
  if (form.value.key_features.length > 1)
    form.value.key_features.splice(index, 1);
};

// === Submit ===
const onSubmit = async () => {
  const formData = new FormData();

  // Append boolean toggles
  formData.append("status", status.value ? 1 : 0);
  formData.append("featured", featured.value ? 1 : 0);
  formData.append("track_inventory", trackInventory.value ? 1 : 0);
  formData.append("is_variant", variant.value ? 1 : 0);

  // Append form fields
  for (const key in form.value) {
    if (key === "newImages") {
      form.value.newImages.forEach(({ file }) =>
        formData.append("newImages[]", file)
      );
    } else if (key === "key_features") {
      form.value.key_features.forEach((kf, i) =>
        formData.append(`key_features[${i}][name]`, kf.name || "")
      );
    } else if (
      form.value[key] !== null &&
      form.value[key] !== undefined &&
      !["images", "cover_image", "hover_image"].includes(key)
    ) {
      formData.append(key, form.value[key]);
    }
  }

  // Append cover & hover
  if (form.value.cover_image)
    formData.append("cover_image", form.value.cover_image);
  if (form.value.hover_image)
    formData.append("hover_image", form.value.hover_image);

  try {
    await sendRequest({
      method: "post",
      url: `/v1/product/${form.value.id}`,
      data: formData,
      params: { _method: "PUT" },
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Product updated successfully", { autoClose: 1000 });
    router.push("/dashboard/products");
  } catch (error) {
    toast.error("Failed to update product");
  }
};

// === Delete Previous Image ===
const deleteProductImage = async (id) => {
  const response = await sendRequest({
    method: "get",
    url: `/v1/delete-product-image/${id}`,
  });
  if (response) {
    toast.success("Product image deleted successfully", { autoclose: 1000 });
    getProduct();
  }
};

// === Lifecycle ===
onMounted(() => {
  getParentCategories();
  getProduct();
  getBrands();
});
</script>

<template>
  <Loading :value="loading" />

  <div class="min-h-screen bg-gray-50 py-8">
    <div class="w-full">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p class="text-gray-600 mt-2">Update your product details</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Basic Information Card -->
          <div
            class="bg-white rounded-xl shadow-sm border border-primary/25 overflow-hidden"
          >
            <div
              class="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/15 to-white"
            >
              <div class="flex items-center">
                <div
                  class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4"
                >
                  <Icon
                    name="heroicons:information-circle"
                    class="w-5 h-5 text-primary"
                  />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    Basic Information
                  </h2>
                  <p class="text-sm text-gray-600 mt-1">
                    Essential product details and pricing
                  </p>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-6">
              <!-- Product Title -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  Product Title
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <div class="relative">
                  <input
                    type="text"
                    v-model="form.title"
                    class="w-full px-4 py-3.5 border border-primary/25 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder-gray-400"
                    placeholder="Enter product name"
                  />
                  <div class="absolute right-3 top-3.5 text-gray-400">
                    <Icon name="heroicons:tag" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Pricing -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    Regular Price
                    <span class="text-red-500 ml-1">*</span>
                  </label>
                  <div class="relative">
                    <input
                      type="number"
                      v-model="form.price"
                      class="w-full px-4 py-3.5 pl-10 border border-primary/25 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <div class="absolute left-3 top-3.5 text-gray-400">
                      <Icon name="heroicons:currency-dollar" class="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Discount Price
                  </label>
                  <div class="relative">
                    <input
                      type="number"
                      v-model="form.discount_price"
                      class="w-full px-4 py-3.5 pl-10 border border-primary/25 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <div class="absolute left-3 top-3.5 text-gray-400">
                      <Icon name="heroicons:receipt-percent" class="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Category & Brand -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div class="relative">
                    <select
                      v-model="form.category_id"
                      class="w-full px-4 py-3.5 pl-10 rounded-xl border border-primary/25 focus:ring-2 focus:ring-primary/30 focus:border-transparent transition-all appearance-none"
                    >
                      <option :value="null">Select Category</option>
                      <option
                        v-for="cat in parentCategories"
                        :key="cat.id"
                        :value="cat.id"
                      >
                        {{ cat.name }}
                      </option>
                    </select>
                    <div
                      class="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                    >
                      <Icon name="heroicons:rectangle-stack" class="w-5 h-5" />
                    </div>
                    <div
                      class="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                    >
                      <Icon name="heroicons:chevron-down" class="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <div class="relative">
                    <select
                      v-model="form.brand_id"
                      class="w-full px-4 py-3.5 pl-10 border border-primary/25 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder-gray-400 appearance-none"
                    >
                      <!-- Nullable option -->
                      <option :value="null">Select Brand (optional)</option>

                      <!-- Dynamic options -->
                      <option
                        v-for="brand in brands"
                        :key="brand.id"
                        :value="brand.id"
                      >
                        {{ brand.name }}
                      </option>
                    </select>

                    <div class="absolute left-3 top-3.5 text-gray-400">
                      <Icon
                        name="heroicons:building-storefront"
                        class="w-5 h-5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Short Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  v-model="form.short_description"
                  rows="3"
                  class="w-full px-4 py-3.5 border border-primary/25 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder-gray-400"
                  placeholder="Brief product description that will appear in product listings..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Key Features Card -->
          <div
            class="bg-white rounded-xl shadow-sm border border-primary/25 overflow-hidden"
          >
            <div
              class="p-6 border-b border-primary/25 bg-gradient-to-r from-primary/15 to-white"
            >
              <div class="flex items-center">
                <div
                  class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mr-4"
                >
                  <Icon
                    name="heroicons:sparkles"
                    class="w-5 h-5 text-secondary"
                  />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    Key Features
                  </h2>
                  <p class="text-sm text-gray-600 mt-1">
                    Highlight the most important product features
                  </p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="(item, index) in form.key_features"
                  :key="index"
                  class="flex items-center gap-3"
                >
                  <div class="flex-1 relative">
                    <input
                      type="text"
                      v-model="item.name"
                      class="w-full px-4 py-3.5 pl-10 border border-primary/25 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder-gray-400"
                      placeholder="Enter feature"
                    />
                    <div class="absolute left-3 top-3.5 text-gray-400">
                      <Icon name="heroicons:check-badge" class="w-5 h-5" />
                    </div>
                  </div>
                  <button
                    @click="removeItem(index)"
                    v-if="form.key_features.length > 1"
                    class="p-3.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  >
                    <Icon name="heroicons:trash" class="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                @click="addItem"
                class="mt-5 flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 rounded-xl transition-colors duration-200 border border-dashed border-primary/25 hover:border-primary w-full justify-center"
              >
                <Icon name="heroicons:plus-circle" class="w-5 h-5" />
                Add Feature
              </button>
            </div>
          </div>

          <!-- Description & Specification -->
          <div
            class="bg-white rounded-xl shadow-sm border border-primary/25 overflow-hidden"
          >
            <div
              class="p-6 border-b border-primary/25 bg-gradient-to-r from-primary/15 to-white"
            >
              <div class="flex items-center">
                <div
                  class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mr-4"
                >
                  <Icon
                    name="heroicons:document-text"
                    class="w-5 h-5 text-primary"
                  />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">Content</h2>
                  <p class="text-sm text-gray-600 mt-1">
                    Detailed product information and specifications
                  </p>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Product Description
                </label>
                <SummernoteEditor v-model="form.product_info" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Specifications
                </label>
                <SummernoteEditor v-model="form.specification" />
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Status Card -->
          <div
            class="bg-white rounded-xl shadow-sm border border-primary/25 overflow-hidden"
          >
            <div
              class="p-5 border-b border-primary/25 bg-gradient-to-r from-primary/15 to-white"
            >
              <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                <Icon name="heroicons:eye" class="w-5 h-5 mr-2 text-primary" />
                Visibility
              </h2>
            </div>
            <div class="p-5 space-y-5">
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <Icon
                    name="heroicons:globe-alt"
                    class="w-5 h-5 text-gray-500 mr-3"
                  />
                  <div>
                    <label class="text-sm font-medium text-gray-700"
                      >Published</label
                    >
                    <p class="text-xs text-gray-500">
                      Product will be visible to customers
                    </p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="status"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                  ></div>
                </label>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <Icon
                    name="heroicons:star"
                    class="w-5 h-5 text-amber-500 mr-3"
                  />
                  <div>
                    <label class="text-sm font-medium text-gray-700"
                      >Featured</label
                    >
                    <p class="text-xs text-gray-500">Highlight this product</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="featured"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"
                  ></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Inventory Card -->
          <div
            class="bg-white rounded-xl shadow-sm border border-primary/25 overflow-hidden"
          >
            <div
              class="p-5 border-b border-primary/25 bg-gradient-to-r from-primary/15 to-white"
            >
              <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                <Icon name="heroicons:cube" class="w-5 h-5 mr-2 text-primary" />
                Inventory
              </h2>
            </div>
            <div class="p-5 space-y-5">
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <Icon
                    name="heroicons:chart-bar"
                    class="w-5 h-5 text-gray-500 mr-3"
                  />
                  <div>
                    <label class="text-sm font-medium text-gray-700"
                      >Track Inventory</label
                    >
                    <p class="text-xs text-gray-500">Monitor stock levels</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="trackInventory"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                  ></div>
                </label>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <div class="relative">
                  <input
                    type="number"
                    v-model="form.stock"
                    class="w-full px-4 py-3 border border-primary/25 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    min="0"
                  />
                  <div class="absolute right-3 top-3 text-gray-400">
                    <Icon name="heroicons:archive-box" class="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <div class="relative">
                  <input
                    type="number"
                    v-model="form.low_stock_threshold"
                    class="w-full px-4 py-3 border border-primary/25 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    min="0"
                  />
                  <div class="absolute right-3 top-3 text-gray-400">
                    <Icon
                      name="heroicons:exclamation-triangle"
                      class="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Images Card -->
          <div
            class="bg-white rounded-xl shadow-sm border border-primary/25 overflow-hidden"
          >
            <div
              class="p-5 border-b border-primary/25 bg-gradient-to-r from-primary/15 to-white"
            >
              <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                <Icon
                  name="heroicons:photo"
                  class="w-5 h-5 mr-2 text-primary"
                />
                Media
              </h2>
            </div>
            <div class="p-5 space-y-5">
              <!-- Cover Image -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  Cover Image
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <div
                  class="border-2 border-dashed border-primary/25 rounded-xl p-4 text-center hover:border-primary transition-colors duration-200 cursor-pointer bg-gray-50/50"
                  :class="{ 'border-primary': coverImg }"
                >
                  <input
                    type="file"
                    id="cover_image"
                    hidden
                    @change="coverImage"
                    accept="image/*"
                  />
                  <label for="cover_image" class="cursor-pointer block">
                    <div v-if="!coverImg" class="py-6">
                      <Icon
                        name="heroicons:photo"
                        class="w-10 h-10 text-primary mx-auto mb-3"
                      />
                      <p class="text-sm text-gray-600 mb-1">
                        Upload cover image
                      </p>
                      <p class="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                    <div v-else class="relative">
                      <img
                        :src="coverImg"
                        class="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        @click="coverImg = null"
                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <Icon name="heroicons:x-mark" class="w-3 h-3" />
                      </button>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Previous Images -->
              <div class="w-full" v-if="prevImages.length">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Current Images
                  </label>
                  <div class="flex flex-wrap gap-3">
                    <div
                      v-for="(image, index) in prevImages"
                      :key="image.id || index"
                      class="relative w-24 h-24 border rounded-md overflow-hidden group"
                    >
                      <img
                        :src="image.url"
                        class="object-cover w-full h-full"
                        alt="Previous Image"
                      />
                      <button
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        @click="deleteProductImage(image.id)"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- New Images Upload -->
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images
                </label>
                <div
                  class="border-2 border-dashed border-primary/25 rounded-xl p-4 hover:border-primary transition-colors duration-200 bg-gray-50/50"
                  :class="{ 'border-primary': form.newImages.length > 0 }"
                >
                  <div class="file-upload-container">
                    <div
                      class="file-upload-container-wrapper flex flex-wrap gap-3"
                    >
                      <!-- NEW IMAGES PREVIEW -->
                      <div
                        v-for="(image, index) in form.newImages"
                        :key="index"
                        class="relative w-24 h-24 border rounded-md overflow-hidden group"
                      >
                        <img
                          :src="image.url"
                          class="object-cover w-full h-full"
                          alt="New Image"
                        />
                        <button
                          type="button"
                          class="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          @click="removeMedia(index)"
                        >
                          ✕
                        </button>
                      </div>

                      <!-- UPLOAD BUTTON -->
                      <div class="file-upload-container-wrapper__add">
                        <input
                          @change="handleFileChange"
                          id="mu-file-input"
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                        />
                        <label
                          for="mu-file-input"
                          class="cursor-pointer block w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center hover:border-primary transition-colors duration-200 bg-white"
                        >
                          <span class="text-primary mb-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="{2}"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </span>
                          <span class="text-xs text-gray-500">Upload</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 text-center">
                    <p class="text-sm text-gray-600 mb-1">
                      Click to upload multiple images
                    </p>
                    <p class="text-xs text-gray-500">
                      PNG, JPG, JPEG up to 999KB each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button at Bottom -->
      <div
        class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky bottom-4 z-10"
      >
        <div class="flex items-center justify-end gap-4">
          <button
            @click="onSubmit"
            class="px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-primary/20"
          >
            <Icon name="heroicons:check" class="w-5 h-5" />
            Save Product
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
