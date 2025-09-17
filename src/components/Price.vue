<script setup>
import { ref, provide, onMounted } from 'vue';
import useAxios from '@/composables/useAxios.js';

const setting = ref(null);
const { sendRequest } = useAxios();

const getCurrency = async () => {
    const response = await sendRequest({
        method: 'get',
        url: '/get-global-setting',
    });
    if (response) {
        setting.value = response.data;
    }
};

onMounted(() => {
    getCurrency();
});

provide('currencySetting', setting);
</script>

<template>
    <span>{{setting?.currency_symbol}}{{ price }}</span>
</template>