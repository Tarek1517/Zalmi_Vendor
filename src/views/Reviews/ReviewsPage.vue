<script setup>
import { ref } from "vue";
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
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900">Customer Reviews</h2>

    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-semibold text-gray-900">Overall Rating</h3>
          <div class="flex items-center gap-3 mt-2">
            <div class="flex items-center gap-1 text-amber-500">
              <Icon name="ph:star-fill" class="text-2xl" />
              <span class="text-2xl font-bold text-gray-900">{{
                vendor.rating
              }}</span>
            </div>
            <span class="text-gray-500"
              >based on {{ vendor.reviews_count }} reviews</span
            >
          </div>
        </div>
        <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>All Stars</option>
          <option>5 Stars</option>
          <option>4 Stars</option>
          <option>3 Stars</option>
          <option>2 Stars</option>
          <option>1 Star</option>
        </select>
      </div>

      <div class="space-y-6">
        <div
          class="flex items-start gap-4 p-4 border border-gray-100 rounded-lg"
        >
          <div
            class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Icon name="ph:user" class="text-xl text-gray-600" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">Sarah Johnson</h4>
              <span class="text-sm text-gray-500">2023-10-15</span>
            </div>
            <div class="flex items-center gap-1 text-amber-500 mb-2">
              <Icon name="ph:star-fill" v-for="n in 5" :key="n" />
            </div>
            <p class="text-gray-700">
              Excellent product! The smartphone arrived quickly and was exactly
              as described. Would definitely buy from this store again.
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Product: Premium Pro X 5G Smartphone
            </p>
          </div>
        </div>

        <div
          class="flex items-start gap-4 p-4 border border-gray-100 rounded-lg"
        >
          <div
            class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Icon name="ph:user" class="text-xl text-gray-600" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">Mike Chen</h4>
              <span class="text-sm text-gray-500">2023-10-14</span>
            </div>
            <div class="flex items-center gap-1 text-amber-500 mb-2">
              <Icon name="ph:star-fill" v-for="n in 4" :key="n" />
              <Icon name="ph:star" />
            </div>
            <p class="text-gray-700">
              Good product but shipping took longer than expected. The item
              itself is high quality though.
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Product: Wireless Earbuds Pro
            </p>
          </div>
        </div>

        <div
          class="flex items-start gap-4 p-4 border border-gray-100 rounded-lg"
        >
          <div
            class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Icon name="ph:user" class="text-xl text-gray-600" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">Emma Wilson</h4>
              <span class="text-sm text-gray-500">2023-10-10</span>
            </div>
            <div class="flex items-center gap-1 text-amber-500 mb-2">
              <Icon name="ph:star-fill" v-for="n in 5" :key="n" />
            </div>
            <p class="text-gray-700">
              Absolutely love my new smartwatch! The battery life is impressive
              and it has all the features I need.
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Product: Smart Watch Series 5
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <button
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Load More Reviews
        </button>
      </div>
    </div>
  </div>
</template>
