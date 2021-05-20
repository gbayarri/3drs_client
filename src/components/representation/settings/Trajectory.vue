<template>
    <div v-if="!hasTrajectory" class="margin-bottom-20">

        <Button 
        :label="btn_label" 
        icon="fas fa-film" 
        class="settings-button" 
        @click="openModalTrajectory" 
        :disabled="dialog.trajectory"  />

    </div>
    <div v-else class="margin-bottom-20" id="sidebar-player">
        
        <PlayerTrajectory :stage="stage" />
        <SettingsTrajectory class="settings-panel settings-traj" :stage="stage" />

    </div>
</template>

<script>
import { reactive, computed, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
import structureSettings from '@/modules/structure/structureSettings'
import PlayerTrajectory from '@/components/representation/settings/addons/PlayerTrajectory'
import SettingsTrajectory from '@/components/representation/settings/addons/SettingsTrajectory'
export default {
    components: { PlayerTrajectory, SettingsTrajectory },
    props: ['stage'],
    setup() {

        const { checkIfTrajectory } = structureSettings()
        const { dialog, openModal } = useModals()

        // activate tools, sidebar and so on
        const hasTrajectory = computed(() => checkIfTrajectory())
        
        const page = reactive({
            btn_label: "Add Trajectory"
        })

        const openModalTrajectory = () => {
            openModal('trajectory')
        }

        return { 
            ...toRefs(page), dialog, hasTrajectory, 
            openModalTrajectory
        }
    }
}

</script>

<style>

    #sidebar-player .double-col { margin: -.5rem 0.25rem; }
    #sidebar-player #player-slider.p-slider.p-slider-horizontal { width: 90%; margin: 0 5%; background: #ccc; }
    #sidebar-player #player-slider.p-slider .p-slider-range { background: #fff; }
    #sidebar-player #player-slider.p-slider .p-slider-handle { border-color: #b4cce6; }
    #sidebar-player #player-slider.p-slider:not(.p-disabled) .p-slider-handle:hover { background: #6f96a9;  border-color: #fff; }
    #sidebar-player .slider-value { text-align:right; font-weight: 700; }
    #sidebar-player .slider-value label { vertical-align: sub; color:#fff; }

    .p-button-rounded.p-button-text.player-button {
        height: 1.6rem!important;
        width: 1.6rem;
        font-size: 12px;
        padding:0; 
        margin: .3rem 0.3rem 0 .1rem;
        background:transparent;
        border-color: #fff; 
        color:#fff; 
    }
    .p-button-rounded.p-button-text.player-button:hover { background: #546974!important; color:#fff!important; border-color: #fff!important; }

</style>