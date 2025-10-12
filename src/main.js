// import '@/assets/css/app.css';
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

import "vue3-toastify/dist/index.css";
import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.min.js";

// 🧠 Important: jQuery must be imported BEFORE vue3-summernote-editor
import $ from "jquery";
window.$ = window.jQuery = $;

import "popper.js";
import "summernote/dist/summernote-lite.js";
import Vue3SummernoteEditor from "vue3-summernote-editor";

import AppLayout from "@/components/layouts/AppLayout.vue";
import Icon from "@/components/Icon.vue";
import Container from "@/components/Container.vue";

const app = createApp(App);

app.config.globalProperties.$APP_URL = import.meta.env.VITE_APP_URL;

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { theme: { preset: Aura } });
app.use(Vue3SummernoteEditor);

app.component("AppLayout", AppLayout);
app.component("Icon", Icon);
app.component("Container", Container);

app.mount("#app");
