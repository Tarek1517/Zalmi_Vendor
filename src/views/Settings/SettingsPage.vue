<script setup>
import { ref } from "vue";
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
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900">Store Settings</h2>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-100">
        <h3 class="font-semibold text-gray-900">Store Information</h3>
        <p class="text-sm text-gray-500">
          Update your store details and preferences
        </p>
      </div>

      <form class="p-5 space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Store Name</label
            >
            <input
              type="text"
              :value="vendor.store_name"
              class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Store URL</label
            >
            <div class="flex rounded-lg">
              <span
                class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
              >
                example.com/
              </span>
              <input
                type="text"
                :value="vendor.store_slug"
                class="flex-1 block w-full px-3 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700"
            >Store Description</label
          >
          <textarea
            rows="4"
            class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            placeholder="Describe your store for customers"
          >
Tech Haven offers the latest gadgets and electronics with fast shipping and excellent customer service.</textarea
          >
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700"
            >Store Logo</label
          >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center"
            >
              <Icon name="ph:image" class="text-2xl text-gray-400" />
            </div>
            <div>
              <button
                type="button"
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium"
              >
                Upload Image
              </button>
              <p class="text-xs text-gray-500 mt-1">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-gray-100">
          <h4 class="text-lg font-medium text-gray-900 mb-4">Store Policies</h4>

          <div class="space-y-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700"
                >Return Policy</label
              >
              <textarea
                rows="3"
                class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                placeholder="Describe your return policy"
              >
We accept returns within 30 days of purchase. Items must be in original condition with all tags attached.</textarea
              >
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700"
                >Shipping Policy</label
              >
              <textarea
                rows="3"
                class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                placeholder="Describe your shipping policy"
              >
We ship orders within 1-2 business days. Standard shipping takes 3-5 business days, expedited shipping available.</textarea
              >
            </div>
          </div>
        </div>

        <div class="pt-5 flex justify-end">
          <button
            class="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
