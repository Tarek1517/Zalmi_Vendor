import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "@/components/layouts/DashboardLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/dashboard",
      component: DashboardLayout,
      children: [
        {
          path: "",
          name: "DashboardHome",
          component: () => import("@/views/dashboard/DashboardPage.vue"),
        },
        {
          path: "products",
          name: "Products",
          component: () => import("@/views/Product/ProductsPage.vue"),
        },
        {
          path: "orders",
          name: "Orders",
          component: () => import("@/views/Orders/OrdersPage.vue"),
        },
        {
          path: "earnings",
          name: "Earnings",
          component: () => import("@/views/Earnings/EarningsPage.vue"),
        },
        {
          path: "settings",
          name: "Settings",
          component: () => import("@/views/Settings/SettingsPage.vue"),
        },
        {
          path: "reviews",
          name: "Reviews",
          component: () => import("@/views/Reviews/ReviewsPage.vue"),
        },
      ],
    },
    { path: "/", name: "Home", component: () => import("@/views/index.vue") },
    
  ],
});

export default router;
