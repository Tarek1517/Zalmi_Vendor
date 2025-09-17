<script setup>
import { ref } from "vue";
// Recent orders
const recentOrders = ref([
  {
    id: 1,
    order_code: "ORD-2023-1056",
    customer: "Sarah Johnson",
    date: "2023-10-15",
    status: "Delivered",
    amount: 249.99,
    items: 2,
  },
  {
    id: 2,
    order_code: "ORD-2023-1055",
    customer: "Mike Chen",
    date: "2023-10-14",
    status: "Shipped",
    amount: 149.99,
    items: 1,
  },
  {
    id: 3,
    order_code: "ORD-2023-1054",
    customer: "Emma Wilson",
    date: "2023-10-14",
    status: "Processing",
    amount: 399.99,
    items: 3,
  },
  {
    id: 4,
    order_code: "ORD-2023-1053",
    customer: "David Kim",
    date: "2023-10-13",
    status: "Pending",
    amount: 99.99,
    items: 1,
  },
]);

// Update order status
const updateOrderStatus = (orderId, newStatus) => {
  const order = recentOrders.value.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
  }
};

</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900">Order Management</h2>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div
        class="p-5 border-b border-gray-100 flex justify-between items-center"
      >
        <h3 class="font-semibold text-gray-900">
          All Orders ({{ recentOrders.length }})
        </h3>
        <div class="flex items-center gap-2">
          <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
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
                Customer
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
            <tr v-for="order in recentOrders" :key="order.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ order.order_code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.customer }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ currency_symbol }}{{ order.amount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  :value="order.status"
                  @change="updateOrderStatus(order.id, $event.target.value)"
                  class="rounded-full text-xs font-medium px-2.5 py-0.5 border-0 focus:ring-2 focus:ring-primary/50"
                  :class="{
                    'bg-gray-100 text-gray-800': order.status === 'Pending',
                    'bg-yellow-100 text-yellow-800':
                      order.status === 'Processing',
                    'bg-blue-100 text-blue-800': order.status === 'Shipped',
                    'bg-green-100 text-green-800': order.status === 'Delivered',
                  }"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
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
