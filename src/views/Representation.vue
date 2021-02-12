<template>

    <Tools v-if="stageLoaded" />

    <Settings v-if="stageLoaded" />

    <Viewport />

    <ModalTrajectory />
    <ModalStructure />

</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Tools from '@/components/representation/Tools'
import Settings from '@/components/representation/Settings'
import Viewport from '@/components/representation/Viewport'
import ModalTrajectory from '@/components/representation/modals/ModalTrajectory'
import ModalStructure from '@/components/representation/modals/ModalStructure'
export default {
    components: { Tools, Settings, Viewport, ModalTrajectory, ModalStructure },
    props: ['id'],
    setup(props) {

        const store = useStore()
        // activate tools, sidebar and so on
        let stageLoaded = computed(() => store.state.stageLoaded)
        // disable menu
        store.dispatch('menuStatus', false) 

        console.log(props.id)

        return { stageLoaded }
    }
}
</script>

<style>
    
</style>