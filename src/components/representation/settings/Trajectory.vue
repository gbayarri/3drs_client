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
        
        <div class="p-grid">
            <div class="p-col">
                <Slider v-model="frames" :min="min" :max="max" :step="step" />
            </div>
        </div>
        <div class="p-grid double-col">
            <div class="p-col">
                <Button 
                :icon="isRunning ? 'fas fa-pause' : 'fas fa-play'" 
                id="play-button"
                class="p-button-rounded p-button-text"
                @click="playTraj" />
            </div>
            <div class="p-col slider-value">
                <label>{{ frames }}</label>
            </div>
        </div>

        <SettingsTrajectory class="settings-panel settings-traj" />

    </div>
</template>

<script>
import { ref, reactive, computed, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
import structureSettings from '@/modules/structure/structureSettings'
import SettingsTrajectory from '@/components/representation/settings/addons/SettingsTrajectory'
import useTrajectories from '@/modules/ngl/useTrajectories'
export default {
    components: { SettingsTrajectory},
    props: ['stage'],
    setup(props) {

        const stage = props.stage

        const { checkIfTrajectory, getTrajectorySettings, currentStructure } = structureSettings()
        const { currentFrame, getTrajectoryPlayer, setCurrentFrame } = useTrajectories()
        const { dialog, openModal } = useModals()

        const currStr = computed(() => currentStructure.value)
        const hasTrajectory = computed(() => checkIfTrajectory())
        const trajSettings = computed(() => getTrajectorySettings())
        const player =  computed(() => getTrajectoryPlayer())
        
        const currTraj = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0].trajList[0])
        //console.log(currTraj.value)

        const isRunning = ref(false)
        const page = reactive({
            btn_label: "Add Trajectory"
        })
        const settings = reactive({
            min: computed(() => trajSettings.value.start),
            max: computed(() => trajSettings.value.end),
            step: computed(() => trajSettings.value.step)
        })
        
        //console.log(stage)

        const changeFrame = (frame) => {
            //console.log(frame)
            setCurrentFrame(currTraj.value, frame)
            //currTraj.value.setFrame(frame)
            /*updateRepresentationProperty('opacity', (value / 100))
            setOpacityRepresentation(stage, value, re.value, true)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })*/
        }

        const frames = computed({
            get: () => parseInt(currentFrame.value) + 1,
            set: val => changeFrame(val)
        })

        const openModalTrajectory = () => {
            openModal('trajectory')
        }

        const playTraj = () => {

            isRunning.value = !isRunning.value

            if(isRunning.value)  player.value.play()
            else player.value.pause()

        }

        return { 
            ...toRefs(page), dialog, hasTrajectory, 
            openModalTrajectory,
            frames, isRunning, playTraj,
            ...toRefs(settings)
        }
    }
}


/*const changeOpacity = (value) => {
            //console.log(value)
            updateRepresentationProperty('opacity', (value / 100))
            setOpacityRepresentation(stage, value, re.value, true)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        //const opacity = ref(Math.round(currReprSettings.value.opacity * 100))
        const opacity = computed({
            get: () => Math.round(currReprSettings.value.opacity * 100),
            set: val => changeOpacity(val)
        })*/
</script>

<style>

    #sidebar-player .double-col { margin: -.5rem 0.25rem; }
    #sidebar-player .p-slider.p-slider-horizontal { width: 90%; margin: 0 5%; background: #ccc; }
    #sidebar-player .p-slider .p-slider-range { background: #fff; }
    #sidebar-player .p-slider .p-slider-handle { border-color: #b4cce6; }
    #sidebar-player .p-slider:not(.p-disabled) .p-slider-handle:hover { background: #6f96a9;  border-color: #fff; }
    #sidebar-player .slider-value { text-align:right; font-weight: 700; }
    #sidebar-player .slider-value label { vertical-align: sub; color:#fff; }

    #play-button {
        height: 1.6rem;
        width: 1.6rem;
        font-size: 12px;
        padding:0; 
        margin: .3rem 0 0 .1rem;
        background:transparent;
        border-color: #fff; 
        color:#fff; 
    }
    #play-button:hover { background: #546974;}

</style>