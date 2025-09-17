<script setup>
import { ref } from "vue";

const currency_symbol = "$";
const payouts = ref([
  {
    id: 1,
    date: "2023-10-15",
    amount: 1250.5,
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: 2,
    date: "2023-09-30",
    amount: 980.25,
    method: "PayPal",
    status: "Completed",
  },
  {
    id: 3,
    date: "2023-09-15",
    amount: 1120.75,
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: 4,
    date: "2023-10-20",
    amount: 450.25,
    method: "Bank Transfer",
    status: "Pending",
  },
]);

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

// Request payout
const requestPayout = () => {
  if (vendor.value.pending_balance > 0) {
    payouts.value.unshift({
      id: payouts.value.length + 1,
      date: new Date().toISOString().split("T")[0],
      amount: vendor.value.pending_balance,
      method: "Bank Transfer",
      status: "Pending",
    });

    vendor.value.balance += vendor.value.pending_balance;
    vendor.value.pending_balance = 0;

    alert("Payout requested successfully!");
  } else {
    alert("No pending balance available for payout.");
  }
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900">Earnings & Payouts</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Balance Summary -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Balance Summary</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Available Balance</span>
            <span class="font-bold text-green-600"
              >{{ currency_symbol }}{{ vendor.balance.toFixed(2) }}</span
            >
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Pending Balance</span>
            <span class="font-bold text-amber-600"
              >{{ currency_symbol
              }}{{ vendor.pending_balance.toFixed(2) }}</span
            >
          </div>
          <div
            class="flex justify-between items-center pt-4 border-t border-gray-100"
          >
            <span class="text-gray-900 font-medium">Total Earnings</span>
            <span class="font-bold text-blue-600"
              >{{ currency_symbol }}{{ vendor.total_revenue.toFixed(2) }}</span
            >
          </div>
        </div>
        <button
          @click="requestPayout"
          class="w-full mt-6 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
        >
          Request Payout
        </button>
      </div>

      <!-- Payout Methods -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Payout Methods</h3>
        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Icon name="ph:bank" class="text-xl" />
              </div>
              <div>
                <p class="font-medium">Bank Transfer</p>
                <p class="text-sm text-gray-500">**** **** **** 1234</p>
              </div>
            </div>
            <button class="text-primary hover:text-primary/80 text-sm">
              Edit
            </button>
          </div>

          <div
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Icon name="ph:credit-card" class="text-xl" />
              </div>
              <div>
                <p class="font-medium">PayPal</p>
                <p class="text-sm text-gray-500">john.doe@example.com</p>
              </div>
            </div>
            <button class="text-primary hover:text-primary/80 text-sm">
              Edit
            </button>
          </div>
        </div>
        <button
          class="w-full mt-4 px-4 py-2.5 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2"
        >
          <Icon name="ph:plus" class="text-lg" />
          Add Payout Method
        </button>
      </div>
    </div>

    <!-- Payout History -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-100">
        <h3 class="font-semibold text-gray-900">Payout History</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
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
                Method
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
            <tr v-for="payout in payouts" :key="payout.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ payout.date }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600"
              >
                {{ currency_symbol }}{{ payout.amount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ payout.method }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800':
                      payout.status === 'Completed',
                    'bg-yellow-100 text-yellow-800':
                      payout.status === 'Pending',
                  }"
                >
                  {{ payout.status }}
                </span>
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
