<script setup>
import SummernoteEditor from "vue3-summernote-editor";
import { ref, onMounted, inject } from "vue";
import useAxios from "@/composables/useAxios";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";

const { loading, error, sendRequest } = useAxios();

const router = useRouter();
const route = useRoute();
const setting = inject("setting");

// Reactive states
const hoverImg = ref(null);
const prevImages = ref([]); // initialize as array, not null
const coverImg = ref(null);

const form = ref({
  id: null,
  title: "",
  price: 0,
  category_id: null,
  brand_id: null,
  video_url: "",
  sku: "",
  discount_price: 0,
  stock: 1,
  cover_image: null,
  hover_image: null,
  product_info: "",
  short_description: "",
  specification: "",
  newImages: [],
  key_features: [{ name: "" }],
});

const getProduct = async () => {
  const response = await sendRequest({
    method: "get",
    url: `/v1/product/${route.params.slug}`,
  });

  const data = response.data;

  form.value.id = data.id;
  form.value.title = data.title || "";
  form.value.price = data.price || 0;
  form.value.category_id = data.category_id || null;
  form.value.brand_id = data.brand_id || null;
  form.value.video_url = data.video_url || "";
  form.value.sku = data.sku || "";
  form.value.discount_price = data.discount_price || 0;
  form.value.stock = data.stock || 1;
  form.value.short_description = data.short_description || "";
  form.value.product_info = data.product_info || "";
  form.value.specification = data.specification || "";
  form.value.key_features = data.key_features?.length
    ? data.key_features
    : [{ name: "" }];

  prevImages.value = data.images || [];
  coverImg.value = data.cover_image || null;
  hoverImg.value = data.hover_image || null;
};

const extraToppings = ref([]);
const getExtratoppings = async () => {
  const response = await sendRequest({
    method: "get",
    url: "/v1/extraToppings",
  });
  extraToppings.value = response?.data || [];
};

const coverImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.cover_image = file;
    coverImg.value = URL.createObjectURL(file);
  }
};

const hoverImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.hover_image = file;
    hoverImg.value = URL.createObjectURL(file);
  }
};

// handle multiple image upload
const handleFileChange = (event) => {
  for (let i = 0; i < event.target.files.length; i++) {
    const file = event.target.files[i];
    form.value.newImages.push({
      url: URL.createObjectURL(file),
      file,
    });
  }
};

const removeMedia = (index) => {
  const removedImage = form.value.newImages[index];
  if (removedImage?.url?.startsWith("blob:")) {
    URL.revokeObjectURL(removedImage.url);
  }
  form.value.newImages.splice(index, 1);
};

const addItem = () => {
  form.value.key_features.push({ name: "" });
};
const removeItem = (index) => {
  if (form.value.key_features.length > 1) {
    form.value.key_features.splice(index, 1);
  }
};

