<template>

    <Tools v-if="stageLoaded" />

    <RepresentationSettings v-if="stageLoaded" />

    <Settings v-if="stageLoaded" />

    <Share v-if="stageLoaded" />

    <Legend v-if="stageLoaded" />

    <Viewport />

    <ModalTrajectory />
    <ModalStructure />
    <ModalShare />

</template>

<script>
import { computed } from 'vue'
import useFlags from '@/modules/common/useFlags'
import Tools from '@/components/representation/Tools'
import RepresentationSettings from '@/components/representation/RepresentationSettings'
import Settings from '@/components/representation/Settings'
import Share from '@/components/representation/Share'
import Legend from '@/components/representation/Legend'
import Viewport from '@/components/representation/Viewport'
import ModalTrajectory from '@/components/representation/modals/ModalTrajectory'
import ModalStructure from '@/components/representation/modals/ModalStructure'
import ModalShare from '@/components/representation/modals/ModalShare'
export default {
    components: { Tools, RepresentationSettings, Settings, Share, Legend, Viewport, ModalTrajectory, ModalStructure, ModalShare },
    props: ['id'],
    setup(props) {

        const { flags, setFlagStatus } = useFlags()

        // activate tools, sidebar and so on
        const stageLoaded = computed(() => flags.stageLoaded)
        
        setFlagStatus('menuEnabled', false)
        setFlagStatus('stageLoaded', false)
        setFlagStatus('sidebarEnabled', false)
        setFlagStatus('legendEnabled', false)

        console.log(props.id)

        return { stageLoaded }
    }
}
</script>

<style>
    
</style>