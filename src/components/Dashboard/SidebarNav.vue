<script setup>
</script>

<template>
  <nav class="bg-white rounded-xl shadow-sm overflow-hidden">
    <ul>
      <!-- Dashboard -->
      <li>
        <router-link
          to="/dashboard"
          class="w-full px-5 py-4 text-left flex items-center gap-3 border-l-4"
          :class="$route.path === '/dashboard' 
            ? 'border-primary bg-primary/20 text-primary font-semibold' 
            : 'border-transparent text-gray-700 hover:bg-gray-50 font-medium'"
        >
          <Icon name="ph:gauge" class="text-lg" />
          Dashboard
        </router-link>
      </li>

      <!-- Products -->
      <li>
        <router-link
          to="/dashboard/products"
          class="w-full px-5 py-4 text-left flex items-center gap-3 border-l-4"
          :class="$route.path.startsWith('/dashboard/products') 
            ? 'border-primary bg-primary/20 text-primary font-semibold' 
            : 'border-transparent text-gray-700 hover:bg-gray-50 font-medium'"
        >
          <Icon name="ph:package" class="text-lg" />
          Products
        </router-link>
      </li>

      <!-- Orders -->
      <li>
        <router-link
          to="/dashboard/orders"
          class="w-full px-5 py-4 text-left flex items-center gap-3 border-l-4"
          :class="$route.path.startsWith('/dashboard/orders') 
            ? 'border-primary bg-primary/20 text-primary font-semibold' 
            : 'border-transparent text-gray-700 hover:bg-gray-50 font-medium'"
        >
          <Icon name="ph:shopping-cart" class="text-lg" />
          Orders
        </router-link>
      </li>

      <!-- Earnings -->
      <li>
        <router-link
          to="/dashboard/earnings"
          class="w-full px-5 py-4 text-left flex items-center gap-3 border-l-4"
          :class="$route.path.startsWith('/dashboard/earnings') 
            ? 'border-primary bg-primary/20 text-primary font-semibold' 
            : 'border-transparent text-gray-700 hover:bg-gray-50 font-medium'"
        >
          <Icon name="ph:currency-dollar" class="text-lg" />
          Earnings
        </router-link>
      </li>

      <!-- Store Settings -->
      <li>
        <router-link
          to="/dashboard/settings"
          class="w-full px-5 py-4 text-left flex items-center gap-3 border-l-4"
          :class="$route.path.startsWith('/dashboard/settings') 
            ? 'border-primary bg-primary/20 text-primary font-semibold' 
            : 'border-transparent text-gray-700 hover:bg-gray-50 font-medium'"
        >
          <Icon name="ph:storefront" class="text-lg" />
          Store Settings
        </router-link>
      </li>

      <!-- Reviews -->
      <li>
        <router-link
          to="/dashboard/reviews"
          class="w-full px-5 py-4 text-left flex items-center gap-3 border-l-4"
          :class="$route.path.startsWith('/dashboard/reviews') 
            ? 'border-primary bg-primary/20 text-primary font-semibold' 
            : 'border-transparent text-gray-700 hover:bg-gray-50 font-medium'"
        >
          <Icon name="ph:star" class="text-lg" />
          Reviews
        </router-link>
      </li>
    </ul>
  </nav>
</template>

