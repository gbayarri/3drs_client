<template>
    <div id="zoomwindow" v-if="isActive" class="p-shadow-2" :class="{ 'open-settings': sidebarEnabled }">
        <div id="zoomw-header">
            <span><i :class="(windowType === 'residues') ? 'fas fa-ellipsis-h' : 'fas fa-tint'"></i>&nbsp;&nbsp;{{ title }}</span>
            <div>
            <Button 
            :icon="checkAllSelected ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;"
            @click="selectAll" 
            v-tooltip.left="ttpsa" />
            <Button 
            icon="fas fa-window-close" 
            class="p-button-rounded p-button-text" 
            style="font-size:17px;"
            @click="closeWindow" />
            </div>
        </div>

        <div id="sequence-text" v-if="windowType === 'residues'">
            <div class="chain-sequence margin-bottom-10" v-for="(chain, index) in modelResidues" :key="index">
                <div class="chain-title margin-bottom-10" v-if="chain.residues.length > 0">Chain {{ chain.id }}</div>
                <Residue 
                v-for="(item, index) in chain.residues" 
                :key="index" 
                :residue="item" 
                :index="index" 
                :sheets="modelSheets" 
                :helixes="modelHelixes" 
                :window="true"
                :stage="stage"
                />
            </div>
        </div>

        <div id="water-text" v-if="windowType === 'waters'">
            <div class="chain-water margin-bottom-10" v-for="(chain, index) in modelWaters" :key="index">
                <div class="chain-title margin-bottom-10" v-if="chain.waters.length > 0">Chain {{ chain.id }}</div>
                <Water 
                v-for="(item, index) in chain.waters" 
                :key="index" 
                :water="item" 
                :index="index"
                :window="true"
                :stage="stage"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { computed, watch, reactive, toRefs, onUpdated } from 'vue'
