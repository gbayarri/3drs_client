<template>
    <span class="water-number" v-if="index % 10 === 0">{{ water.num }}
        <span v-if="water.num.toString().length == 3">&nbsp;</span>
        <span v-if="water.num.toString().length == 2">&nbsp;&nbsp;</span>
        <span v-if="water.num.toString().length == 1">&nbsp;&nbsp;&nbsp;</span>
    </span>

    <span v-if="water.chain" class="water-item" 
    :data-model="water.model" 
    :data-chain="water.chain" 
    :data-resnum="water.num" 
    :data-resname="water.name" 
    @click="onClick"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave">W</span>
    <span v-else class="water-item disabled">&nbsp;</span>

</template>

<script>
import { computed } from 'vue'
//import useZoomWindow from '@/modules/representations/useZoomWindow'
import structureSettings from '@/modules/structure/structureSettings'
import structureStorage from '@/modules/structure/structureStorage'
import useLegend from '@/modules/viewport/useLegend'
import useFlags from '@/modules/common/useFlags'
import useAPI from '@/modules/api/useAPI'
export default {
    props: ['water', 'window', 'index', 'item', 'stage'],
    setup(props) {

        // TODO: ADD TO NAVIGATION ALL THE SELECTEDS (FUNCTION ONCLICK()) AND COMPUTE HERE IF 
        // class="sequence-item" OR class="sequence-item-selected" WHEN CREATED
        //const { allSelected } = useZoomWindow()

        const stage = props.stage

        const { updateLegend } = useLegend()
        const { setFlagStatus } = useFlags()
        const { currentStructure, getFileNames } = structureSettings()
        const { projectData } = structureStorage()
        const { updateProjectData } = useAPI()

        const filesList = computed(() => getFileNames())
        const dataProject = computed(() => projectData.value)
        const currStr = computed(() => currentStructure.value)
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])

        const water =  computed(() => props.water)
        const window =  computed(() => props.window)

        const onMouseOver = (e) => {
            // NGL representation
            const sele = e.target.dataset.resnum + ':' + e.target.dataset.chain + '/' + e.target.dataset.model
            const new_name = currStr.value + '-' + sele + '-hover'
            component.value.addRepresentation( "spacefill", { 
                name: new_name,
                sele: '(' + sele + ')', 
                opacity:.5, 
                radius:2,
                color:'#5E738B' 
            })
            // residue respresentation
            const residues = document.querySelectorAll('[data-model="' + e.target.dataset.model + '"][data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const res of residues) {
                res.classList.add('water-item-hover')
            }
            // legend
            const name = filesList.value.filter(item => item.id === currStr.value)[0].name
            updateLegend({
                name: name,
                chainname: e.target.dataset.chain,
                resname: e.target.dataset.resname,
                resno: e.target.dataset.resnum,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
            // old tooltip format
            //v-tooltip.left="'Water<br>' + water.chain + ': ' + water.name + ' ' + water.num"
        }

        const onMouseLeave = (e) => {
            // NGL representation
            const sele = e.target.dataset.resnum + ':' + e.target.dataset.chain + '/' + e.target.dataset.model
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
            // residue respresentation
            const residues = document.querySelectorAll('[data-model="' + e.target.dataset.model + '"][data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const res of residues) {
                res.classList.remove('water-item-hover')
            }
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const onClick = (e) => {
            const waters = document.querySelectorAll('[data-model="' + e.target.dataset.model + '"][data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const wat of waters) {
                if(wat.className.indexOf('water-item-selected') === -1) wat.classList.add('water-item-selected')
                else wat.classList.remove('water-item-selected')
            }
        }

        return { 
            water, window,
            onClick, onMouseOver, onMouseLeave
        }

    }

}
</script>

<style>

</style>