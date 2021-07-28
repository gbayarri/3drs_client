<template>
  <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-user-cog"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpst" 
            />
        </template>
        <div class="p-grid">
            <div class="p-col">
                <label>{{ label }} <i class="far fa-question-circle" id="custom-help" v-tooltip.top="ttp" @click="openHelp"></i></label>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col">           
                <Textarea v-model="customSelection" rows="4" :placeholder="placeholder" id="customtextarea" />
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col">
                <InputSwitch v-model="distance" class="margin-top-5" /> 
                <span style="vertical-align:super; margin-left:10px;">
                    {{ dst }} <i class="far fa-question-circle" id="custom-help" v-tooltip.left="ttpd"></i>
                </span>
            </div>
        </div>
        <div class="p-grid margin-top-10">
            <div class="p-col">
                <label>{{ label_radius }}</label>
            </div>
            <div class="p-col radius-value">
                <label>{{ radius }}</label>
            </div>
        </div>
        <div class="p-grid margin-top-5">
            <div class="p-col">
                <div class="p-inputgroup">
                    <Slider v-model="radius" :min="0" :max="100" />
                </div>
            </div>
        </div>
        <div class="p-grid margin-top-10">
            <div class="p-col">
                <label>{{ label_groups }}</label>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col">
                <InputSwitch v-model="groups" class="margin-top-5" />
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col-4">
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-outlined cust-button danger" 
                    @click="removeCustom"
                     v-if="!bDisabled" />
            </div>
	        <div class="p-col-4 p-offset-4" style="text-align:right">
                <Button 
                    icon="pi pi-check" 
                    class="p-button-rounded p-button-outlined cust-button" 
                    @click="createCustom"
                    :disabled="bDisabled" />
            </div>
        </div>

    </Panel>
</template>

