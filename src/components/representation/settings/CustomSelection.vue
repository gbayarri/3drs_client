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
                <div class="p-inputgroup">
                    <Button icon="pi pi-check" @click="createCustom" :disabled="bDisabled" />
                    <InputText v-model="customSelection" :placeholder="placeholder"/>
                    <Button icon="pi pi-trash" @click="removeCustom" id="remove-custom" v-if="!bDisabled"  />
                </div>
            </div>
        </div>

    </Panel>
</template>

<script>
import { ref, computed, reactive, toRefs, watch } from 'vue'
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

        const isCollapsed = ref(true)
        const currReprVal = computed(() => currentRepresentation.value)
        const currStr = computed(() => currentStructure.value)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const filesList = computed(() => getFileNames())
        const toastSettings = computed(() => getProjectSettings().toasts) 

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))
        
        let newSelection = getCurrentSelection(currReprVal.value, currStr.value, 'custom')
        let bDisabled = ref(newSelection.length === 0)

        const toast = useToast()

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
            ttpst: "Show tips for Custom Selection"
        })

        const openHelp = () => {
            window.open(process.env.VUE_APP_NGL_HELP_URL, '_blank')
        }        

        const createCustom = () => {
            if(newSelection) {
                //console.log(newSelection, 'redraw!!!')
                const [old_sele, structures] = setCurrentCustomSelection(currReprVal.value, currStr.value, newSelection)
                // save selection representation
                setSelectionRepresentation(stage, newSelection, structures, re.value, true)
                    .then((r) => {
                        if(r.code != 404) {
                            //console.log(stage)
                            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
                            if(toastSettings.value) {
                                toast.add({ 
                                    severity: 'info', 
                                    summary: 'New custom representation', 
                                    detail: 'A new custom selection has been added to the structure '
                                            + strName
                                            + ' of the '
                                            + currReprSettings.value.name 
                                            + ' representation',
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
                newSelection = ''
                bDisabled.value = true
                //console.log(newSelection, 'redraw!!!')
                const [sele, structures] = setCurrentCustomSelection(currReprVal.value, currStr.value, '')
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
                                    detail: 'The custom representation linked to the structure '
                                            + strName
                                            + ' of the '
                                            + currReprSettings.value.name 
                                            + ' representation has been removed',
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

        watch([currStr], (newValues, prevValues) => {
            newSelection = getCurrentSelection(currReprVal.value, currStr.value, 'custom')
            //console.log(newSelection.length)
            bDisabled.value = (newSelection.length === 0)
        })

        return { 
            ...toRefs(page), isCollapsed, customSelection, 
            openHelp, createCustom, removeCustom, bDisabled,
            showTips
        }
    }
}
</script>

<style>
    #custom-help { cursor:pointer; }
    #remove-custom { background: #c75959; border-color: #c75959; }
    #remove-custom:hover { background: #9c4a4a; border-color: #9c4a4a; }
</style>