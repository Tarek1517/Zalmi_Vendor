<template>
  <div
    class="bg-gradient-to-r from-zalmi-primary to-zalmi-secondary p-4 shadow-lg"
  >
    <div
      class="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between"
    >
      <!-- Logo and Brand -->
      <div class="flex items-center space-x-2 mb-4 md:mb-0">
        <img
          src="@/assets/images/logo.png"
          alt="Affiliate Logo"
          class="h-10 mx-auto lg:mx-0 mb-4"
        />
      </div>

      <!-- Navigation -->
      <nav
        class="flex flex-wrap justify-center gap-6 md:gap-10 text-sm md:text-base"
      >
        <a href="/" class="hover:text-yellow-300 transition-colors font-medium"
          >Home</a
        >
        <a
          href="/affiliate"
          class="hover:text-yellow-300 transition-colors font-medium"
          >Affiliate Program</a
        >
        <a
          href="/players"
          class="hover:text-yellow-300 transition-colors font-medium"
          >Terms & Condition</a
        >
        <a
          href="/matches"
          class="hover:text-yellow-300 transition-colors font-medium"
          >Privacy & Policy</a
        >
      </nav>

      <!-- User Actions -->
      <div class="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
        <button
          class="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-secondary transition-colors"
        >
          Join Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// no script needed for static header
</script>
