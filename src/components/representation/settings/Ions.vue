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
import { ref, reactive, computed, watch, toRefs, onUpdated } from 'vue'
import { useToast } from 'primevue/usetoast'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useSettings from '@/modules/settings/useSettings'
import useLegend from '@/modules/viewport/useLegend'
import useFlags from '@/modules/common/useFlags'
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
            getCurrentModel, 
            getCurrentMolecules, 
            updateMolecule,
            updateAllMolecules 
        } = structureSettings()
        const { currentRepresentation, getCurrentRepresentationSettings } = useRepresentations()
        const { setMoleculesSettings, setPositionSettings } = useSettings()

        const filesList = computed(() => getFileNames())
        const currReprVal = computed(() => currentRepresentation.value)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const currStr = computed(() => currentStructure.value)
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])

        const isCollapsed = ref(true)
        //const allSelected = ref(false)

        const toast = useToast()

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
            ttpst: "Show tips for Ions"
        })

        const selectedIons = computed({
            get: () => getCurrentMolecules(currReprVal.value, 'ions'),
            set: val => selectIon(val)
        })

        const modelIons = computed(() => computeIonsList(getCurrentChains(currReprVal.value), 'ions'))
        const allSelected = computed(() => modelIons.value.length === selectedIons.value.length)

        // ON SELECT / DESELECT

        const selectIon = (selIns) => {

            if(!centering) {

                let lastItem = null
                let status = null

                //console.log(selIns, prevSelection)

                if((selIns || selIns.length) && (prevSelection || prevSelection.length)) {
                    if(selIns >= prevSelection) {
                        //console.log('selIns >= prevSelection')
                        lastItem = selIns.filter(({ id: id1 }) => !prevSelection.some(({ id: id2 }) => id2 === id1))[0]
                        status = 'selected'
                    } else {
                        //console.log('selIns < prevSelection')
                        lastItem = prevSelection.filter(({ id: id1 }) => !selIns.some(({ id: id2 }) => id1 === id2))[0]
                        status = 'unselected'
                    }
                }

                if(!prevSelection || !prevSelection.length) {
                    //console.log('No prev (adding first)')
                    lastItem = selIns[selIns.length - 1]
                    status = 'selected'
                }

                if(!selIns || !selIns.length) {
                    //console.log('No selected ions (removing last')
                    lastItem = prevSelection[prevSelection.length - 1]
                    status = 'unselected'
                }

                //console.log(status, lastItem)

                const [settings, msg] = updateMolecule(lastItem, 'ions', currReprVal.value)
                const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
                // TODO: CLEAN residue, structure
                setMoleculesSettings(lastItem, currStr.value, currReprVal.value)
                    .then((r) => {
                        if(r.code != 404) {
                            toast.add({ 
                                severity: msg.status, 
                                summary: msg.tit, 
                                detail: 'The ion [ Model ' 
                                        + (lastItem.model + 1)
                                        + ' | Chain ' 
                                        + lastItem.chain 
                                        + ' | ' 
                                        + lastItem.resname 
                                        + ' ' 
                                        + lastItem.num 
                                        + ' ] of ' 
                                        + strName 
                                        + ' structure has been ' 
                                        + msg.txt 
                                        + currReprSettings.value.name 
                                        + ' representation',
                                life: 10000
                            })
                            console.log(r.message)
                        } else  console.error(r.message)
                    })

                prevSelection = selIns
            }
        }

        // trick for creating reactivity with computed property
        //const watchedChains = computed(() => getCurrentChains(currReprVal.value))

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
                    ions.push({
                        name: chain.id.toUpperCase() + ': ' + ion.name + ' ' + ion.num,
                        id: ion.num + ':' + chain.id.toUpperCase() + '/' + ion.model,
                        model: ion.model,
                        num: ion.num,
                        chain: chain.id.toUpperCase(),
                        resname: ion.name
                    })
                }
            }
            return ions
        }

        //const modelIons = computed(() => computeIonsList(getCurrentChains(currReprVal.value), 'ions'))
        //let modelIons = computed(() => computeIonsList(watchedChains.value, 'ions'))
        //console.log(modelIons.value)

        const selectAll = () => {
            /*page.ttpsa = allSelected.value ? 'Select all ions' : 'Unselect all ions'
            selectedIons.value = allSelected.value ? null : modelIons.value
            allSelected.value = !allSelected.value*/
            let settings, msg
            if(allSelected.value) {
                [settings, msg] = updateAllMolecules('ions', currReprVal.value, 'unselect')
                //console.log('I want to unselect all')
            } else {
                [settings, msg] = updateAllMolecules('ions', currReprVal.value, 'select', modelIons.value)
                //console.log('I want to select all')
            }

            //console.log(selectedIons.value)

            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // TODO: CLEAN residue, structure
            setMoleculesSettings(null, null, currReprVal.value)
                .then((r) => {
                    if(r.code != 404) {
                        prevSelection = getCurrentMolecules(currReprVal.value, 'ions')
                        toast.add({ 
                            severity: msg.status, 
                            summary: msg.tit, 
                            detail: 'All the ions of Model ' 
                                    + (getCurrentModel(currReprVal.value) + 1)
                                    + ' in ' 
                                    + strName 
                                    + ' structure have been ' 
                                    + msg.txt 
                                    + currReprSettings.value.name 
                                    + ' representation',
                            life: 10000
                        })
                        console.log(r.message)
                    } else  console.error(r.message)
                })
        }

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        //watch([/*watchedChains,*/ modelIons/*, selectedIons*/], (newValues, prevValues) => {
            //const wch = newValues[0]
            //const mdis = newValues[0]
            //const sins = newValues[1]
            //modelIons  =  computed(() => computeIonsList(wch, 'ions'))
            //console.log(modelIons.value)
            //if(mdis.length < 1) isCollapsed.value = true
            //if(!sins || sins.length === 0) allSelected.value = false
            //if(sins && (sins.length === mdis.length)) allSelected.value = true
            //if(sins.length < modelIons.value.length) allSelected.value = false
        //})

        // CENTER STRUCTURE

        const centerIon = (v) => {
            centering = true
            component.value.autoView(v.id, 500)
            setPositionSettings(stage)
                .then((r) => {
                    centering = false
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        // MOUSE OVER

        const onHover = (v) => {
            // NGL representation
            const sele = v.num + ':' + v.chain + '/' + v.model
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
                chainname: v.chain,
                resname: v.resname,
                resno: v.num,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
        }

        // MOUSE LEAVE

        const onLeave = (v) => {
            // NGL representation
            const sele = v.num + ':' + v.chain + '/' + v.model
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const showTips = () => {
            console.log("show tips")
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