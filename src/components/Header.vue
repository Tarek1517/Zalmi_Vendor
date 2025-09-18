<template>
  <div class="bg-white/95 py-2 backdrop-blur-sm border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <div class="flex items-center space-x-2">
            <img
              src="@/assets/images/logo.png"
              alt="Vendor Portal"
              class="h-8 w-auto transition-transform duration-200 hover:scale-105"
            />
            
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-6">
          <router-link
            to="/"
            class="text-gray-700 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50/80"
            active-class="text-primary bg-blue-50/50"
          >
            Home
          </router-link>

          <router-link
            to="/affiliate"
            class="text-gray-700 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50/80"
            active-class="text-primary bg-blue-50/50"
          >
            Vendor Program
          </router-link>

          <router-link
            to="/players"
            class="text-gray-700 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50/80"
            active-class="text-primary bg-blue-50/50"
          >
            Terms & Conditions
          </router-link>

          <router-link
            to="/matches"
            class="text-gray-700 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50/80"
            active-class="text-primary bg-blue-50/50"
          >
            Privacy Policy
          </router-link>
        </nav>

        <!-- Right side items -->
        <div class="flex items-center space-x-3">
          <!-- Notifications -->
          <button
            class="relative p-2.5 text-primary transition-all duration-200 hover:bg-primary/25 rounded-lg"
          >
            <Icon name="ph:bell" class="text-lg" />
            <span
              class="absolute top-1.5 right-1.5 bg-red-500 rounded-full w-2 h-2 border border-white"
            ></span>
          </button>

          <!-- User menu -->
          <div class="relative">
            <button
              class="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-primary/15 to-primary/55 flex items-center justify-center shadow-sm"
              >
                <span class="text-primary font-semibold text-sm">A</span>
              </div>
              <span class="hidden md:block text-gray-600"
                >Vendor Account</span
              >
              <Icon name="ph:caret-down" class="text-lg text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            class="p-2.5 text-gray-500 hover:text-blue-600 transition-all duration-200 hover:bg-gray-100 rounded-lg"
          >
            <Icon name="ph:list" class="text-xl" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// no script needed for static header
</script>
