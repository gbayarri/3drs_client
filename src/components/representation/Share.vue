<template>
    <div id="share-box" @click="openShareModal" v-tooltip.left="ttp" class="p-shadow-2" :class="{ 'legend-moved-left': sidebarEnabled }">
        <img src="@/assets/img/logo_legend.png" />
    </div>
</template>

<script>
import { computed } from 'vue'
//import { useStore } from 'vuex'
import useFlags from '@/modules/common/useFlags'
import useModals from '@/modules/common/useModals'
export default {

    setup() {

        //const store = useStore()

        const ttp = 'Ready to share?<br>Click here!'
        const { openModal } = useModals()

        //let sidebarEnabled = computed(() => store.state.sidebarEnabled)
        const { flags } = useFlags()
        const sidebarEnabled = computed(() => flags.sidebarEnabled)

        const openShareModal = () => {
             openModal('share')
        }

        return { ttp, sidebarEnabled, openShareModal }

    }

}
</script>

<style>
#share-box {
    position: absolute;
    z-index: 2;
    right: 1%;
    top: 1.5%;
    cursor:pointer;
    background:rgba(255, 255, 255, .9);
    padding:.2rem .5rem;
    border-radius:5px;
    -moz-transition-duration: 0.35s;
    -webkit-transition-duration: 0.35s;
    -o-transition-duration: 0.35s;
    transition-duration: 0.35s;
    -moz-transition-timing-function: ease;
    -webkit-transition-timing-function: ease;
    -o-transition-timing-function: ease;
    transition-timing-function: ease;
}
#share-box.legend-moved-left { 
    right: 26%;
    -moz-transition-duration: 0.3s;
    -webkit-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -moz-transition-timing-function: ease-out;
    -webkit-transition-timing-function: ease-out;
    -o-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
}

</style>