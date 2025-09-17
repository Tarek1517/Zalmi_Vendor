<script setup>
import { ref } from "vue";
// Statistics data
const stats = ref([
  {
    title: "Total Revenue",
    value: "$28,500.75",
    icon: "ph:currency-dollar",
    trend: "+12.3%",
    trendDirection: "up",
    color: "bg-green-500",
  },
  {
    title: "Total Orders",
    value: "128",
    icon: "ph:shopping-cart",
    trend: "+8.2%",
    trendDirection: "up",
    color: "bg-blue-500",
  },
  {
    title: "Conversion Rate",
    value: "4.8%",
    icon: "ph:trend-up",
    trend: "+1.2%",
    trendDirection: "up",
    color: "bg-purple-500",
  },
  {
    title: "Avg. Order Value",
    value: "$222.66",
    icon: "ph:chart-bar",
    trend: "+$15.50",
    trendDirection: "up",
    color: "bg-amber-500",
  },
]);

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

// Performance data
const performanceData = ref({
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  sales: [12, 19, 14, 15, 18, 22, 25, 28, 30, 32],
  revenue: [1800, 3150, 2700, 2850, 3420, 4180, 4750, 5320, 5700, 6375],
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900">Store Overview</h2>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="bg-white rounded-xl shadow-sm p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ stat.title }}</p>
            <p class="text-xl font-bold text-gray-900">{{ stat.value }}</p>
            <p
              class="text-xs mt-1"
              :class="{
                'text-green-600': stat.trendDirection === 'up',
                'text-red-600': stat.trendDirection === 'down',
                'text-gray-600': stat.trendDirection === 'neutral',
              }"
            >
              {{ stat.trend }}
            </p>
          </div>
          <div :class="['p-3 rounded-lg', stat.color]">
            <Icon :name="stat.icon" class="text-2xl text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Chart -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-semibold text-gray-900">Monthly Performance</h3>
        <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>2023</option>
          <option>2022</option>
        </select>
      </div>

      <div class="h-64 flex items-end gap-2 justify-between pt-8">
        <div
          v-for="(month, index) in performanceData.labels"
          :key="index"
          class="flex flex-col items-center flex-1"
        >
          <div class="text-xs text-gray-500 mb-2">{{ month }}</div>
          <div class="flex items-end justify-center gap-1 w-full">
            <div
              class="w-full bg-blue-200 rounded-t hover:bg-blue-300 transition-colors"
              :style="{ height: `${performanceData.sales[index] * 3}px` }"
              :title="`${performanceData.sales[index]} sales`"
            ></div>
            <div
              class="w-full bg-green-200 rounded-t hover:bg-green-300 transition-colors"
              :style="{ height: `${performanceData.revenue[index] / 30}px` }"
              :title="`$${performanceData.revenue[index]} revenue`"
            ></div>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-4 mt-4">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-blue-200 rounded"></div>
          <span class="text-sm text-gray-600">Sales</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-green-200 rounded"></div>
          <span class="text-sm text-gray-600">Revenue</span>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-100">
        <h3 class="font-semibold text-gray-900">Recent Orders</h3>
      </div>
      <div class="divide-y divide-gray-100">
        <div
          v-for="order in recentOrders.slice(0, 5)"
          :key="order.id"
          class="p-5"
        >
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-gray-900">{{ order.order_code }}</h4>
              <p class="text-sm text-gray-500">
                {{ order.customer }} • {{ order.items }} items
              </p>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">
                {{ currency_symbol }}{{ order.amount.toFixed(2) }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': order.status === 'Delivered',
                    'bg-blue-100 text-blue-800': order.status === 'Shipped',
                    'bg-yellow-100 text-yellow-800':
                      order.status === 'Processing',
                    'bg-gray-100 text-gray-800': order.status === 'Pending',
                  }"
                >
                  {{ order.status }}
                </span>
                <p class="text-sm text-gray-500">{{ order.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-5 border-t border-gray-100 bg-gray-50">
        <NuxtLink
          to="#"
          class="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
        >
          <span>View all orders</span>
          <Icon name="ph:arrow-right" class="text-lg" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
