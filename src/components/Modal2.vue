<script setup>
import { defineProps, defineEmits, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  isOpen: Boolean,
  title: String,
});

const emit = defineEmits(["modal-close"]);

// Optional: Close modal with ESC key
const handleKeydown = (e) => {
  if (e.key === "Escape" && props.isOpen) {
    emit("modal-close");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <transition name="scale-up">
        <div
          v-if="isOpen"
          class="relative w-full max-w-3xl rounded-xl bg-gradient-to-br from-white to-gray-50/95 shadow-2xl border border-white/60 overflow-hidden"
          style="max-height: 85vh"
        >
          <!-- Glassmorphism effect overlay -->
          <div
            class="absolute inset-0 bg-white/10 backdrop-blur-sm -z-10"
          ></div>

          <!-- Decorative elements -->
          <div
            class="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-sm"
          ></div>
          <div
            class="absolute -bottom-10 -left-10 w-28 h-28 bg-secondary/20 rounded-full blur-sm"
          ></div>

          <!-- Header -->
          <div
            class="flex items-center justify-center px-7 pt-5 pb-3 border-b border-white/40 bg-gradient-to-r from-white/70 to-white/30"
          >
            <h3
              class="font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center"
            >
              {{ title }}
            </h3>
          </div>

          <!-- Body -->
          <div class="p-6 text-gray-700 overflow-auto" style="max-height: 65vh">
            <slot></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* Fade background with enhanced effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale up modal with slight bounce */
.scale-up-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-up-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.scale-up-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.scale-up-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