import { useToast } from 'primevue/usetoast'
import useFlags from '@/modules/common/useFlags'
import useStage from '@/modules/ngl/useStage'
import useZoomWindow from '@/modules/representations/useZoomWindow'
import useRepresentations from '@/modules/representations/useRepresentations'
import structureSettings from '@/modules/structure/structureSettings'
import useSettings from '@/modules/settings/useSettings'
import useSelections from '@/modules/representations/useSelections'
import useProjectSettings from '@/modules/structure/useProjectSettings'
import Residue from '@/components/representation/settings/addons/Residue'
import Water from '@/components/representation/settings/addons/Water'
export default {
    components: { Residue, Water},
    setup(props) {
        
        const { getStage } = useStage()
        const { flags, setFlagStatus } = useFlags()
        const { 
            currentStructure,
            getCurrentChains, 
            getChainContent, 
            updateAllMolecules, 
            getCurrentModel, 
            //getCurrentMolecules, 
            getFileNames 
        } = structureSettings()
        const { currentRepresentation, getCurrentRepresentationSettings, setSelectionRepresentation } = useRepresentations()
        const { windowType, allSelected, setWindowType/*, toggleAllSelected*/  } = useZoomWindow()
        const { setMoleculesSettings } = useSettings()
        const { getSelection } = useSelections()
        const { getProjectSettings } = useProjectSettings()
        
        const filesList = computed(() => getFileNames())
        const currReprVal = computed(() => currentRepresentation.value)
        const currStr = computed(() => currentStructure.value)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const stage = getStage()
        const sidebarEnabled = computed(() => flags.sidebarEnabled)
        const isActive = computed(() => flags.zoomWindowEnabled)
        const toastSettings = computed(() => getProjectSettings().toasts) 

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))

        const toast = useToast()

        const page = reactive({
            title: computed(() => (windowType.value === 'residues') ? 'Sequence' : 'Waters'),
            ttpsa: computed(() => !allSelected[windowType.value] ? "Select all " + windowType.value : "Unselect all " + windowType.value)
        })

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label, currReprVal.value)
            return allContent.filter(item => chains.includes(item.id))
        }

        const getTotalContent = (wch, type) => {
            let molecules = []
            for(const c of wch) molecules = [...molecules, ...c[type].filter(item => (item.name !== null))]
            return molecules
        }


        // **********************
        // RESIDUES
        // **********************

        /*let modelResidues = computed(() => getModelContent(watchedChains.value, 'residues'))
        let modelSheets = computed(() => getModelContent(watchedChains.value, 'sheets'))
        let modelHelixes = computed(() => getModelContent(watchedChains.value, 'helixes'))*/
        const modelResidues = computed(() => getModelContent(getCurrentChains(currReprVal.value), 'residues'))
        const modelSheets = computed(() => getModelContent(getCurrentChains(currReprVal.value), 'sheets'))
        const modelHelixes = computed(() => getModelContent(getCurrentChains(currReprVal.value), 'helixes'))

        // **********************
        // WATERS
        // **********************

        //let modelWaters = computed(() => getModelContent(watchedChains.value, 'waters'))
        const modelWaters = computed(() => getModelContent(getCurrentChains(currReprVal.value), 'waters'))

        const closeWindow = () => {
            setWindowType('')
            setFlagStatus('zoomWindowEnabled', false)
        }

        const checkAllSelected = computed(() => allSelected[windowType.value] )

        // PUT THAT INSIDE WATER / RESIDUE???
        const selectAll = () => {

            let status, msg
            if(allSelected[windowType.value]) {
                status = 'remove'
                msg = updateAllMolecules(windowType.value, currReprVal.value, status)
                //console.log('I want to unselect all')
            } else {
                status = 'add'
                if(windowType.value === 'residues') msg = updateAllMolecules('residues', currReprVal.value, status, getTotalContent(modelResidues.value, 'residues'))
                else msg = updateAllMolecules('waters', currReprVal.value, status, getTotalContent(modelWaters.value, 'waters'))
                //console.log('I want to select all')
            }

            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // update representations selections
            let selection, structures
            if(windowType.value === 'residues') [selection, structures] = getSelection(getTotalContent(modelResidues.value, 'residues'), status, currReprVal.value, currStr.value, stage)
            else [selection, structures] = getSelection(getTotalContent(modelWaters.value, 'waters'), status, currReprVal.value, currStr.value, stage)
            // TODO: CLEAN residue, structure
            setMoleculesSettings(null, null, currReprVal.value)
                .then((r) => {
                    if(r.code != 404) {
                        if(toastSettings.value) {
                            toast.add({ 
                                severity: msg.status, 
                                summary: msg.tit, 
                                detail: 'All the ' + windowType.value + ' of Model ' 
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

            //console.log(windowType.value)
            /*page.ttpsa = computed(() => (allSelected.value ? 'Select all ' + windowType.value : 'Unselect all ' + windowType.value))
            // select residues / waters
            const items = document.getElementsByClassName("sequence-item")
            for(const it of items) {
                if(!allSelected.value) {
                    if(it.className.indexOf('disabled') === -1) it.classList.add('sequence-item-selected')
                } else {
                    if(it.className.indexOf('disabled') === -1) it.classList.remove('sequence-item-selected')
                }
            }
            allSelected.value = !allSelected.value*/
            //allSelected[windowType.value] = !allSelected[windowType.value]
        }

        // trick for creating reactivity with computed property
        //const watchedChains = computed(() => getCurrentChains())

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        /*watch([modelResidues, modelWaters], (newValues, prevValues) => {
            const wch = newValues[0]
            // residues
            const mdrs = newValues[0]
            //if(mdrs.length < 1) isCollapsed.value = true
            if(windowType.value === 'residues' && mdrs.length < 1) setFlagStatus('zoomWindowEnabled', false)
            // waters
            const mwt = newValues[1]
            //modelWaters  =  computed(() => getModelContent(wch, 'waters'))
            if(windowType.value === 'waters' && mwt.length < 1) setFlagStatus('zoomWindowEnabled', false)
        })*/

        onUpdated(() => {
            //console.log(windowType.value, modelResidues.value)

            // residues
            if(windowType.value === 'residues' && modelResidues.value.length < 1) setFlagStatus('zoomWindowEnabled', false)
            // waters
            if(windowType.value === 'waters' && modelResidues.value.length < 1) setFlagStatus('zoomWindowEnabled', false)

            if(isActive.value) {
                document.querySelector(".p-toast-top-right").style.top= 'calc(3% + ' + document.querySelector("#zoomwindow").offsetHeight + 'px)'
            } else  {
                document.querySelector(".p-toast-top-right").style.top= '1.5%'
            }
        })

        return { 
            ...toRefs(page), windowType, stage,
            isActive, sidebarEnabled,
            closeWindow,
            modelResidues, modelSheets, modelHelixes,
            modelWaters,
            allSelected, selectAll, checkAllSelected
        }

    }

}
</script>

<style>
    #zoomwindow { 
        position: absolute;
        left:calc(2% + 38px); 
        top:1.5%;
        width:calc(100% - (4% + 95px + 1rem)); 
        /*min-height: calc(64px + .7rem);*/
        /*max-height:20rem; */
        background: rgba(255, 255, 255, .9); 
        z-index: 2;
        border-radius:5px;
        -moz-transition-duration: 0.35s;
        -webkit-transition-duration: 0.35s;
        -o-transition-duration: 0.35s;
        transition-duration: 0.35s;
        -moz-transition-timing-function: ease;
        -webkit-transition-timing-function: ease;
        -o-transition-timing-function: ease;
        transition-timing-function: ease;
    }
    #zoomwindow.open-settings { 
        width:calc(75% - (4% + 90px + 1rem));
        -moz-transition-duration: 0.3s;
        -webkit-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -moz-transition-timing-function: ease-out;
        -webkit-transition-timing-function: ease-out;
        -o-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
    }
    
    #zoomwindow #zoomw-header { 
        width:100%; 
        padding:.5rem; 
        justify-content: space-between; 
        display:flex; 
        align-items: center; 
        font-weight: 600; 
        font-size: 18px; 
        border-bottom: 1px solid #bfd1d2;
    }
    #zoomwindow #zoomw-header button.p-button-rounded.p-button-text { height: 1.8rem; width: 1.8rem; font-size: 13px; color:#6c757d; }
    #zoomwindow #zoomw-header button.p-button-rounded.p-button-text:hover { color:#fff; background:#849096!important; }

    #zoomwindow #sequence-text { width:100%; padding:.5rem; overflow-y: auto; overflow-x: hidden; max-height:14.5rem; font-size:18px!important; line-height: 45px; }
    #zoomwindow #sequence-text .chain-title { line-height:30px; font-size:16px; }
    #zoomwindow #sequence-text .sheet { font-size: 10px; }
    #zoomwindow #sequence-text .sheet-arrow { font-size: 28px; }

    #zoomwindow #water-text { width:100%; padding:.5rem; overflow-y: auto; overflow-x: hidden; max-height:14.5rem; font-size:18px!important; line-height: 35px; }
    #zoomwindow #water-text .chain-title { line-height:30px; font-size:16px; }

</style>