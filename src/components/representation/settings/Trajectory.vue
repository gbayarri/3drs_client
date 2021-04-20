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
import { ref, reactive, computed, toRefs, onUpdated } from 'vue'
import useModals from '@/modules/common/useModals'
import structureSettings from '@/modules/structure/structureSettings'
import PlayerTrajectory from '@/components/representation/settings/addons/PlayerTrajectory'
import SettingsTrajectory from '@/components/representation/settings/addons/SettingsTrajectory'
//import useTrajectories from '@/modules/ngl/useTrajectories'
export default {
    components: { PlayerTrajectory, SettingsTrajectory },
    props: ['stage'],
    setup(props) {

        const stage = props.stage

        /*const { checkIfTrajectory, getTrajectorySettings, currentStructure } = structureSettings()
        const { currentFrame, getTrajectoryPlayer, setCurrentFrame } = useTrajectories()*/
        const { checkIfTrajectory } = structureSettings()
        const { dialog, openModal } = useModals()

        /*const currStr = computed(() => currentStructure.value)
        const currFr = computed(() => currentFrame.value)*/
        const hasTrajectory = computed(() => checkIfTrajectory())
        /*const trajSettings = computed(() => getTrajectorySettings())
        const player =  computed(() => getTrajectoryPlayer())*/
        
        const page = reactive({
            btn_label: "Add Trajectory"
        })

        //const currTraj = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0].trajList[0])
        //console.log(currTraj.value)

        //setCurrentFrame(currTraj.value, trajSettings.value.range[0])

        /*onUpdated(() => {
            isRunning.value = player.value.isRunning
        })

        const isRunning = ref(false)
        const page = reactive({
            btn_label: "Add Trajectory"
        })
        const settings = reactive({
            min: computed(() => trajSettings.value.range[0]),
            max: computed(() => trajSettings.value.range[1]),
            step: computed(() => trajSettings.value.step)
        })
        
        //console.log(stage)

        const changeFrame = (frame) => {
            setCurrentFrame(currTraj.value, frame)
        }

        const frames = computed({
            get: () => parseInt(currFr.value) + 1,
            set: val => changeFrame(val)
        })*/

        const openModalTrajectory = () => {
            openModal('trajectory')
        }

        /*const playTraj = () => {
            isRunning.value = !isRunning.value

            if(isRunning.value)  player.value.play()
            else player.value.pause()

        }

        const frameStep = (dir) => {
            const start = computed(() => trajSettings.value.range[0]).value
            const end = computed(() => trajSettings.value.range[1]).value
            const step = computed(() => trajSettings.value.step).value
            let f = parseInt(currFr.value) + (dir * step)
            if(f < start) f = end
            if(f > end) f = start
            //console.log(f)
            player.value.pause()
            setCurrentFrame(currTraj.value, f)

        }*/

        return { 
            ...toRefs(page), dialog, hasTrajectory, 
            openModalTrajectory/*,
            frames, isRunning, playTraj, frameStep,
            ...toRefs(settings)*/
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