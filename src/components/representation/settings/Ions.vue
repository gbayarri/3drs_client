<template>
    <Panel :toggleable="modelIons.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="far fa-dot-circle"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="allSelected ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;" 
            @click="selectAll" 
            v-tooltip.left="ttpsa"
            :disabled="modelIons.length == 0" />
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpst" 
            :disabled="modelIons.length == 0" />
        </template>
        
        <Listbox 
        v-model="selectedIons" 
        :options="modelIons" 
        :multiple="true" 
        :filter="true" 
        :filterPlaceholder="filterPlaceholder"
        optionLabel="name" 
        listStyle="max-height:200px" 
        style="width:100%">
            <template #option="slotProps">
                <div
                    @mouseover="onHover(slotProps.option)"
                    @mouseleave="onLeave(slotProps.option)" >
                        <Button 
                        icon="fas fa-bullseye" 
                        class="p-button-rounded p-button-text" 
                        v-tooltip.left="ttpcv"
                        @click="centerIon(slotProps.option)"/>
                        <span>{{slotProps.option.name}}</span>
                </div>
            </template>
        </Listbox>

    </Panel>
</template>

<script>
import { ref, reactive, computed, toRefs, onUpdated } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useSettings from '@/modules/settings/useSettings'
import useLegend from '@/modules/viewport/useLegend'
import useFlags from '@/modules/common/useFlags'
import useModals from '@/modules/common/useModals'
import useActions from '@/modules/representations/useActions'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage

        const { updateLegend } = useLegend()
        const { setFlagStatus } = useFlags()
        const { 
            currentStructure, 
            getCurrentChains, 
            getChainContent, 
            getFileNames, 
            getCurrentMolecules, 
        } = structureSettings()
        const { currentRepresentation, getCurrentRepresentationSettings, setSelectionRepresentation } = useRepresentations()
        const { setPositionSettings } = useSettings()
        const { openModal } = useModals()
        const { actionLeaveSingleHetero, actionSelectSingleMolecule, actionSelectAllHeteros } = useActions()

        const filesList = computed(() => getFileNames())
        const currReprVal = computed(() => currentRepresentation.value)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const currStr = computed(() => currentStructure.value)
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])

        const isCollapsed = ref(true)
        let clicked = false
        const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))


        // trick for catch which is the last selected / unselected
        let prevSelection = null
         // trick for avoid selecting / unselecting when clicking center
        let centering = false
        onUpdated(() => {
            //console.log('updated')
            prevSelection = getCurrentMolecules(currReprVal.value, 'ions')
            centering = false
            //console.log(prevSelection)

            if(modelIons.value.length < 1) isCollapsed.value = true
        })

        const page = reactive({
            header: "Ions",
            filterPlaceholder: "Search ion",
            ttpsa: computed(() => !allSelected.value ? 'Select all ions' : 'Unselect all ions'),
            ttpcv: "Center view on this ion",
            ttpst: "Show tips for ions"
        })

        const selectedIons = computed({
            get: () => getCurrentMolecules(currReprVal.value, 'ions'),
            set: val => selectIon(val)
        })

        //console.log(selectedIons.value)
        //

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label, currReprVal.value)
            return allContent.filter(item => chains.includes(item.id))
        }

        const computeIonsList = (wch, label) => {
            const ions = []
            const ion_chains = getModelContent(wch, label)
            for(const chain of ion_chains) {
                for(const ion of chain.ions) {
                    if(!ion.id) {
                        ions.push({
                            name: chain.id.toUpperCase() + ': ' + ion.name + ' ' + ion.num,
                            id: ion.num + ':' + chain.id.toUpperCase() + '/' + ion.model,
                            model: ion.model,
                            num: ion.num,
                            chain: chain.id.toUpperCase(),
                            resname: ion.name
                        })
                    } else {
                        ions.push(ion)
                    }
                }
            }
            //console.log(ions)
            return ions
        }

        const modelIons = computed(() => computeIonsList(getCurrentChains(currReprVal.value), 'ions'))
        //console.log(modelIons.value)
        const allSelected = computed(() => modelIons.value.length === selectedIons.value.length)

        // ON SELECT / DESELECT

        const selectIon = (selIns) => {

            if(!centering) {

                clicked = true

                let lastItem = null
                //let status = null

                //console.log(selIns, prevSelection)

                if((selIns || selIns.length) && (prevSelection || prevSelection.length)) {
                    if(selIns >= prevSelection) {
                        //console.log('selIns >= prevSelection')
                        lastItem = selIns.filter(({ id: id1 }) => !prevSelection.some(({ id: id2 }) => id2 === id1))[0]
                        //status = 'selected'
                    } else {
                        //console.log('selIns < prevSelection')
                        lastItem = prevSelection.filter(({ id: id1 }) => !selIns.some(({ id: id2 }) => id1 === id2))[0]
                        //status = 'unselected'
                    }
                }

                if(!prevSelection || !prevSelection.length) {
                    //console.log('No prev (adding first)')
                    lastItem = selIns[selIns.length - 1]
                    //status = 'selected'
                }

                if(!selIns || !selIns.length) {
                    //console.log('No selected ions (removing last')
                    lastItem = prevSelection[prevSelection.length - 1]
                    //status = 'unselected'
                }

                if(lastItem === undefined) lastItem = getCurrentMolecules(currReprVal.value, 'ions')[0]

                const properties = {
                    stage: stage,
                    residue: lastItem,
                    type: 'ions',
                    currRepr: currReprVal.value,
                    currReprSettings: currReprSettings.value,
                    currStr: currStr.value,
                    strName: filesList.value.filter(item => item.id === currStr.value)[0].name,
                    re: re.value
                }
                actionSelectSingleMolecule(properties)

                if(selIns || selIns.length) prevSelection = selIns
            }
        }


        const selectAll = () => {

            const properties = {
                    stage: stage,
                    allSelected: allSelected.value,
                    model: modelIons.value,
                    type: 'ions',
                    currRepr: currReprVal.value,
                    currReprSettings: currReprSettings.value,
                    currStr: currStr.value,
                    strName: filesList.value.filter(item => item.id === currStr.value)[0].name,
                    re: re.value
                }
            prevSelection = actionSelectAllHeteros(properties)

        }

        // CENTER STRUCTURE

        const centerIon = (v) => {
            centering = true
            // sanitize selection in case there is @ chain
            const s = v.id.replace(/@/g, '')
            component.value.autoView(s, 500)
            setPositionSettings(stage)
                .then((r) => {
                    centering = false
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        // MOUSE OVER

        const onHover = (v) => {
            if(!clicked) {
                // NGL representation
                const sele = v.num + ':' + (v.chain === '@' ? '' : v.chain) + '/' + v.model
                const new_name = currStr.value + '-' + sele + '-hover'
                if(stage.getRepresentationsByName(new_name).list.length === 0) {
                    component.value.addRepresentation( "spacefill", { 
                        name: new_name,
                        sele: '(' + sele + ')', 
                        opacity:.5, 
                        radius:2,
                        color:'#5E738B' 
                    })
                }
                // legend
                const name = filesList.value.filter(item => item.id === currStr.value)[0].name
                updateLegend({
                    name: name,
                    model: v.model,
                    chainname: v.chain,
                    resname: v.resname,
                    resno: v.num,
                    atomname: null
                })
                setFlagStatus('legendEnabled', true)
            }
        }

        // MOUSE LEAVE

        const onLeave = (v) => {
            clicked = false
            actionLeaveSingleHetero(stage, currStr.value, v)
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const showTips = () => {
            openModal('tips', 'ions')
        }

        return { 
            ...toRefs(page), isCollapsed, 
            modelIons,
            selectedIons, onHover, onLeave, centerIon,
            allSelected, selectAll,
            showTips
         }
    }
}
</script>

<style>
    
</style>