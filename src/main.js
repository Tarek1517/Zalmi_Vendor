import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'vue3-toastify/dist/index.css';
import AppLayout from "@/components/layouts/AppLayout.vue";
import Icon from "@/components/Icon.vue";
import Container from '@/components/Container.vue';


const app = createApp(App)
app.config.globalProperties.$APP_URL = import.meta.env.VITE_APP_URL
app.use(createPinia())
app.use(router)
app.component('AppLayout', AppLayout)
app.component('Icon', Icon)
app.component('Container', Container)
app.mount('#app')