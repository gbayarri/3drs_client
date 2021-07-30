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
        <div class="p-grid" v-if="enableDistance">
            <div class="p-col">
                <InputSwitch v-model="distance" class="margin-top-5" :disabled="bDisabled" /> 
                <span style="position:relative; top:-8px; margin-left:10px;">
                    {{ dst }} <i class="far fa-question-circle" id="custom-help" v-tooltip.left="ttpd"></i>
                </span>
            </div>
        </div>
        <div v-if="distance">
            <div class="p-grid margin-top-10">
                <div class="p-col">
                    <label>{{ label_radius }} <i class="far fa-question-circle" id="custom-help" v-tooltip.top="ttpr"></i></label>
                </div>
                <div class="p-col radius-value">
                    <label>{{ radius }}</label>
                </div>
            </div>
            <div class="p-grid margin-top-5">
                <div class="p-col">
                    <div class="p-inputgroup">
                        <Slider v-model="radius" :min="0" :max="50" />
                    </div>
                </div>
            </div>
            <div class="p-grid margin-top-10">
                <div class="p-col">
                    <label>{{ label_groups }} <i class="far fa-question-circle" id="custom-help" v-tooltip.top="ttpg"></i></label>
                </div>
            </div>
            <div class="p-grid">
                <div class="p-col">
                    <InputSwitch v-model="groups" class="margin-top-5" />
                </div>
            </div>
        </div>
        <div class="p-grid margin-top-5" style="border-top: 1px solid #d0dfef;">
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
        const { getCurrentSelection, getCurrentDistanceBasedSelection, setCurrentCustomSelection/*, setCurrentDistanceSelection*/ } = useSelections()
        const { getProjectSettings } = useProjectSettings()

        const isCollapsed = ref(false)
        const currReprVal = computed(() => currentRepresentation.value)
        const currStr = computed(() => currentStructure.value)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const distBSettings = computed(() => getCurrentDistanceBasedSelection(currReprVal.value, currStr.value))
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
            ttpd: "Get a selection of atoms that are within a certain distance of the above selection.",
            label_radius: "Distance",
            ttpr: "Distance from selection in Ångstroms.",
            label_groups: "Whole residue(s)",
            ttpg: "Whether to select or not the whole residue from the selected atoms."
        })

        const openHelp = () => {
            window.open(process.env.VUE_APP_NGL_HELP_URL, '_blank')
        }        

        // DISTANCE-BASED SELECTION

        const enableDistance = computed(() => distBSettings.value !== undefined)

        // change distance from switch
        const changeDistance = (value) => {
            distBSettings.value.active = value
        }
        const distance = computed({
            get: () => {
                if(!enableDistance.value) return false
                else return bDisabled.value ? false : distBSettings.value.active
            },
            set: val => changeDistance(val)
        })

        // change radius from switch
        const changeRadius = (value) => {
            distBSettings.value.radius = value

        }
        const radius = computed({
            get: () => distBSettings.value.radius,
            set: val => changeRadius(val)
        })

        // change groups from switch
        const changeGroups = (value) => {
            distBSettings.value.groups = value
        }
        const groups = computed({
            get: () => distBSettings.value.groups,
            set: val => changeGroups(val)
        })

        const createCustom = () => {
            if(newSelection) {
                console.log(newSelection, 'redraw!!!')
                const [old_sele, structures] = setCurrentCustomSelection(stage, currReprVal.value, currStr.value, newSelection)
                // save selection representation
                setSelectionRepresentation(stage, newSelection, structures, re.value, true, component.value, distBSettings.value/*, re_others.value*/)
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
                setSelectionRepresentation(stage, sele, structures, re.value, true)
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
            openHelp, enableDistance, distance, radius, groups, createCustom, removeCustom, bDisabled,
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