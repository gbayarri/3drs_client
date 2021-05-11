<template>
    <Panel :toggleable="modelResidues.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-ellipsis-h"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="externalWindow ? 'fas fa-external-link-square-alt fa-flip-vertical' : 'fas fa-external-link-square-alt fa-flip-horizontal'" 
            class="p-button-rounded p-button-text"
            style="font-size:16px;" 
            @click="openOut" 
            v-tooltip.left="ttpoo"
            :disabled="modelResidues.length == 0" />
            <Button 
            :icon="allSelected.residues ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;"
            @click="selectAll" 
            v-tooltip.left="ttpsa"
            :disabled="modelResidues.length == 0" />
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpst" 
            :disabled="modelResidues.length == 0" />
        </template>
        <div id="sequence-text">
            <div class="chain-sequence margin-bottom-10" v-for="(chain, index) in modelResidues" :key="index">
                <div class="chain-title margin-bottom-10" v-if="chain.residues.length > 0">Chain {{ chain.id }}</div>
                <Residue 
                v-for="(item, index) in chain.residues" 
                :key="index" 
                :residue="item" 
                :index="index" 
                :sheets="modelSheets" 
                :helixes="modelHelixes" 
                :window="false"
                :stage="stage" />
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
import Residue from '@/components/representation/settings/addons/Residue'
export default {
    props: ['stage'],
    components: { Residue },
    setup(props) {

        const stage = props.stage
        const { flags, setFlagStatus } = useFlags()
        const { windowType, allSelected, setWindowType } = useZoomWindow()
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
        const externalWindow = computed(() => (flags.zoomWindowEnabled && windowType.value === 'residues'))
        const toastSettings = computed(() => getProjectSettings().toasts) 
        //const allVisible = ref(false)

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))

        const toast = useToast()

        const page = reactive({
            header: "Sequence",
            //ttpha: "Hide all residues",
            //ttpsa: "Select all residues",
            ttpsa: computed(() => !allSelected.residues ? 'Select all residues' : 'Unselect all residues'),
            ttpoo: computed(() => (flags.zoomWindowEnabled && windowType.value === 'residues') ? 'Close external window' : 'View sequence in external window'),
            ttpst: "Show tips for sequence residues"
        })

        //const checkAllSelected = computed(() => allSelected['residues'] )
        
        //console.log(getCurrentMolecules(currReprVal.value, 'residues'))

        // trick for creating reactivity with computed property
        //const watchedChains = computed(() => getCurrentChains())

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label, currReprVal.value)
            return allContent.filter(item => chains.includes(item.id))
        }

        const getTotalContent = (wch) => {
            let residues = []
            for(const c of wch) residues = [...residues, ...c.residues.filter(item => (item.name !== null && item.id !== null))]
            return residues
        }

        /*const modelResidues = computed(() => getModelContent(watchedChains.value, 'residues'))
        const modelSheets = computed(() => getModelContent(watchedChains.value, 'sheets'))
        const modelHelixes = computed(() => getModelContent(watchedChains.value, 'helixes'))*/
        const modelResidues = computed(() => getModelContent(getCurrentChains(currReprVal.value), 'residues'))
        const modelSheets = computed(() => getModelContent(getCurrentChains(currReprVal.value), 'sheets'))
        const modelHelixes = computed(() => getModelContent(getCurrentChains(currReprVal.value), 'helixes'))
        /*console.log(modelResidues.value)
        console.log(modelSheets.value)
        console.log(modelHelixes.value)*/

        allSelected['residues'] = computed(() => getTotalContent(modelResidues.value).length === getCurrentMolecules(currReprVal.value, 'residues').length)

        const openOut = () => {
            if(!externalWindow.value) {
                setWindowType('residues')
                setFlagStatus('zoomWindowEnabled', true)
            } else {
                setWindowType('')
                setFlagStatus('zoomWindowEnabled', false)
            }
        }

        const selectAll = () => {

            let status, msg
            if(allSelected.residues) {
                status = 'remove'
                msg = updateAllMolecules('residues', currReprVal.value, status)
                //console.log('I want to unselect all')
            } else {
                status = 'add'
                msg = updateAllMolecules('residues', currReprVal.value, status, getTotalContent(modelResidues.value))
                //console.log('I want to select all')
            }

            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // update representations selections
            const [selection, structures] = getSelection(getTotalContent(modelResidues.value), status, currReprVal.value, currStr.value, stage)
            // TODO: CLEAN residue, structure
            setMoleculesSettings(null, null, currReprVal.value)
                .then((r) => {
                    if(r.code != 404) {
                        if(toastSettings.value) {
                            toast.add({ 
                                severity: msg.status, 
                                summary: msg.tit, 
                                detail: 'All the residues of Model ' 
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

        const showTips = () => {
            openModal('tips', 'residues')
        }

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        // modifying isCollapsed & selectedChains v-model properties without computed()
        //watch([modelResidues], (newValues, prevValues) => {
            //const wch = newValues[0]
            /*modelResidues  =  computed(() => getModelContent(wch, 'residues'))
            modelSheets = computed(() => getModelContent(wch, 'sheets'))
            modelHelixes = computed(() => getModelContent(wch, 'helixes'))*/
            //console.log(modelResidues.value)
            /*console.log(modelSheets.value)
            console.log(modelHelixes.value)*/
            //const mdrs = newValues[0]
            //if(mdrs.length < 1) isCollapsed.value = true
        //})

        onUpdated(() => {
            if(modelResidues.value.length < 1) isCollapsed.value = true
        })

        return { 
            ...toRefs(page), isCollapsed, stage,
            modelResidues, modelSheets, modelHelixes,
            openOut, externalWindow,
            allSelected, selectAll, /*checkAllSelected,*/
            showTips
            /*hideAll, allVisible */
        }
    }
}
</script>

<style>
    #sequence-text {
        font-family: monospace;
        font-size: 14px !important;
        line-height: 35px;
        word-break: break-all;
        overflow-y: auto; 
        overflow-x: hidden; 
        max-height:15rem;
    }
    #sequence-text .chain-title {
        font-family: 'Open Sans';
        background: #e1ebf7;
        padding-left: .5rem;
        line-height: 25px;
    }
    #sequence-text .sequence-item { position:relative; z-index:1; padding:0 0.5px; cursor:default; user-select: none; }
    #sequence-text .sequence-item:not(.disabled) { cursor: pointer; }    
    /*#sequence-text .sequence-item:not(.disabled):hover,*/
    .sequence-item-hover {
        color: #fff;
        background: #99a8b9;
    }
    .sequence-item-selected {
        color: #fff;
        background: #5E738B;
    }
    #sequence-text .sequence-number {
        color: #325880;
        word-break: keep-all;
        cursor: default;
        position: relative;
        top: -1.1em;
        left: 3.1em;
        padding: 0px;
        margin-left: -3em;
        font-size: 80%;
        user-select: none;
    }
    #sequence-text .sheet {
        background: rgb(104, 158, 153);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 1.3em;
        left: 0;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 8px;
        user-select: none;
    }
    #sequence-text .sheet-arrow {
        color: rgb(104, 158, 153);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 0.6em;
        left: .7em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 22px;
        user-select: none;
    }
    #sequence-text .helix {
        background-repeat: no-repeat; 
        background-image: url("~@/assets/img/bg_helix.png"); 
        background-position: center bottom;
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 1.1em;
        left: 0.4em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 10px;
        user-select: none;
    }
</style>