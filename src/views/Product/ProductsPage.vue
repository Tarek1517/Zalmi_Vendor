<script setup>
import { ref } from "vue";
// Products
const products = ref([
  {
    id: 1,
    name: "Premium Pro X 5G Smartphone",
    price: 799.99,
    stock: 15,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=60",
    sales: 42,
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 149.99,
    stock: 32,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
    sales: 28,
  },
  {
    id: 3,
    name: "Smart Watch Series 5",
    price: 299.99,
    stock: 8,
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    sales: 19,
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 89.99,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60",
    sales: 24,
  },
]);

const currency_symbol = "$";

// New product form
const newProduct = ref({
  name: "",
  price: "",
  stock: "",
  description: "",
  category: "",
});

// Add new product function
const addProduct = () => {
  products.value.push({
    id: products.value.length + 1,
    name: newProduct.value.name,
    price: parseFloat(newProduct.value.price),
    stock: parseInt(newProduct.value.stock),
    status: "Published",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    sales: 0,
  });
  
  // Reset form
  newProduct.value = {
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
  };
};

</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Product Management</h2>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
      >
        <Icon name="ph:plus" />
        Add Product
      </button>
    </div>

    <!-- Add Product Form -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-4">Add New Product</h3>
      <form @submit.prevent="addProduct" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Product Name</label
            >
            <input
              v-model="newProduct.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Price</label
            >
            <input
              v-model="newProduct.price"
              type="number"
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter price"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Stock Quantity</label
            >
            <input
              v-model="newProduct.stock"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter stock quantity"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Category</label
            >
            <select
              v-model="newProduct.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Kitchen</option>
              <option value="sports">Sports & Outdoors</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <textarea
              v-model="newProduct.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter product description"
              required
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="reset"
            class="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>

    <!-- Products List -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div
        class="p-5 border-b border-gray-100 flex justify-between items-center"
      >
        <h3 class="font-semibold text-gray-900">
          All Products ({{ products.length }})
        </h3>
        <input
          type="text"
          placeholder="Search products..."
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sales
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img
                      class="h-10 w-10 rounded-md object-cover"
                      :src="product.image"
                      :alt="product.name"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ currency_symbol }}{{ product.price.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.stock }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800':
                      product.status === 'Published',
                    'bg-yellow-100 text-yellow-800':
                      product.status === 'Low Stock',
                    'bg-red-100 text-red-800':
                      product.status === 'Out of Stock',
                  }"
                >
                  {{ product.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.sales }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-primary hover:text-primary/80 mr-3">
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
