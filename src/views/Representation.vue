<template>

    <Tools />

    <Settings />

    <Viewport />

    <ModalTrajectory />

</template>

<script>
import { useStore } from 'vuex'
import Tools from '@/components/representation/Tools'
import Settings from '@/components/representation/Settings'
import Viewport from '@/components/representation/Viewport'
import ModalTrajectory from '@/components/representation/modals/ModalTrajectory'
export default {
    components: { Tools, Settings, Viewport, ModalTrajectory },
    props: ['id'],
    setup(props) {

        const store = useStore()
        // disable menu
        store.dispatch('menuStatus', false) 

        console.log(props.id)

        return { }
    }
}
</script>

<style>
    
</style>