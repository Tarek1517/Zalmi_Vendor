<script setup>
import SummernoteEditor from "vue3-summernote-editor";
import { ref, onMounted, computed, inject } from "vue";
import useAxios from "@/composables/useAxios";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore } from "@/stores/useAuthStore.js";
const authStore = useAuthStore();
const { loading, error, sendRequest } = useAxios();
const router = useRouter();
const setting = inject("setting");

// Form state
const variant = ref(false);
const status = ref(true);
const featured = ref(false);
const trackInventory = ref(true);
const form = ref({
  title: null,
  price: null,
  cost_price: null,
  vendor_id: authStore?.vendor?.id,
  category_id: null,
  brand_id: 3,
  discount_price: 0,
  stock: 1,
  low_stock_threshold: 5,
  cover_image: null,
  product_info: null,
  short_description: null,
  specification: null,
  status: computed(() => (status.value ? 1 : 0)),
  is_variant: computed(() => (variant.value ? 1 : 0)),
  featured: computed(() => (featured.value ? 1 : 0)),
  track_inventory: computed(() => (trackInventory.value ? 1 : 0)),
  images: [],
  key_features: [
    {
      name: null,
    },
  ],
});

const parentCategories = ref([]);

const getParentCategories = async () => {
  try {
    const res = await sendRequest({
      method: "get",
      url: "/v1/parent/category", // this should return nested categories
    });

    const allCats = res?.data?.data || [];
    parentCategories.value = flattenCategories(allCats);
  } catch (err) {
    console.error(err);
  }
};

// Recursive flatten function
const flattenCategories = (categories, level = 0) => {
  const result = [];
  for (const cat of categories) {
    result.push({
      id: cat.id,
      name: `${"— ".repeat(level)}${cat.name}`,
    });

    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategories(cat.children, level + 1));
    }
  }
  return result;
};

// Image handling
const coverImg = ref(null);
const coverImage = (image) => {
  const file = image.target.files[0];
  form.value.cover_image = file;
  coverImg.value = URL.createObjectURL(file);
};

const hoverImg = ref(null);
const hoverImage = (image) => {
  const file = image.target.files[0];
  form.value.hover_image = file;
  hoverImg.value = URL.createObjectURL(file);
};

const handleFileChange = (event) => {
  for (let i = 0; i < event.target.files.length; i++) {
    form.value.images.push({
      url: URL.createObjectURL(event.target.files[i]),
      file: event.target.files[i],
    });
  }
};

const removeMedia = (index) => {
  let removedImage = form.value.images[index];
  if (removedImage.url.startsWith("blob:")) {
    URL.revokeObjectURL(removedImage.url);
  }
  form.value.images.splice(index, 1);
};

// Key features management
const addItem = () => {
  form.value.key_features.push({
    name: null,
  });
};

const removeItem = (index) => form.value.key_features.splice(index, 1);

// Tags management
const tagInput = ref("");
const addTag = () => {
  if (
    tagInput.value.trim() &&
    !form.value.tags.includes(tagInput.value.trim())
  ) {
    form.value.tags.push(tagInput.value.trim());
    tagInput.value = "";
  }
};

const removeTag = (index) => {
  form.value.tags.splice(index, 1);
};

// Save Product
const onSubmit = async () => {
  const response = await sendRequest({
    method: "post",
    url: "/v1/product",
    data: form.value,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (response?.data) {
    toast.success(`${response?.data?.name} Product Added Successfully`, {
      autoclose: 1000,
    });
    await router.push("/dashboard/products");
  }
};

onMounted(() => {
  getParentCategories();
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
            <h1 class="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p class="text-gray-600 mt-2">
              Create and customize your product details
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="router.push('/dashboard/products')"
              class="px-6 py-2.5 border border-primary/25 rounded-lg text-primary hover:bg-gray-50 transition-all duration-200 font-medium flex items-center gap-2"
            >
              <Icon name="heroicons:arrow-left" class="w-4 h-4" />
              Back
            </button>
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
                    <input
                      type="text"
                      v-model="form.brand_id"
                      class="w-full px-4 py-3.5 pl-10 border border-primary/25 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder-gray-400"
                      placeholder="Brand name"
                    />
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
            class="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden"
          >
            <div
              class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-100 to-white"
            >
              <div class="flex items-center">
                <div
                  class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4"
                >
                  <Icon
                    name="heroicons:document-text"
                    class="w-5 h-5 text-blue-500"
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
                <Icon
                  name="heroicons:cube"
                  class="w-5 h-5 mr-2 text-primary"
                />
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
              <h2 class="text-lg font-semibold text-primary flex items-center">
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
                        class="w-10 h-10 text-gray-400 mx-auto mb-3"
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

              <!-- Gallery Images -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images
                </label>
                <div
                  class="border-2 border-dashed border-primary/25 rounded-xl p-4 hover:border-primary transition-colors duration-200 bg-gray-50/50"
                  :class="{ 'border-primary': form.images.length > 0 }"
                >
                  <input
                    @change="handleFileChange"
                    id="gallery_images"
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                  />
                  <label for="gallery_images" class="cursor-pointer block">
                    <div class="text-center py-4">
                      <Icon
                        name="heroicons:cloud-arrow-up"
                        class="w-8 h-8 text-gray-400 mx-auto mb-2"
                      />
                      <p class="text-sm text-gray-600 mb-1">
                        Click to upload multiple images
                      </p>
                      <p class="text-xs text-gray-500">
                        PNG, JPG up to 5MB each
                      </p>
                    </div>
                  </label>

                  <!-- Image Previews -->
                  <div
                    class="grid grid-cols-3 gap-3 mt-4"
                    v-if="form.images.length > 0"
                  >
                    <div
                      v-for="(image, index) in form.images"
                      :key="index"
                      class="relative group"
                    >
                      <img
                        :src="image.url"
                        class="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        @click="removeMedia(index)"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                      >
                        <Icon name="heroicons:x-mark" class="w-3 h-3" />
                      </button>
                    </div>
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

<style scoped>

</style>
