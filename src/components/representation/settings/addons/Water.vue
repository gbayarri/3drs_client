<template>
    <span class="water-number" v-if="index % 10 === 0">{{ water.num }}
        <span v-if="water.num.toString().length == 3">&nbsp;</span>
        <span v-if="water.num.toString().length == 2">&nbsp;&nbsp;</span>
        <span v-if="water.num.toString().length == 1">&nbsp;&nbsp;&nbsp;</span>
    </span>

    <span v-if="water.chain" :class="isSelected ? 'water-item water-item-selected' : 'water-item'"
    :data-model="water.model" 
    :data-chain="water.chain" 
    :data-resnum="water.num" 
    :data-resname="water.name" 
    @mouseover="onMouseOver(water.model, water.chain, water.num, water.name)"
    @mouseleave="onMouseLeave(water.model, water.chain, water.num, water.name)"
    @click.exact="onClick(water.model, water.chain, water.num, water.name)"
    @click.shift.exact="onSelectMultiple(water.model, water.chain, water.num, water.name)"
    @click.alt.exact="centerWater(water.model, water.chain, water.num, water.name)">W</span>
    <span v-else class="water-item disabled">&nbsp;</span>

</template>

<script>
import { computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import structureSettings from '@/modules/structure/structureSettings'
import structureStorage from '@/modules/structure/structureStorage'
import useLegend from '@/modules/viewport/useLegend'
import useFlags from '@/modules/common/useFlags'
import useSettings from '@/modules/settings/useSettings'
import useSelections from '@/modules/representations/useSelections'
import useRepresentations from '@/modules/representations/useRepresentations'
export default {
    props: ['water', 'window', 'index', 'item', 'stage'],
    setup(props) {

        const stage = props.stage

        const { updateLegend } = useLegend()
        const { setFlagStatus } = useFlags()
        const { currentStructure, getFileNames, checkIfMoleculeExists, updateMolecules } = structureSettings()
        const { projectData } = structureStorage()
        const { addMultipleResidues, createSelection } = useSelections()
        const { currentRepresentation, getCurrentRepresentationSettings } = useRepresentations()
        const { setMoleculesSettings, setPositionSettings } = useSettings()

        const filesList = computed(() => getFileNames())
        const dataProject = computed(() => projectData.value)
        const currStr = computed(() => currentStructure.value)
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])
        const currReprVal = computed(() => currentRepresentation.value)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())

        const water =  computed(() => props.water)
        const window =  computed(() => props.window)

        const isSelected = computed(() => checkIfMoleculeExists(water.value, 'waters', currReprVal.value))

        const toast = useToast()

        const onMouseOver = (model, chain, resnum, resname) => {
            // NGL representation
            const sele = resnum + ':' + chain + '/' + model
            const new_name = currStr.value + '-' + sele + '-hover'
            component.value.addRepresentation( "spacefill", { 
                name: new_name,
                sele: '(' + sele + ')', 
                opacity:.5, 
                radius:2,
                color:'#5E738B' 
            })
            // residue respresentation
            const waters = document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"][data-resname="' + resname + '"]')
            for(const wat of waters) {
                wat.classList.add('water-item-hover')
            }
            // legend
            const name = filesList.value.filter(item => item.id === currStr.value)[0].name
            updateLegend({
                name: name,
                chainname: chain,
                resname: resname,
                resno: resnum,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
            // old tooltip format
            //v-tooltip.left="'Water<br>' + water.chain + ': ' + water.name + ' ' + water.num"
        }

        const onMouseLeave = (model, chain, resnum, resname) => {
            // NGL representation
            const sele = resnum + ':' + chain + '/' + model
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
            // residue respresentation
            const waters = document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"][data-resname="' + resname + '"]')
            for(const wat of waters) {
                wat.classList.remove('water-item-hover')
            }
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const onClick = (model, chain, resnum, resname) => {
            /*const waters = document.querySelectorAll('[data-model="' + e.target.dataset.model + '"][data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const wat of waters) {
                if(wat.className.indexOf('water-item-selected') === -1) wat.classList.add('water-item-selected')
                else wat.classList.remove('water-item-selected')
            }*/
            const [settings, msg] = updateMolecules(water.value, 'waters', currReprVal.value)
            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // update representations selections
            //console.log(currReprVal.value)
            //const selection = createSelection(settings)
            // TODO: CLEAN residue, structure
            setMoleculesSettings(water.value, currStr.value, currReprVal.value)
                .then((r) => {
                    if(r.code != 404) {
                        toast.add({ 
                            severity: msg.status, 
                            summary: msg.tit, 
                            detail: 'The water [ Model ' 
                                    + (water.value.model + 1)
                                    + ' | Chain ' 
                                    + water.value.chain 
                                    + ' | ' 
                                    + water.value.name 
                                    + ' ' 
                                    + water.value.num 
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
        }

        // CENTER STRUCTURE

        const centerWater = (model, chain, resnum, resname) => {
            component.value.autoView(resnum + ':' + chain + '/' + model, 500)
            setPositionSettings(stage)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }


        const onSelectMultiple = (model, chain, resnum, resname) => {
            //addMultipleResidues(resnum)
            console.log('multiple on: ',model,chain,resnum, resname)
        }

        return { 
            isSelected,
            water, window,
            onClick, onMouseOver, onMouseLeave, centerWater, onSelectMultiple
        }

    }

}
</script>

<style>

</style>