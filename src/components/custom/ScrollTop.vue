<template>
    <transition name="p-scrolltop" appear >
        <button :class="containerClass" v-if="visible" @click="onClick" type="button" id="scroll-top">
            <span :class="iconClass"></span>
        </button>
    </transition>
</template>

<script>
import { ref } from 'vue'
export default {
    props: {
        threshold: {
            type: Number,
            default: 400
        },
    },
    setup(props) {

        const visible = ref(false)
        const threshold = props.threshold

        const iconClass = 'p-scrolltop-icon pi pi-chevron-up'
        const containerClass = 'p-scrolltop p-link p-component'

        const scrollFunction = () => {
            if (document.body.scrollTop > threshold || document.documentElement.scrollTop > threshold) visible.value = true
            else visible.value = false
        }

        window.addEventListener('scroll', scrollFunction, true)

        const onClick = () => {
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        }

        return { 
            visible,
            iconClass, containerClass,
            onClick
        }

    }
}
</script>

<style>
    .p-scrolltop {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .p-scrolltop:hover { opacity:.9 }

    .p-scrolltop .p-scrolltop-icon {
        text-align: center;
        width: 100%;
    }

    .p-scrolltop.p-link {
        background: rgba(94, 115, 139, .7)!important;
    }

    .p-scrolltop.p-link:focus {
        box-shadow: none;
    }

    .p-scrolltop-sticky {
        position: sticky;
    }

    .p-scrolltop-sticky.p-link {
        margin-left: auto;
    }

    .p-scrolltop-enter-from {
        opacity: 0;
    }

    .p-scrolltop-enter-active {
        transition: opacity .15s;
    }

    .p-scrolltop.p-scrolltop-leave-to {
        opacity: 0;
    }

    .p-scrolltop-leave-active {
        transition: opacity .15s;
    }
</style>