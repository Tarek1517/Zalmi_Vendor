<template>
  <router-view :key="routeKey"></router-view>
</template>
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const routeKey = computed(() => route.path + "-" + JSON.stringify(route.query));

import { useAuthStore } from "./stores/useAuthStore";
import { onMounted } from "vue";
const authStore = useAuthStore();
onMounted(async () => {
  await authStore.fetchUser();
});
</script>

<style>
@import "tailwindcss";
@theme {
  --color-primary: #ff2b85;
  --color-secondary: #cc226a;
}
</style>
