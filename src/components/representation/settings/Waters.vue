<template>
    <Panel :toggleable="modelWaters.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-tint"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="externalWindow ? 'fas fa-external-link-square-alt fa-flip-vertical' : 'fas fa-external-link-square-alt fa-flip-horizontal'" 
            class="p-button-rounded p-button-text"
            style="font-size:16px;" 
            @click="openOut" 
            v-tooltip.left="ttpoo"
            :disabled="modelWaters.length == 0" />
            <Button 
            :icon="allSelected.waters ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;" 
            @click="selectAll" 
            v-tooltip.left="ttpsa"
            :disabled="modelWaters.length == 0" />
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpst" 
            :disabled="modelWaters.length == 0" />
        </template>
        <div id="water-text">
            <div class="chain-water margin-bottom-10" v-for="(chain, index) in modelWaters" :key="index">
                <div class="chain-title margin-bottom-10" v-if="chain.waters.length > 0">Chain {{ chain.id }}</div>
                <Water 
                v-for="(item, index) in chain.waters" 
                :key="index" 
                :water="item" 
                :index="index"
                :window="false"
                :stage="stage"
                />
            </div>
        </div>
    </Panel>
</template>

<script>
import { ref, reactive, computed, watch, toRefs, onUpdated } from 'vue'
import { useToast } from 'primevue/usetoast'
import useFlags from '@/modules/common/useFlags'
import useZoomWindow from '@/modules/representations/useZoomWindow'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useSettings from '@/modules/settings/useSettings'
import useSelections from '@/modules/representations/useSelections'
import useModals from '@/modules/common/useModals'
import useProjectSettings from '@/modules/structure/useProjectSettings'
import Water from '@/components/representation/settings/addons/Water'
export default {
    props: ['stage'],
    components: { Water },
    setup(props) {

        const stage = props.stage
        const { flags, setFlagStatus } = useFlags()
        const { windowType, allSelected, setWindowType } = useZoomWindow()
        //const { getCurrentChains, getChainContent } = structureSettings()
        const { 
            currentStructure,
            getCurrentChains, 
            getChainContent, 
            updateAllMolecules, 
            getCurrentModel, 
            getCurrentMolecules, 
            getFileNames 
        } = structureSettings()
        const { currentRepresentation, getCurrentRepresentationSettings, setSelectionRepresentation } = useRepresentations()
        const { setMoleculesSettings } = useSettings()
        const { getSelection } = useSelections()
        const { openModal } = useModals()
        const { getProjectSettings } = useProjectSettings()

        const filesList = computed(() => getFileNames())
        const isCollapsed = ref(true)
        //const allSelected = ref(false)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const currReprVal = computed(() => currentRepresentation.value)
        const currStr = computed(() => currentStructure.value)
        const externalWindow = computed(() => (flags.zoomWindowEnabled && windowType.value === 'waters'))
        const toastSettings = computed(() => getProjectSettings().toasts) 

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))

        const toast = useToast()

        const page = reactive({
            header: "Waters",
            //ttpha: "Hide all waters",
            //ttpsa: "Select all waters",
            ttpsa: computed(() => !allSelected.waters ? 'Select all waters' : 'Unselect all waters'),
            ttpoo: computed(() => (flags.zoomWindowEnabled && windowType.value === 'waters') ? 'Close external window' : 'View waters in external window'),
            ttpst: "Show tips for waters"
        })

        //const checkAllSelected = computed(() => allSelected['waters'] )

        // trick for creating reactivity with computed property
        //const watchedChains = computed(() => getCurrentChains())

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label, currReprVal.value)
            return allContent.filter(item => chains.includes(item.id))
        }

        const getTotalContent = (wch) => {
            let waters = []
            for(const c of wch) waters = [...waters, ...c.waters.filter(item => (item.name !== null))]
            return waters
        }

        //let modelWaters = computed(() => getModelContent(watchedChains.value, 'waters'))
        const modelWaters = computed(() => getModelContent(getCurrentChains(currReprVal.value), 'waters'))
        //console.log(modelWaters.value)

        allSelected['waters'] = computed(() => getTotalContent(modelWaters.value).length === getCurrentMolecules(currReprVal.value, 'waters').length)

        const openOut = () => {
            if(!externalWindow.value) {
                setWindowType('waters')
                setFlagStatus('zoomWindowEnabled', true)
            } else {
                setWindowType('')
                setFlagStatus('zoomWindowEnabled', false)
            }
        }

        const selectAll = () => {
            
            let status, msg
            if(allSelected.waters) {
                status = 'remove'
                msg = updateAllMolecules('waters', currReprVal.value, status)
                //console.log('I want to unselect all')
            } else {
                status = 'add'
                msg = updateAllMolecules('waters', currReprVal.value, status, getTotalContent(modelWaters.value))
                //console.log('I want to select all')
            }

            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // update representations selections
            const [selection, structures] = getSelection(getTotalContent(modelWaters.value), status, currReprVal.value, currStr.value)
            // TODO: CLEAN residue, structure
            setMoleculesSettings(null, null, currReprVal.value)
                .then((r) => {
                    if(r.code != 404) {
                        if(toastSettings.value) {
                            toast.add({ 
                                severity: msg.status, 
                                summary: msg.tit, 
                                detail: 'All the waters of Model ' 
                                        + (getCurrentModel(currReprVal.value) + 1)
                                        + ' in ' 
                                        + strName 
                                        + ' structure have been ' 
                                        + msg.txt 
                                        + currReprSettings.value.name 
                                        + ' representation',
                                life: 10000
                            })
                        }
                        // check if selection is empty
                        if(selection === 'not(*)' && toastSettings.value) {
                            toast.add({ severity: 'warn', summary: 'Empty structure', detail: 'Warning! The ' + strName + ' structure of the ' + currReprSettings.value.name + ' representation is currently empty.', life: 10000 })
                        }
                        // save selection representation
                        setSelectionRepresentation(stage, selection, structures, re.value, true)
                            .then((r) => {
                                if(r.code != 404) console.log(r.message)
                                else console.error(r.message)
                            })
                        console.log(r.message)
                    } else  console.error(r.message)
                })

        }

        // TODO!!!! ADD TO NAVIGATION
        // FUNCTION onClick OR SIMILAR

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        //watch([modelWaters], (newValues, prevValues) => {
            //const wch = newValues[0]
            //modelWaters  =  computed(() => getModelContent(wch, 'waters'))
            //console.log(modelWaters.value)
            //const mwt = newValues[0]
            //if(mwt.length < 1) isCollapsed.value = true
        //})

        const showTips = () => {
            openModal('tips', 'waters')
        }

        onUpdated(() => {
            if(modelWaters.value.length < 1) isCollapsed.value = true
        })

        return { 
            ...toRefs(page), isCollapsed, stage,
            modelWaters,
            openOut, externalWindow,
            allSelected, selectAll, /*checkAllSelected,*/
            showTips
        }
    }
}
</script>

<style>
   #water-text {
        font-family: monospace;
        font-size: 14px !important;
        line-height: 35px;
        word-break: break-all;
        overflow-y: auto; 
        overflow-x: hidden; 
        max-height:15rem;
    }
    #water-text .chain-title {
        font-family: 'Open Sans';
        background: #e1ebf7;
        padding-left: .5rem;
        line-height: 25px;
    }
    #water-text .water-item { position:relative; z-index:1; padding:0 1.5px; cursor:default; user-select: none; }
    #water-text .water-item:not(.disabled) { cursor: pointer; }    
    /*#water-text .water-item:not(.disabled):hover,*/
    .water-item-hover {
        color: #fff;
        background: #99a8b9;
    }
    .water-item-selected {
        color: #fff;
        background: #5E738B;
    }
    #water-text .water-number {
        color: #325880;
        word-break: keep-all;
        cursor: default;
        position: relative;
        top: -1.1em;
        left: 3.1em;
        padding: 0;
        margin-left: -3em;
        font-size: 80%;
        user-select: none;
    }
</style>