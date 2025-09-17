<script setup>
    import {ref} from 'vue';
    const loader = ref(true);

    setTimeout(() => {
        loader.value = false;
    }, "2000")
</script>

<template>
    <div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex transition-all duration-1000" :class="{'-z-50': !loader, 'z-50' : loader}">
        <div class="w-1/2 backdrop-blur-md bg-gray-100/20 h-full transition-all  duration-1000" :class="{'-translate-x-[2000px]' : !loader}">

        </div>
        <div class="w-1/2 backdrop-blur-md bg-gray-100/20 h-full transition-all duration-1000" :class="{'translate-x-[2000px]' : !loader}">

        </div>

        <div class="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <div class="loading text-xl lg:text-8xl">
                <span data-text="T">T</span>
                <span data-text="O">O</span>
                <span data-text="P">P</span>
                <span data-text="O">O</span>
                <span data-text="N">N</span>
                <span data-text="E">E</span>
                <span data-text="I">I</span>
                <span data-text="R">R</span>
            </div>
            <div class="loading text-xl lg:text-4xl mt-5">
                <span data-text="E">E</span>
                <span data-text="C">C</span>
                <span data-text="O">O</span>
                <span data-text="M">M</span>
                <span data-text="M">M</span>
                <span data-text="E">E</span>
                <span data-text="R">R</span>
                <span data-text="C">C</span>
                <span data-text="E">E</span>
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
    .loading {
        gap: 20px;
        display: flex;
        font-weight: 800;
        text-align: center;
        align-items: center;
        justify-content: center;
        span {
            margin: 0 -.05em;
            display: inline-block;
        }
        span {
            position: relative;
            color: rgba(#ff0000, .2);
            &::after {
                top: 0;
                left: 0;
                opacity: 0;
                position: absolute;
                transform: scale(1.5);
                color: red;
                content: attr(data-text);
                animation: loading 2s infinite;
            }
            @for $i from 1 through 12 {
                &:nth-child(#{$i+1})::after {
                    animation-delay: #{$i*.1}s;
                }
            }
        }
    }
    @keyframes loading {
        0%, 75%, 100% {
            transform: scale(1.5);
            opacity: 0;
        }
        25%, 50% {
            transform: scale(1);
            opacity: 1;
        }
    }
</style>