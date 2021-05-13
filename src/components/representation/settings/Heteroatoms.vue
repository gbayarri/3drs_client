<template>
    <Panel :toggleable="modelHeteroatoms.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fab fa-hubspot fa-lg"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="allSelected ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;" 
            @click="selectAll" 
            v-tooltip.left="ttpsa"
            :disabled="modelHeteroatoms.length == 0" />
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpst" 
            :disabled="modelHeteroatoms.length == 0" />
        </template>

        <Listbox 
        v-model="selectedHets" 
        :options="modelHeteroatoms" 
        :multiple="true" 
        :filter="true" 
        :filterPlaceholder="filterPlaceholder"
        optionLabel="name" 
        listStyle="max-height:200px" 
        style="width:100%">
            <template #option="slotProps">
                <div
                    @mouseover="onHover(slotProps.option)"
                    @mouseleave="onLeave(slotProps.option)"
                    :id="generateID(slotProps.option.name)">
                        <Button 
                        icon="fas fa-bullseye" 
                        class="p-button-rounded p-button-text" 
                        v-tooltip.left="ttpcv"
                        @click="centerHetero(slotProps.option)"/>
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
            prevSelection = getCurrentMolecules(currReprVal.value, 'heteroatoms')
            centering = false
            //console.log(prevSelection)

            if(modelHeteroatoms.value.length < 1) isCollapsed.value = true
        })

        const page = reactive({
            header: "Heteroatoms",
            filterPlaceholder: "Search heteroatom",
            ttpsa: computed(() => !allSelected.value ? 'Select all heteroatoms' : 'Unselect all heteroatoms'),
            ttpcv: "Center view on this heteroatom",
            ttpst: "Show tips for heteroatoms"
        })

        const selectedHets = computed({
            get: () => getCurrentMolecules(currReprVal.value, 'heteroatoms'),
            set: val => selectHeteroatom(val)
        })

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label, currReprVal.value)
            return allContent.filter(item => chains.includes(item.id))
        }

        const computeHeteroList = (wch, label) => {
            const hets = []
            const het_chains = getModelContent(wch, label)
            for(const chain of het_chains) {
                for(const het of chain.heteroatoms) {
                    if(!het.id) {
                        hets.push({
                            name: chain.id.toUpperCase() + ': ' + het.name + ' ' + het.num,
                            id: het.num + ':' + chain.id.toUpperCase() + '/' + het.model,
                            model: het.model,
                            num: het.num,
                            chain: chain.id.toUpperCase(),
                            resname: het.name
                        })
                    } else {
                        hets.push(het)
                    }
                }
            }
            return hets
        }

        const modelHeteroatoms = computed(() => computeHeteroList(getCurrentChains(currReprVal.value), 'heteroatoms'))
        const allSelected = computed(() => modelHeteroatoms.value.length === selectedHets.value.length)

        // ON SELECT / DESELECT

        const selectHeteroatom = (selHs) => {

            //console.log(selHs)

            if(!centering) {

                clicked = true

                let lastItem = null
                //let status = null

                //console.log(selHs, prevSelection)

                // TO CHECK!!!

                if((selHs || selHs.length) && (prevSelection || prevSelection.length)) {
                    if(selHs.length >= prevSelection.length) {
                        console.log('selHs >= prevSelection')
                        lastItem = selHs.filter(({ id: id1 }) => !prevSelection.some(({ id: id2 }) => id2 === id1))[0]
                        //status = 'selected'
                    } else {
                        console.log('selHs < prevSelection')
                        lastItem = prevSelection.filter(({ id: id1 }) => !selHs.some(({ id: id2 }) => id1 === id2))[0]
                        //status = 'unselected'
                    }
                }

                if(!prevSelection || !prevSelection.length) {
                    console.log('No prev (adding first)')
                    lastItem = selHs[selHs.length - 1]
                    //status = 'selected'
                }

                if(!selHs || !selHs.length) {
                    console.log('No selected hets (removing last')
                    lastItem = prevSelection[prevSelection.length - 1]
                    //status = 'unselected'
                }

                //console.log(lastItem)

                const properties = {
                    stage: stage,
                    residue: lastItem,
                    type: 'heteroatoms',
                    currRepr: currReprVal.value,
                    currReprSettings: currReprSettings.value,
                    currStr: currStr.value,
                    strName: filesList.value.filter(item => item.id === currStr.value)[0].name,
                    re: re.value
                }
                actionSelectSingleMolecule(properties)

                prevSelection = selHs

            }
        }

        const selectAll = () => {

            const properties = {
                    stage: stage,
                    allSelected: allSelected.value,
                    model: modelHeteroatoms.value,
                    type: 'heteroatoms',
                    currRepr: currReprVal.value,
                    currReprSettings: currReprSettings.value,
                    currStr: currStr.value,
                    strName: filesList.value.filter(item => item.id === currStr.value)[0].name,
                    re: re.value
                }
            prevSelection = actionSelectAllHeteros(properties)

        }

        // CENTER STRUCTURE

        const centerHetero = (v) => {
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
            //actionLeave(v)
            actionLeaveSingleHetero(stage, currStr.value, v)
            // legend
            setFlagStatus('legendEnabled', false)
        }

        // ID

        const generateID = (s) => {
            return s.replace(/\:\ |\ /g,'-').toLowerCase()
        }
        
        // TIPS

        const showTips = () => {
            openModal('tips', 'heteroatoms')
        }

        return { 
            ...toRefs(page), isCollapsed, 
            modelHeteroatoms,
            selectedHets, centerHetero, onHover, onLeave, generateID, 
            allSelected, selectAll,
            showTips
        }
    }
}
</script>

<style>
    
</style>