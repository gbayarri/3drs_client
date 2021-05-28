<template>
  <Panel :toggleable="true" v-model:collapsed="isCollapsed" class="margin-top-20">
        <template #header>
            <i class="fas fa-cog"></i> <div class="p-panel-title"> {{ header }}</div>
        </template>
        <template #icons>
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpst" />
        </template>
        
        <div class="p-grid">
            <div class="p-col">
                <label>{{ label_range }}</label>
            </div>
            <div class="p-col range-value">
                <label>{{ range[0] + 1 }} - {{ range[1] + 1 }}</label>
            </div>
        </div>
        <div class="p-grid margin-top-5">
            <div class="p-col">
                <div class="p-inputgroup">
                    <Slider v-model="range" :range="true" :min="minRange" :max="maxRange" />
                </div>
            </div>
        </div>

        <div class="p-grid margin-top-10">
            <div class="p-col">
                <label>{{ label_step }}</label>
            </div>
            <div class="p-col">
                <label>{{ label_interpolation }}</label>
            </div>
        </div>
        <div class="p-grid margin-top-5">
            <div class="p-col">
                <InputNumber id="step-traj" v-model="step" showButtons :step="1" :min="1" :max="10" style="width:100%" />
            </div>
            <div class="p-col">
                <Dropdown v-model="selectedInterpolation" :options="interpolations" optionLabel="name" />
            </div>
        </div>

        <div class="p-grid margin-top-10">
            <div class="p-col">
                <label>{{ label_timeout }} <i class="far fa-question-circle" id="custom-help" v-tooltip.top="ttp_to"></i></label>
            </div>
            <div class="p-col range-value">
                <label>{{ timeout }}</label>
            </div>
        </div>
        <div class="p-grid margin-top-5">
            <div class="p-col">
                <div class="p-inputgroup">
                    <Slider v-model="timeout" :min="0" :max="100" />
                </div>
            </div>
        </div>

        <div class="p-grid margin-top-10">
            <div class="p-col">
                <label>{{ label_mode }}</label>
            </div>
            <div class="p-col">
                <label>{{ label_autoplay }}</label>
            </div>
        </div>
        <div class="p-grid margin-top-5">
            <div class="p-col">
                <InputSwitch v-model="loop" class="margin-top-5" />
            </div>
            <div class="p-col">
                <InputSwitch v-model="autoplay" class="margin-top-5" />
            </div>
        </div>

        <div class="p-grid margin-top-10">
            <div class="p-col">
                <label>{{ label_direction }}</label>
            </div>
        </div>
        <div class="p-grid margin-top-5">
            <div class="p-col">
                <InputSwitch v-model="direction" class="margin-top-5" />
            </div>
        </div>

    </Panel>
</template>

