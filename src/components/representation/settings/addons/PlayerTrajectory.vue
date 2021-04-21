<template>
  
    <div class="p-grid">
            <div class="p-col">
                <Slider id="player-slider" v-model="frames" :min="min" :max="max" :step="step" />
            </div>
        </div>
        <div class="p-grid double-col">
            <div class="p-col">
                <Button 
                icon="fas fa-step-backward" 
                class="p-button-rounded p-button-text player-button"
                @click="frameStep(-1)" />
                <Button 
                :icon="isRunning ? 'fas fa-pause' : 'fas fa-play'" 
                class="p-button-rounded p-button-text player-button"
                @click="playTraj" />
                <Button 
                icon="fas fa-step-forward" 
                class="p-button-rounded p-button-text player-button"
                @click="frameStep(1)" />
            </div>
            <div class="p-col slider-value">
                <label>{{ frames }}</label>
            </div>
        </div>

        

</template>

<script>
import { ref, reactive, computed, toRefs, onUpdated } from 'vue'
//import useModals from '@/modules/common/useModals'
import structureSettings from '@/modules/structure/structureSettings'
//import SettingsTrajectory from '@/components/representation/settings/addons/SettingsTrajectory'
import useTrajectories from '@/modules/ngl/useTrajectories'
export default {
    //components: { SettingsTrajectory},
    props: ['stage'],
    setup(props) {

        const stage = props.stage

        const { getTrajectorySettings, currentStructure } = structureSettings()
        const { currentFrame, getTrajectoryPlayer, setCurrentFrame } = useTrajectories()

        const currStr = computed(() => currentStructure.value)
        const currFr = computed(() => currentFrame.value)
        const trajSettings = computed(() => getTrajectorySettings())
        const player =  computed(() => getTrajectoryPlayer())
        
        const currTraj = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0].trajList[0])

        setCurrentFrame(currTraj.value, trajSettings.value.range[0])

        onUpdated(() => {
            // update isRunningValue once the player has been created
            isRunning.value = computed(() => player.value.isRunning).value
            // if no loop and player at end, set isRunning to false
            if(!trajSettings.value.loop && player.value.traj.currentFrame === trajSettings.value.range[1]) isRunning.value = false
        })

        const isRunning = ref(false)
        /*const isRunning = reactive({
            status: computed(() => {
                        if(player.value === undefined || player.value === null) return false
                        return player.value.isRunning
                    })
        })*/
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
        })

        const playTraj = () => {

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

        }

        return {  
            frames, isRunning, playTraj, frameStep,
            ...toRefs(settings)
        }

    }
}
</script>

<style>

</style>