<script setup>
import Modal from "@/components/Modal.vue";
import { useCartStore } from "@/stores/useCartStore.js";
import { inject, ref, reactive, computed, onMounted } from "vue";

const datas = inject("data");
const setting = inject("data");
const cartStore = useCartStore();

const selectedSize = ref(null);
const selectedCrust = ref(null); // ✅ single select crust
const selectedToppings = ref([]);
const selectedextraoptions = ref([]);
const buyQty = ref(1);

// reactive object for extra products per category
const selectedextraProduct = reactive({});

const props = defineProps({
  data: Object,
});

// ✅ Select first size by default if available
onMounted(() => {
  if (props.data?.size_toppings?.length && !selectedSize.value) {
    selectedSize.value = props.data.size_toppings[0];
  }

  // Initialize selectedextraProduct per category
  props.data?.variation_category_id?.forEach((cat) => {
    if (!selectedextraProduct[cat.id]) selectedextraProduct[cat.id] = [];
  });
});

// Computed: Flatten selected extra products across categories
const selectedextraProductName = computed(() => {
  return Object.values(selectedextraProduct)
    .flat()
    .map((prod) => prod.title);
});

// Compute selected topping names
const selectedToppingNames = computed(() => {
  const toppingsList =
    selectedSize.value?.toppings || props.data?.toppings || [];

  return toppingsList
    .filter((t) => selectedToppings.value.includes(t.id))
    .map((t) => t.title);
});

// Total price including selected crust and toppings
const totalPrice = computed(() => {
  const base = parseFloat(
    selectedSize.value?.price ||
      props.data?.discount_price ||
      props.data?.price ||
      0
  );

  const crustsTotal = selectedCrust.value
    ? parseFloat(selectedCrust.value.price || 0)
    : 0;

  const allToppings =
    selectedSize.value?.toppings || props.data?.toppings || [];

  const selectedToppingObjects = allToppings.filter((t) =>
    selectedToppings.value.includes(t.id)
  );

  const toppingsTotal = selectedToppingObjects.reduce((sum, t) => {
    return sum + parseFloat(t.price || 0);
  }, 0);

  const extraOptionsTotal = selectedextraoptions.value.reduce(
    (sum, optionObj) => {
      const optionPrice = parseFloat(optionObj.options?.price || 0);
      return sum + optionPrice;
    },
    0
  );

  // Note: Do not add extra product price here (per your request)
  const total = base + crustsTotal + toppingsTotal + extraOptionsTotal;

  return parseFloat(total.toFixed(2));
});

// Add product to cart
const addToCart = () => {
  cartStore.addToCart({
    product: {
      id: props.data.id,
      title: props.data.title,
      cover_image: props.data.cover_image_url,

      // Size
      size: selectedSize.value?.size?.name,
      size_id: selectedSize.value?.id,

      // Extra Product
      extra_product: selectedextraProductName.value || null,
      extra_product_id: Object.values(selectedextraProduct)
        .flat()
        .map((prod) => prod.id),

      // ✅ Crusts (single select)
      crusts: selectedCrust.value ? [selectedCrust.value.name] : [],
      crust_ids: selectedCrust.value ? [selectedCrust.value.id] : [],

      // Toppings
      selected_toppings: selectedToppings.value,
      selected_toppings_name: selectedToppingNames.value,

      // Extra Options
      extra_option: selectedextraoptions.value.map((c) => c.options?.name),
      extra_option_id: selectedextraoptions.value.map((c) => c.options?.id),

      // Pricing & quantity
      price: totalPrice.value,
      quantity: buyQty.value,
    },
  });

  closeModal();
};

// Modal control
const isModalOpened = ref(false);
const openModal = () => {
  isModalOpened.value = true;
};
const closeModal = () => {
  isModalOpened.value = false;
};
</script>

