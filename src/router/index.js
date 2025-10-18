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
          component: () => import("@/views/Product/index.vue"),
        },

        {
          path: "create-product",
          name: "CreateProduct",
          component: () => import("@/views/Product/Add.vue"),
        },

        {
          path: "/edit-product/:slug",
          name: "EditProduct",
          component: () => import("@/views/Product/Edit.vue"),
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
        {
          path: "bankDetails",
          name: "BankDetails",
          component: () => import("@/views/BankDetails/BankDetailsPage.vue"),
        },
      ],
    },
    { path: "/", name: "Home", component: () => import("@/views/index.vue") },
  ],
});

export default router;
