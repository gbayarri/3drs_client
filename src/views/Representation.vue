<template>

    <Tools v-if="stageLoaded" />

    <ZoomWindow v-if="stageLoaded" />

    <RepresentationSettings v-if="stageLoaded" />

    <Settings v-if="stageLoaded" />

    <Share v-if="stageLoaded" />

    <Legend v-if="stageLoaded" />

    <Toast />

    <Viewport :project_id="project_id" />

    <ModalTrajectory />
    <ModalStructure />
    <ModalShare />
    <ModalTips />
    <ModalHierarchy v-if="stageLoaded" />

</template>

<script>
import { computed } from 'vue'
import useFlags from '@/modules/common/useFlags'
import Tools from '@/components/representation/Tools'
import ZoomWindow from '@/components/representation/settings/addons/ZoomWindow'
import RepresentationSettings from '@/components/representation/RepresentationSettings'
import Settings from '@/components/representation/Settings'
import Share from '@/components/representation/Share'
import Legend from '@/components/representation/Legend'
import Viewport from '@/components/representation/Viewport'
import ModalTrajectory from '@/components/representation/modals/ModalTrajectory'
import ModalStructure from '@/components/representation/modals/ModalStructure'
import ModalShare from '@/components/representation/modals/ModalShare'
import ModalTips from '@/components/representation/modals/ModalTips'
import ModalHierarchy from '@/components/representation/modals/ModalHierarchy'
export default {
    components: { 
        Tools, ZoomWindow, 
        RepresentationSettings, Settings, 
        Share, Legend, 
        Viewport, 
        ModalTrajectory, ModalStructure, ModalShare, ModalTips, ModalHierarchy },
    props: ['id'],
    setup(props) {

        const { flags, setFlagStatus } = useFlags()

        // activate tools, sidebar and so on
        const stageLoaded = computed(() => flags.stageLoaded)
        
        setFlagStatus('menuEnabled', false)
        setFlagStatus('stageLoaded', false)
        setFlagStatus('sidebarEnabled', false)
        setFlagStatus('legendEnabled', false)

        const project_id = props.id

        return { stageLoaded, project_id }
    }
}
</script>

<style>
    .p-toast-top-right { left:calc(2% + 38px);  top:1.5%;}
    .p-toast .p-toast-message.p-toast-message-info { 
        background: #d7e6ec!important; 
        border: solid #5e738b!important; 
        border-width: 0 0 0 6px!important;
        color: #48596d!important;
    }
    .p-toast .p-toast-message.p-toast-message-info .p-toast-message-icon, 
    .p-toast .p-toast-message.p-toast-message-info .p-toast-icon-close { color: #48596d!important; }
    .p-toast .p-toast-message .p-toast-icon-close:focus { box-shadow: none!important;}
    .p-toast .p-toast-message .p-toast-icon-close:hover { background:transparent!important; color:#000!important }
</style>