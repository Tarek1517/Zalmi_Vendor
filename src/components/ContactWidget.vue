<script setup>
import Icon from "@/components/Icon.vue";

defineProps({
  title: String,
  value: String,
  icon: String,
});
</script>

<template>
  <div
    class="flex items-center gap-3 bg-primary/15 lg:p-5 md:p-4 p-3 rounded-lg shadow-lg hover:bg-secondary/15 sm:flex-row flex-col sm:items-center lg:items-start"
  >
    <span
      class="flex items-center justify-center lg:size-12 md:size-10 size-9 bg-primary rounded-lg shadow-lg hover:bg-secondary group"
    >
      <Icon
        :name="icon"
        class="text-white lg:text-3xl md:text-2xl text-xl group-hover:text-primary"
      />
    </span>

    <div class="lg:text-left sm:text-left text-center">
      <h4 class="text-black text-sm sm:text-base font-bold mb-1">
        {{ title }}
      </h4>
      <p class="text-gray-800 text-xs sm:max-w-40 max-w-full">{{ value }}</p>
    </div>
  </div>
</template>