<script>
import { ref, computed, reactive, toRefs, watch/*, onRenderTriggered */} from 'vue'
import { useToast } from 'primevue/usetoast'
import useModals from '@/modules/common/useModals'
import useRepresentations from '@/modules/representations/useRepresentations'
import structureSettings from '@/modules/structure/structureSettings'
import useSelections from '@/modules/representations/useSelections'
import useProjectSettings from '@/modules/structure/useProjectSettings'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage

        const { openModal } = useModals()
        const { currentRepresentation, setSelectionRepresentation, getCurrentRepresentationSettings } = useRepresentations()
        const { currentStructure, getFileNames } = structureSettings()
        const { getCurrentSelection, setCurrentCustomSelection } = useSelections()
        const { getProjectSettings } = useProjectSettings()

        const isCollapsed = ref(false)
        const currReprVal = computed(() => currentRepresentation.value)
        const currStr = computed(() => currentStructure.value)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const filesList = computed(() => getFileNames())
        const toastSettings = computed(() => getProjectSettings().toasts) 
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))
        // ***********************************
        // FIX THIS REGEX
        //const re_others = computed(() => new RegExp('([0-9a-z\.]*\-^(' + currStr.value + ')\-[a-z]*)', 'g'))
        // ***********************************
        // ***********************************
        
        let newSelection = getCurrentSelection(currReprVal.value, currStr.value, 'custom')
        let bDisabled = ref(newSelection.length === 0)

        const toast = useToast()

        /*onRenderTriggered(() => {
            console.log('hook!', newSelection)
        })*/

        const customSelection = computed({
            get: () => getCurrentSelection(currReprVal.value, currStr.value, 'custom'),
            set: val => {
                newSelection = val
                bDisabled.value = (newSelection.length === 0)
            }
        })

        const page = reactive({
            header: "Custom selection",
            label: "Add custom selection",
            ttp: "Need help with NGL viewer Selection Language? Click here.",
            placeholder: "e.g. 10:F.CA/0...",
            ttpst: "Show tips for Custom Selection",
            dst: "Distance-based selection",
            ttpd: "Click for make a distance-based selection.",
            label_radius: "Distance from selection",
            label_groups: "Whole residue(s)"
        })

        const openHelp = () => {
            window.open(process.env.VUE_APP_NGL_HELP_URL, '_blank')
        }        

        // change distance from switch
        const changeDistance = (value) => {
            console.log(value)
            /*const l = value ? "loop": "once"
            trajSettings.value.loop = value
            if(!value) trajSettings.value.bounce = false
            updateTrajectorySettings(trajSettings.value)
            updatePlayerSetting('mode', l, currStr.value)
            setTrajectorySettings({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })*/
        }
        const distance = computed({
            get: () => { return false }, //trajSettings.value.loop,
            set: val => changeDistance(val)
        })

        // change radius from switch
        const changeRadius = (value) => {
            console.log(value)
            /*trajSettings.value.timeout = Math.round(value)
            updateTrajectorySettings(trajSettings.value)
            updatePlayerSetting('timeout', value, currStr.value)
            setTrajectorySettingsTimeout({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })*/

        }
        const radius = computed({
            get: () => { return 5 }, //Math.round(logarithmicTimeout(trajSettings.value.timeout, false)),
            set: val => changeRadius(val)
        })

        // change groups from switch
        const changeGroups = (value) => {
            console.log(value)
            /*const l = value ? "loop": "once"
            trajSettings.value.loop = value
            if(!value) trajSettings.value.bounce = false
            updateTrajectorySettings(trajSettings.value)
            updatePlayerSetting('mode', l, currStr.value)
            setTrajectorySettings({ structure: currStr.value, settings: trajSettings.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })*/
        }
        const groups = computed({
            get: () => { return false }, //trajSettings.value.loop,
            set: val => changeGroups(val)
        })

        const createCustom = () => {
            if(newSelection) {
                console.log(newSelection, 'redraw!!!')
                const [old_sele, structures] = setCurrentCustomSelection(stage, currReprVal.value, currStr.value, newSelection)
                // save selection representation
                setSelectionRepresentation(stage, component.value, newSelection, structures, re.value, true/*, re_others.value*/)
                    .then((r) => {
                        if(r.code != 404) {
                            //console.log(stage)
                            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
                            if(toastSettings.value) {
                                toast.add({ 
                                    severity: 'info', 
                                    summary: 'New custom selection', 
                                    detail: 'A new custom selection has been added to the structure <strong>'
                                            + strName
                                            + '</strong> of the <strong>'
                                            + currReprSettings.value.name 
                                            + '</strong> representation',
                                    life: 10000
                                })
                            }
                            console.log(r.message)
                        }else console.error(r.message)
                    })
            }
        }

        const removeCustom = () => {
            if(newSelection) {
                //newSelection = ''
                bDisabled.value = true
                //console.log(newSelection, 'redraw!!!')
                const [sele, structures] = setCurrentCustomSelection(stage, currReprVal.value, currStr.value, '')
                // save selection representation
                setSelectionRepresentation(stage, component.value, sele, structures, re.value, true)
                    .then((r) => {
                        if(r.code != 404) {
                            //console.log(stage)
                            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
                            if(toastSettings.value) {
                                toast.add({ 
                                    severity: 'warn', 
                                    summary: 'Removed custom representation', 
                                    detail: 'The custom representation linked to the structure <strong>'
                                            + strName
                                            + '</strong> of the <strong>'
                                            + currReprSettings.value.name 
                                            + '</strong> representation has been removed',
                                    life: 10000
                                })
                            }
                            console.log(r.message)
                        }else console.error(r.message)
                    })
            }
        }

        const showTips = () => {
            openModal('tips', 'custom')
        }

        watch([currStr, currReprVal], (newValues, prevValues) => {
            newSelection = getCurrentSelection(currReprVal.value, currStr.value, 'custom')
            //console.log(newSelection.length)
            bDisabled.value = (newSelection.length === 0)
        })

        return { 
            ...toRefs(page), isCollapsed, customSelection, 
            openHelp, distance, radius, groups, createCustom, removeCustom, bDisabled,
            showTips
        }
    }
}
</script>

<style>
    #custom-help { cursor:pointer; }
    #remove-custom { background: #c75959; border-color: #c75959; }
    #remove-custom:hover { background: #9c4a4a; border-color: #9c4a4a; }
    #customtextarea { resize: none; width:100%;}
    .p-button-rounded.p-button-outlined.cust-button {
        height: 1.8rem!important;
        width: 1.8rem;
        font-size: 12px;
    }
    .cust-button:hover { background: #546974!important; color:#fff!important; }
    .cust-button.danger:hover { border-color:#c75959!important;background: #c75959!important; color:#fff!important;}
    .radius-value { text-align:right; font-weight: 700; }
</style>