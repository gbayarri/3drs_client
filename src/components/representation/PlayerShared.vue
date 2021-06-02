<template>
  <div id="player-shared" v-if="isVisible">
    <div> 
        <div class="p-grid double-col dc-top">
            <div class="p-col margin-top-5">
                <Slider id="player-slider" v-model="frames" :min="min" :max="max" :step="step" />
            </div>
        </div>
        <div class="p-grid double-col dc-bottom">
            <div class="p-col-9 margin-bottom-5" style="text-align:left">
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
            <div class="p-col-3 slider-value" style="text-align:right">
                <label>{{ frames }}</label>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, reactive, toRefs, onUpdated } from "vue"
import useStage from "@/modules/ngl/useStage"
import structureSettings from '@/modules/structure/structureSettings'
import useFlags from '@/modules/common/useFlags'
import useTrajectories from '@/modules/ngl/useTrajectories'
export default {
    props: ['isDraft'],
    setup() {

        const { getStage } = useStage()
        const { getTrajectorySettings, currentStructure } = structureSettings()
        const { getNumberOfPlayers, getCurrentFrame, getTrajectoryPlayer, setCurrentFrame } = useTrajectories()
        const { flags } = useFlags()
        
        const stage = getStage()

        const currStr = computed(() => currentStructure.value)
        const currFr = computed(() => getCurrentFrame(currStr.value))
        const trajSettings = computed(() => getTrajectorySettings())
        const player = computed(() => getTrajectoryPlayer(currStr.value))
        const currTraj = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0].trajList[0])

        onUpdated(() => {
            // update isRunningValue once the player has been created
            isRunning.value = computed(() => player.value.isRunning).value
            // if no loop and player at end, set isRunning to false
            //if(!trajSettings.value.loop && player.value.traj.currentFrame === trajSettings.value.range[1]) isRunning.value = false
        })

        const isRunning = ref(player.value.isRunning)

        const settings = reactive({
            min: computed(() => trajSettings.value.range[0]),
            max: computed(() => trajSettings.value.range[1]),
            step: computed(() => trajSettings.value.step)
        })

        const isVisible = computed(() => {
            if(getNumberOfPlayers() === 1 && !flags.responsive) return true
            else return false
        })

        const changeFrame = (frame) => {
            setCurrentFrame(currTraj.value, frame, currStr.value)
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
            setCurrentFrame(currTraj.value, f, currStr.value)

        }

        return { ...toRefs(settings), isVisible, frames, isRunning, playTraj, frameStep }
    }
}
</script>

<style>

#player-shared { 
    position: absolute; 
    z-index: 2; 
    left:calc(2% + 38px); 
    top:0;
    width:calc(98% - 39px); 
}
#player-shared div { text-align: center; }

#player-shared .double-col { width:25%; margin: 0 auto; background-color: rgb(123 141 160 / 0.8); padding:0 .5rem; }
#player-shared .double-col.dc-bottom { border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; }
#player-shared #player-slider.p-slider.p-slider-horizontal { background: #ccc; width:100%; }
#player-shared #player-slider.p-slider .p-slider-range { background: #fff; }
#player-shared #player-slider.p-slider .p-slider-handle { border-color: #b4cce6; }
#player-shared #player-slider.p-slider:not(.p-disabled) .p-slider-handle:hover { background: #6f96a9;  border-color: #fff; }
#player-shared .slider-value { text-align:right; font-weight: 700; }
#player-shared .slider-value label { color:#fff; }

@media (max-width: 768px) {
    #player-shared { left:2%; top:auto; bottom:0; }
    #player-shared .double-col { width:50%;}
    #player-shared .double-col.dc-top { border-top-left-radius: 3px; border-top-right-radius: 3px; }
    #player-shared .double-col.dc-bottom { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
}

#player-shared .p-button-rounded.p-button-text.player-button {
    height: 1.3rem!important;
    width: 1.3rem;
    font-size: 10px;
    /*padding:0; */
    line-height: 10px;;
    /*margin: .3rem 0.3rem 0 .1rem;*/
    background:transparent;
    border-color: #fff; 
    color:#fff; 
}
#player-shared .p-button-rounded.p-button-text.player-button:hover { background: #546974!important; color:#fff!important; border-color: #fff!important; }
#player-shared .p-button-rounded.p-button-text.player-button span.p-button-icon { margin-top:-2px;}
</style>