<script>
import { ref, reactive, computed, toRefs } from 'vue'
import globals from '@/globals'
import useModals from '@/modules/common/useModals'
import structureSettings from '@/modules/structure/structureSettings'
import useTrajectories from '@/modules/ngl/useTrajectories'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage

        const { openModal } = useModals()
        const { getTrajectorySettings, currentStructure, updateTrajectorySettings } = structureSettings()
        const { updatePlayerSetting, setTrajectorySettings, setTrajectorySettingsTimeout, getCurrentFrame, setCurrentFrame } = useTrajectories()

        const isCollapsed = ref(true)
        const trajSettings = computed(() => getTrajectorySettings())
        const currStr = computed(() => currentStructure.value)
        const currFr = computed(() => getCurrentFrame(currStr.value))
        //const currFr = computed(() => currentFrame.value)
        const currTraj = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0].trajList[0])

        //console.log(currentStructure.value, currFr.value)

        const page = reactive({
            header: "Trajectory settings",
            ttpst: "Show tips for trajectory settings",
            label_range: "Range",
            label_mode: "Loop",
            label_interpolation: "Interpolation",
            label_timeout: "Timeout",
            ttp_to: "Timeout between playing frames. This slider is in a logarithmic scale.",
            label_step: "Step",
            label_autoplay: "Autoplay",
            label_direction: computed(() => trajSettings.value.bounce ? "Bounce / rock enabled" : "Bounce / rock disabled")
        })

        const showTips = () => {
            openModal('tips', 'trajectory')
        }

        // range

        // change loop from switch
        const changeRange = (value) => {
            trajSettings.value.range = value

            //console.log(currTraj.value, value[0], currStr.value)

            if(currFr.value < value[0]) setCurrentFrame(currTraj.value, value[0], currStr.value)
            if(currFr.value > value[1]) setCurrentFrame(currTraj.value, value[1], currStr.value)

            updateTrajectorySettings(trajSettings.value)
            updatePlayerSetting('start', value[0], currStr.value)
            updatePlayerSetting('end', value[1], currStr.value)
            setTrajectorySettingsTimeout({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
        const range = computed({
            get: () => trajSettings.value.range,
            set: val => changeRange(val)
        })
        const minRange = computed(() => trajSettings.value.init)
        const maxRange = computed(() => trajSettings.value.end)

        // timeout

        const logarithmicTimeout = (value, flag) => {
            // position will be between 0 and 100
            var minp = 0
            var maxp = 100
            // The result should be between 50 an 10000
            var minv = Math.log(50)
            var maxv = Math.log(10000)
            // calculate adjustment factor
            var scale = (maxv - minv) / (maxp  -minp)
            // return exponential or logarithm depending on the flag
            return ( flag ? Math.exp(minv + scale*(value-minp)) : ((Math.log(value)-minv) / scale + minp) )
        }

        // change loop from switch
        const changeTimeout = (value) => {
            trajSettings.value.timeout = Math.round(value)
            updateTrajectorySettings(trajSettings.value)
            updatePlayerSetting('timeout', value, currStr.value)
            setTrajectorySettingsTimeout({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })

        }
        const timeout = computed({
            get: () => Math.round(logarithmicTimeout(trajSettings.value.timeout, false)),
            set: val => changeTimeout(logarithmicTimeout(val, true))
        })

        // loop

        // change loop from switch
        const changeLoop = (value) => {
            const l = value ? "loop": "once"
            trajSettings.value.loop = value
            if(!value) trajSettings.value.bounce = false
            updateTrajectorySettings(trajSettings.value)
            updatePlayerSetting('mode', l, currStr.value)
            setTrajectorySettings({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
        const loop = computed({
            get: () => trajSettings.value.loop,
            set: val => changeLoop(val)
        })

        // interpolation

        // change interpolation from dropdown
        const changeInterpolation = (value) => {
            trajSettings.value.interpolation = value.id
            updateTrajectorySettings(trajSettings.value)
            updatePlayerSetting('interpolateType', value.id, currStr.value)
            setTrajectorySettings({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
        const interpolations = globals.interpolation
        const selectedInterpolation = computed({
            get: () => interpolations.filter(item => item.id === trajSettings.value.interpolation)[0],
            set: val => changeInterpolation(val)
        })

        // step

        // change step from input number
        const changeStep = (value) => {
            trajSettings.value.step = value
            updateTrajectorySettings(trajSettings.value)
            updatePlayerSetting('step', value, currStr.value)
            setTrajectorySettings({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
        const step = computed({
            get: () => trajSettings.value.step,
            set: val => changeStep(val)
        })

        // autoplay

        // change autoplay from switch
        const changeAutoplay = (value) => {
            trajSettings.value.autoplay = value
            updateTrajectorySettings(trajSettings.value)
            setTrajectorySettings({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
        const autoplay = computed({
            get: () => trajSettings.value.autoplay,
            set: val => changeAutoplay(val)
        })

        // direction

        // change direction from switch
        const changeDirection = (value) => {
            const l = value ? "bounce": "forward"
            trajSettings.value.bounce = value
            if(value) trajSettings.value.loop = true
            updateTrajectorySettings(trajSettings.value)
            updatePlayerSetting('direction', l, currStr.value)
            setTrajectorySettings({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
        const direction = computed({
            get: () => trajSettings.value.bounce,
            set: val => changeDirection(val)
        })

        return  { 
            ...toRefs(page), isCollapsed, showTips,
            range, minRange, maxRange,
            loop,
            timeout,
            selectedInterpolation, interpolations,
            step,
            autoplay,
            direction
        }

    }

}
</script>

<style>
    #custom-help { cursor:pointer; }
    #step-traj.p-inputtext.p-component.p-inputnumber-input { width:100%; }

    .range-value { text-align:right; font-weight: 700; }
    /*.range-value label { vertical-align: sub; }*/

    #sidebar-player .p-dropdown-panel .p-dropdown-items .p-dropdown-item { padding: 0.5rem 1rem!important; }

    #sidebar-player .p-col { padding-bottom:0; }
    #sidebar-player .p-inputswitch { margin-top:0!important; }

</style>