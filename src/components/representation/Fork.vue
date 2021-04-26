<template>
    <div id="share-box" @click="openShareModal" v-tooltip.left="ttp" class="p-shadow-2" >
        <img src="@/assets/img/logo_legend_fork.png" />
    </div>
</template>

<script>
import { computed } from 'vue'
//import useFlags from '@/modules/common/useFlags'
//import useModals from '@/modules/common/useModals'
export default {
    props: ['isDraft'],
    setup(props) {
        
        const isDraft = props.isDraft
        const ttp = computed(() => isDraft ? 'This is a draft and it can\'t be forked' : 'Click here to fork project!')
        //const { openModal } = useModals()

        //const { flags } = useFlags()
        //const sidebarEnabled = computed(() => flags.sidebarEnabled)
        //const isShared = computed(() => flags.isShared)

        const openShareModal = () => {
            if(!isDraft) {
                // open blockUI and when cloning is finished, redirect to forked project
                console.log('fork!')
            }
            
        }

        return { ttp, openShareModal }

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
    user-select: none;
}

</style>