<template>
  <div
    class="relative flex flex-col justify-between h-full w-full bg-white shadow-sm border hover:shadow-md group"
  >
    <!-- Product Image -->
    <RouterLink
      :to="`/product/${data?.slug}`"
      class="group relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-80 lg:h-80 overflow-hidden bg-gray-100 mb-5 rounded-full mx-auto"
    >
      <div class="w-full h-auto overflow-hidden rounded-full">
        <img
          :src="data?.cover_image_url"
          alt="Product"
          loading="lazy"
          class="w-full h-full object-contain transition-transform duration-500 ease-in-out group-hover:rotate-45 rounded-full"
        />
      </div>
    </RouterLink>

    <!-- Key Features -->
    <div
      v-if="
        data?.key_features &&
        !(data.key_features.length === 1 && data.key_features[0].name === null)
      "
      class="flex flex-col gap-2 absolute left-2 sm:left-3 md:left-6 lg:left-8 top-2 sm:top-3 md:top-6 lg:top-8 transition-all ease-in-out duration-500 max-w-[90%] sm:max-w-none"
    >
      <ul class="flex flex-wrap gap-2 sm:gap-3 justify-start">
        <li
          v-for="item in data.key_features"
          :key="item?.name"
          class="flex items-center gap-1.5 sm:gap-2 bg-primary/90 hover:bg-primary text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-marcellus text-[10px] sm:text-xs uppercase tracking-wider shadow-md transition-colors duration-300 whitespace-nowrap select-none"
        >
          <Icon
            name="material-symbols:kid-star-sharp"
            class="text-base sm:text-lg"
          />
          {{ item?.name }}
        </li>
      </ul>
    </div>

    <!-- Product Info -->
    <div class="pb-3 flex flex-col gap-2 px-2 sm:px-4">
      <!-- Product Title -->
      <RouterLink
        :to="`/product/${data?.slug}`"
        class="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-black hover:text-primary transition"
      >
        {{ data?.title }}
      </RouterLink>

      <!-- Category -->
      <RouterLink
        :to="{
          path: '/products',
          query: { category: data?.category?.slug },
        }"
        class="text-xs sm:text-sm text-gray-500 uppercase tracking-wide hover:underline"
      >
        {{ data?.category?.name }}
      </RouterLink>

      <!-- Price -->
      <div class="pb-4 mt-auto">
        <p class="text-sm sm:text-base font-bold text-gray-800">
          <template v-if="data?.price > 0">
            <span class="line-through text-base sm:text-lg text-gray-500 mr-2">
              {{ datas.currency_symbol }}{{ data?.price }}
            </span>
            <span class="text-primary text-lg sm:text-xl md:text-2xl">
              {{ datas.currency_symbol }}{{ data?.discount_price }}
            </span>
          </template>
          <template v-else>
            <span class="text-primary text-lg sm:text-xl md:text-2xl">
              {{ setting.currency_symbol }}{{ data?.discount_price }}
            </span>
          </template>
        </p>
      </div>
    </div>

    <!-- Add to Cart Button -->
    <div class="w-full mt-2">
      <div
        v-if="
          props.data?.size_toppings?.length > 0 ||
          props.data?.crusts?.length > 0 ||
          data?.variation_category_id?.length > 0 ||
          props.data?.extra_options
        "
      >
        <button
          @click="openModal"
          class="w-full py-2 sm:py-3 bg-primary hover:bg-secondary border hover:border-primary/35 text-white hover:text-primary font-bold text-center flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
        >
          <img
            class="w-6 sm:w-7 md:w-8 h-auto"
            :src="datas?.logo_light"
            alt="Logo"
          />
          Add to Cart
        </button>
      </div>
      <div v-else>
        <button
          @click="addToCart"
          class="w-full py-2 sm:py-3 bg-primary hover:bg-secondary border hover:border-primary/35 text-white hover:text-primary font-bold text-center flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
        >
          <img
            class="w-6 sm:w-7 md:w-8 h-auto"
            :src="datas?.logo_light"
            alt="Logo"
          />
          Add to Cart
        </button>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <Modal
    title=" Please select Variation and Extra Toppings"
    :isOpen="isModalOpened"
    @modal-close="closeModal"
  >
    <div class="h-auto pb-11 px-4 sm:px-6 md:px-10">
      <div class="w-full flex flex-col items-start justify-start">
        <div class="flex flex-wrap items-center my-5 text-base sm:text-lg">
          <span
            v-if="data?.price"
            class="line-through text-gray-500 text-sm sm:text-base md:text-lg mr-2"
          >
            {{ datas?.currency_symbol }}{{ data?.price }}
          </span>
          <span class="font-bold text-2xl sm:text-3xl md:text-4xl text-primary">
            {{ datas?.currency_symbol }}{{ totalPrice }}
          </span>
        </div>

        <div v-if="data?.size_toppings?.length">
          <h2 class="text-xs sm:text-sm font-semibold py-4 sm:py-5">Size:</h2>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="size in data?.size_toppings"
              :key="size.id"
              class="cursor-pointer"
            >
              <input
                type="radio"
                class="hidden peer"
                name="product-size"
                :value="size"
                v-model="selectedSize"
              />
              <span
                class="border text-xs sm:text-sm md:text-base text-primary bg-secondary border-primary/35 px-3 sm:px-4 py-2 transition peer-checked:text-white peer-checked:border-primary peer-checked:bg-primary"
              >
                {{ size.size?.name }}
              </span>
            </label>
          </div>
        </div>

        <!-- ✅ Crust Single Select -->
        <div
          v-if="selectedSize?.crusts?.length || data?.crusts?.length"
          class="mt-4"
        >
          <h3 class="text-sm sm:text-base md:text-lg font-semibold mb-2">
            Choose Crust
          </h3>
          <div class="grid gap-2">
            <label
              v-for="crust in selectedSize?.crusts || data?.crusts"
              :key="crust.id"
              class="cursor-pointer border gap-2 text-xs sm:text-sm md:text-base text-primary bg-secondary border-primary/35 px-3 sm:px-4 py-2 flex items-center"
            >
              <input
                type="radio"
                name="product-crust"
                :value="crust"
                v-model="selectedCrust"
                class="accent-primary"
              />
              <span>
                {{ crust.name }} (+{{ datas?.currency_symbol
                }}{{ crust.price }})
              </span>
            </label>
          </div>
        </div>

        <!-- Extra Options -->
        <div v-if="data?.extra_options?.length">
          <h2 class="text-xs sm:text-sm font-semibold py-4 sm:py-5">
            Extra Options:
          </h2>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="options in data?.extra_options"
              :key="options.id"
              class="cursor-pointer border text-xs sm:text-sm md:text-base text-primary bg-secondary border-primary/35 px-3 sm:px-4 py-2 flex items-center"
            >
              <input
                type="checkbox"
                v-model="selectedextraoptions"
                :value="options"
                class="accent-primary mr-2"
              />
              {{ options.options?.name
              }}<span
                v-if="options.options?.price && options.options?.price != 0"
              >
                (+{{ datas?.currency_symbol }}{{ options.options?.price }})
              </span>
            </label>
          </div>
        </div>

        <!-- Extra Toppings -->
        <div v-if="selectedSize?.toppings?.length" class="mt-4">
          <h3 class="text-sm sm:text-base md:text-lg font-semibold mb-2">
            Choose Extra Toppings
          </h3>
          <div class="grid gap-2">
            <label
              v-for="topping in selectedSize?.toppings || data?.toppings"
              :key="topping.id"
              class="cursor-pointer border gap-2 text-xs sm:text-sm md:text-base text-primary bg-secondary border-primary/35 px-3 sm:px-4 py-2 flex items-center"
            >
              <input
                type="checkbox"
                :value="topping.id"
                v-model="selectedToppings"
                class="accent-primary"
              />
              <span>
                {{ topping.title }} (+{{ datas?.currency_symbol
                }}{{ topping.price }} )
              </span>
            </label>
          </div>
        </div>

        <div v-if="props.data?.variation_category_id?.length" class="mt-4">
          <template
            v-for="cat in props.data.variation_category_id"
            :key="cat.id"
          >
            <label class="block font-semibold mb-1">
              {{ cat.name }} (max {{ cat.extra_value || 1 }} selected)
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <label
                v-for="prod in cat.categories_i_d?.products || []"
                :key="prod.id"
                class="cursor-pointer border text-primary bg-secondary border-primary/35 px-3 py-2 flex items-center text-sm sm:text-base gap-2"
              >
                <input
                  type="checkbox"
                  :value="prod"
                  v-model="selectedextraProduct[cat.id]"
                  class="accent-primary"
                  :disabled="
                    (selectedextraProduct[cat.id]?.length || 0) >=
                      (cat.extra_value || 1) &&
                    !(selectedextraProduct[cat.id] || []).includes(prod)
                  "
                />
                <span>{{ prod.title }}</span>
              </label>
            </div>
          </template>
        </div>

        <div class="mt-4 w-full">
          <button
            @click="addToCart"
            class="w-full py-2 sm:py-3 bg-primary hover:bg-secondary border hover:border-primary/35 text-white hover:text-primary font-bold text-center flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
          >
            <img
              class="w-6 sm:w-7 md:w-8 h-auto"
              :src="datas?.logo_light"
              alt="Logo"
            />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>
