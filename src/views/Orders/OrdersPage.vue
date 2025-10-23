<script setup>
import { ref, onMounted, watch } from "vue";
import useAxios from "@/composables/useAxios";

import { useAuthStore } from "@/stores/useAuthStore.js";
const authStore = useAuthStore();
const { loading, error, sendRequest } = useAxios();
// const products = ref(null);
const extractPage = (url) => {
  if (!url) return 1;

  const match = url.match(/page=(\d+)/);
  return match ? parseInt(match[1]) : 1;
};
const orders = ref(null);
const search = ref("");

const getOrders = async (query = "", page = 1) => {
  const response = await sendRequest({
    method: "get",
    url: `/v1/order?search=${query}&page=${page}`,
  });
  if (response) {
    orders.value = response?.data;
  }
};


const updateOrderStatus = async (orderId, newStatus) => {
  const response = await sendRequest({
    method: "post",
    url: `/v1/order/${orderId}`,
    data: {
      order_status: newStatus,
      _method: "PUT",
    },
  });
  if (response) {
    getOrders();
  }

}

onMounted(() => {
  getOrders();
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900">Order Management</h2>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div
        class="p-5 border-b border-gray-100 flex justify-between items-center"
      >
        <h3 class="font-semibold text-gray-900">
          All Orders ({{ orders?.length}})
        </h3>
        <div class="flex items-center gap-2">
          <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
          </select>
          <input
            type="text"
            placeholder="Search orders..."
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
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

            <tr v-for="order in orders" :key="order?.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ order?.order_code }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order?.created_at }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ currency_symbol }}{{ order?.sub_total }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ currency_symbol }}{{ order?.shipping_charge }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ currency_symbol }}{{ order?.grand_total }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  :value="order?.order_status"
                  @change="updateOrderStatus(order.id, $event.target.value)"
                  class="rounded-full text-xs font-medium px-2.5 py-0.5 border-0 focus:ring-2 focus:ring-primary/50"
                  :class="{
                    'bg-gray-100 text-gray-800': order?.order_status === 'pending',
                    'bg-yellow-100 text-yellow-800':
                      order?.order_status === 'process',
                    'bg-blue-100 text-blue-800': order?.order_status === 'shipped',
                    'bg-green-100 text-green-800': order?.order_status === 'delivered',
                  }"
                >
                  <option value="pending">Pending</option>
                  <option value="process">Processing</option>
                  <option value="shipped">Shipped</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-primary hover:text-primary/80">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