// Save Product
const onSubmit = async (id) => {
  const formData = new FormData();

  // Append form fields
  for (const key in form.value) {
    if (key === "newImages") {
      form.value.newImages.forEach(({ file }) => {
        formData.append("newImages[]", file);
      });
    } else if (key === "key_features") {
      form.value.key_features.forEach((kf, i) => {
        formData.append(`key_features[${i}][name]`, kf.name || "");
      });
    } else if (form.value[key] !== null && form.value[key] !== undefined) {
      formData.append(key, form.value[key]);
    }
  }

  try {
    const response = await sendRequest({
      method: "post",
      url: `/v1/product/${id}`,
      data: formData,
      params: {
        _method: "PUT",
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response?.data) {
      toast.success(`${response.data.title || "Product"} added successfully`, {
        autoclose: 1000,
      });
      router.push("/products");
    }
  } catch (e) {
    toast.error("Failed to save product");
  }
};

const deleteProductImage = async (id) => {
  const response = await sendRequest({
    method: "get",
    url: `/v1/delete-product-image/${id}`,
  });

  if (response) {
    toast.success("Product image deleted successfully", { autoclose: 1000 });
    getProduct();
  }
};

const getToppingName = (id) => {
  const found = extraToppings.value.find((t) => t.id === id);
  return found ? found.title : `Topping ${id}`;
};

onMounted(async () => {
  await getExtratoppings();
  await getProduct();
});
</script>

<template>
  <Loading :value="loading" />
  <div class="p-4 shadow-lg rounded-lg bg-white max-w-4xl mx-auto">
    <h3 class="mb-8 text-2xl font-bold text-primary text-center uppercase">
      Add New Product
    </h3>

    <div class="flex flex-wrap">
      <div class="w-full flex flex-col gap-3">
        <div class="w-full">
          <label for="title" class="text-xs mb-1">Product Title</label>
          <input
            type="text"
            class="border border-gray-300 p-2 w-full text-sm"
            v-model="form.title"
          />
        </div>
        <div class="w-full flex flex-wrap">
          <div class="w-1/2 pr-3">
            <label for="price" class="text-xs mb-1">Price</label>
            <input
              type="number"
              class="border border-gray-300 p-2 w-full text-sm"
              v-model="form.price"
            />
          </div>
          <div class="w-1/2 pr-3">
            <label for="discount" class="text-xs mb-1">Discount Price</label>
            <input
              type="number"
              class="border border-gray-300 p-2 w-full text-sm"
              v-model="form.discount_price"
            />
          </div>
        </div>
        <div class="w-full flex items-center space-x-5">
          <div class="w-full">
            <label for="category" class="text-xs mb-1">Category</label>
            <Select
              label="name"
              v-if="setting?.all_categories"
              :options="setting?.all_categories"
              :reduce="(item) => item.id"
              :searchable="true"
              v-model="form.category_id"
              placeholder="Set Category"
            >
              <template v-slot:option="option">
                <li class="flex items-start py-1">
                  <div class="flex items-center justify-between w-full">
                    <div class="me-1 flex items-center gap-2">
                      <img :src="option?.icon" class="w-12 h-12" />
                      <h6 class="mb-25">{{ option?.name }}</h6>
                    </div>
                  </div>
                </li>
              </template>
            </Select>
          </div>
        </div>

        <div class="w-full mb-3">
          <label for="key-features" class="text-xs mb-1 block"
            >Key Features</label
          >
          <div class="flex items-end flex-wrap -mt-4">
            <div
              v-for="(item, index) in form.key_features"
              class="w-4/5 pr-4 mt-4 flex items-center"
            >
              <input
                type="text"
                class="border border-gray-300 p-2 w-full text-sm"
                v-model="item.name"
              />
              <button
                @click="removeItem(index)"
                class="bg-slate-100 rounded w-8 h-8 flex items-center justify-center -ml-[36px] shadow"
                v-if="form.key_features.length > 1"
              >
                <Icon
                  name="material-symbols:close-rounded"
                  class="text-common text-2xl"
                />
              </button>
            </div>
            <button
              class="w-1/5 text-xs bg-primary py-3 px-4 text-nowrap text-white"
              @click="addItem"
            >
              Add More
            </button>
          </div>
        </div>
      </div>
      <div class="w-full mb-5">
        <label for="short_description" class="text-xs mb-2 block mt-2"
          >Short Description</label
        >
        <textarea
          v-model="form.short_description"
          class="border border-gray-300 p-2 w-full text-sm"
        ></textarea>
      </div>
      <div class="w-full flex flex-col gap-4 y">
        <div class="flex">
          <div class="pr-2">
            <label for="image" class="text-xs block mb-1">Cover Image</label>
            <label
              for="cover_image"
              class="w-52 h-36 flex items-center justify-center gap-3 p-2 border border-dashed border-gray-300 text-common cursor-pointer"
            >
              <input type="file" id="cover_image" hidden @change="coverImage" />
              <img
                v-if="coverImg"
                :src="coverImg"
                class="w-full h-full object-cover"
              />
              <div v-else>
                <p class="text-xs">Upload Product Cover Image</p>
              </div>
            </label>
          </div>
        </div>
        <div class="w-full" v-if="prevImages?.length > 0">
          <div class="file-upload-container">
            <div class="file-upload-container-wrapper">
              <!--IMAGES PREVIEW-->
              <div
                v-for="image in prevImages"
                class="file-upload-container-wrapper__preview"
              >
                <img
                  :src="image.url"
                  class="file-upload-container-wrapper__preview-item"
                />
                <button
                  @click="deleteProductImage(image.id)"
                  class="file-upload-container-wrapper__preview-cancel"
                  type="button"
                >
                  <Icon
                    name="material-symbols-light:delete-outline"
                    class="       "
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full">
          <div class="p-2 border border-dashed border-gray-400">
            <h4 class="mb-3 text-sm">Product Images</h4>
            <ul class="mb-2">
              <li class="text-xs">999 KB limit.</li>
              <li class="text-xs">
                Allowed types: <span> JPG</span>, <span>JPEG</span>,
                <span>PNG</span>.
              </li>
            </ul>
            <div class="file-upload-container">
              <div class="file-upload-container-wrapper">
                <!--IMAGES PREVIEW-->
                <div
                  v-for="(image, index) in form.newImages"
                  class="file-upload-container-wrapper__preview"
                  :key="image.index"
                >
                  <img
                    :src="image.url"
                    class="file-upload-container-wrapper__preview-item"
                  />
                  <button
                    @click="removeMedia(index)"
                    class="file-upload-container-wrapper__preview-cancel"
                    type="button"
                  >
                    <Icon name="material-symbols:close" class="text-rose-600" />
                  </button>
                </div>
                <!--UPLOAD BUTTON-->
                <div class="file-upload-container-wrapper__add">
                  <label
                    for="mu-file-input"
                    class="file-upload-container__add-btn"
                  >
                    <span>
                      <Icon name="tabler:cloud-upload" />
                    </span>
                  </label>
                  <input
                    @change="handleFileChange"
                    id="mu-file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full mb-5">
        <label for="title" class="text-sm mb-1">Product Info</label>
        <div class="editor_data bg-gray-100">
          <SummernoteEditor v-model="form.product_info" />
        </div>
      </div>
      <div class="w-full">
        <label for="title" class="text-sm mb-1">Specification</label>
        <div class="editor_data bg-gray-100">
          <SummernoteEditor v-model="form.specification" />
        </div>
      </div>
    </div>
    <div class="text-center pt-10">
      <PrimaryButton @click="onSubmit(form.id)"> Save Product </PrimaryButton>
    </div>
  </div>
</template>
