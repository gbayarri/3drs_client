<template>
    <span class="sequence-number" v-if="index % 10 === 0">{{ residue.num }}
        <span v-if="residue.num.toString().length == 3">&nbsp;</span>
        <span v-if="residue.num.toString().length == 2">&nbsp;&nbsp;</span>
        <span v-if="residue.num.toString().length == 1">&nbsp;&nbsp;&nbsp;</span>
    </span>
    
    <span v-if="residue.id" class="sequence-item" 
    :data-model="residue.model" 
    :data-chain="residue.chain" 
    :data-resnum="residue.num" 
    :data-resname="residue.label" 
    :data-sheet="(residue.sheet !== null) ? residue.chain + ':' + residue.sheet : null" 
    :data-helix="(residue.helix !== null) ? residue.chain + ':' + residue.helix : null" 
    v-tooltip.left="residue.longname[0].toUpperCase() + residue.longname.substring(1) + ' (' +  residue.label + ')<br>' + residue.chain + ': ' + residue.id + ' ' + residue.num"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @click="onClick">
        {{ residue.id }}
    </span>
    <span v-else class="sequence-item disabled">&nbsp;</span>

    <span :class="residue.last_sheet ? 'sheet-arrow' : 'sheet'" 
    v-if="(residue.sheet !== null) && window" 
    @mouseover="sheetOver(residue.sheet, residue.chain)" 
    @mouseleave="sheetLeave(residue.sheet, residue.chain)" 
    @click="sheetClick(residue.sheet, residue.chain)"
    :data-sheet="residue.chain + ':' + residue.sheet" 
    v-tooltip.bottom="labelSheet"><span v-if="!residue.last_sheet">&nbsp;&nbsp;</span><span v-else>&#9654;&nbsp;</span></span>

    <span class="helix" 
    v-if="(residue.helix !== null) && window" 
    @mouseover="helixOver(residue.helix, residue.chain)" 
    @mouseleave="helixLeave(residue.helix, residue.chain)" 
    @click="helixClick(residue.helix, residue.chain)"
    :data-helix="residue.chain + ':' + residue.helix" 
    v-tooltip.bottom="labelHelix">&nbsp;&nbsp;</span>
</template>

<script>
import { computed } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
//import useZoomWindow from '@/modules/representations/useZoomWindow'
export default {
    props: ['residue', 'sheets', 'helixes', 'window', 'index', 'stage'],
    setup(props) {

        // TODO: ADD TO NAVIGATION ALL THE SELECTEDS (FUNCTION ONCLICK()) AND COMPUTE HERE IF 
        // class="sequence-item" OR class="sequence-item-selected" WHEN CREATED
        // MAKE CONSISTENT WITH MULTIMODELS!!!!
        //const { allSelected } = useZoomWindow()

        //console.log('loading ' + props.residue.num )

        const stage = props.stage

        const { currentStructure } = structureSettings()
        const { projectData } = structureStorage()
        const { updateProjectData } = useAPI()
        
        const dataProject = computed(() => projectData.value)
        const currStr = computed(() => currentStructure.value)
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])

        const residue =  computed(() => props.residue)
        const sheets =  computed(() => props.sheets)
        const helixes =  computed(() => props.helixes)
        const window =  computed(() => props.window)

        const onMouseOver = (e) => {
            const sele = e.target.dataset.resnum + ':' + e.target.dataset.chain + '/' + e.target.dataset.model
            const new_name = currStr.value + '-' + sele + '-hover'
            component.value.addRepresentation( "licorice", { 
                name: new_name,
                sele: '(' + sele + ')', 
                opacity:.5, 
                radius:.5,
                color:'#5E738B' 
            })
            // console.log(e.type) // mouseover / mouseleave 
            const residues = document.querySelectorAll('[data-model="' + e.target.dataset.model + '"][data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const res of residues) {
                res.classList.add('sequence-item-hover')
            }
        }

        const onMouseLeave = (e) => {
            const sele = e.target.dataset.resnum + ':' + e.target.dataset.chain + '/' + e.target.dataset.model
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
            // console.log(e.type) // mouseover / mouseleave 
            const residues = document.querySelectorAll('[data-model="' + e.target.dataset.model + '"][data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const res of residues) {
                res.classList.remove('sequence-item-hover')
            }
        }

        const onClick = (e) => {
            const residues = document.querySelectorAll('[data-model="' + e.target.dataset.model + '"][data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const res of residues) {
                if(res.className.indexOf('sequence-item-selected') === -1) res.classList.add('sequence-item-selected')
                else res.classList.remove('sequence-item-selected', 'sequence-item-hover')
            }
        }

        const labelSheet = computed(() => {
            if(sheets && residue.value.id) {
                const resSheet = sheets.value.filter(item => item.id === residue.value.chain)[0].sheets[residue.value.sheet]
                if(resSheet) {
                    const firstItem = resSheet[0];
                    const lastItem = resSheet[resSheet.length-1];
                    return "β-sheet<br>" + firstItem.label + firstItem.num + "~" + lastItem.label + lastItem.num
                }
            }
        })

        const labelHelix = computed(() => {
            if(helixes && residue.value.id) {
                const resHelix = helixes.value.filter(item => item.id === residue.value.chain)[0].helixes[residue.value.helix]
                if(resHelix) {
                    const firstItem = resHelix[0]
                    const lastItem = resHelix[resHelix.length-1]
                    return "α-helix<br>" + firstItem.label + firstItem.num + "~" + lastItem.label + lastItem.num
                }
            }
        })

        const sheetOver = (sheet, chain) => {
            const sheets = document.querySelectorAll('[data-sheet="' + chain + ':' + sheet + '"]')
            for(const s of sheets) {
                if(s.className == 'sheet') s.style.backgroundColor = 'rgb(46, 199, 150)'
                if(s.className == 'sheet-arrow') s.style.color = 'rgb(46, 199, 150)'
                if(s.className == 'sequence-item')  s.classList.add('sequence-item-hover')
            }
        }

        const sheetLeave = (sheet, chain) => {
            const sheets = document.querySelectorAll('[data-sheet="' + chain + ':' + sheet + '"]')
            for(const s of sheets) {
                if(s.className == 'sheet') s.style.backgroundColor = 'rgb(104, 158, 153)'
                if(s.className == 'sheet-arrow') s.style.color = 'rgb(104, 158, 153)'
                if(s.className == 'sequence-item sequence-item-hover')  s.classList.remove('sequence-item-hover')
            }
        }

        const sheetClick = (sheet, chain) => {
            const residues = document.querySelectorAll('[data-sheet="' + chain + ':' + sheet + '"]')
            for(const res of residues) {
                if(res.className.indexOf('sequence-item-selected') === -1 && res.className.indexOf('sequence-item') !== -1) res.classList.add('sequence-item-selected')
                else res.classList.remove('sequence-item-selected', 'sequence-item-hover')
            }
        }

        const helixOver = (helix, chain) => {
            const helixes = document.querySelectorAll('[data-helix="' + chain + ':' + helix + '"]')
            for(const s of helixes) {
                if(s.className == 'helix') s.style.backgroundPosition = 'center top'
                if(s.className == 'sequence-item')  s.classList.add('sequence-item-hover')
            }

            // DON'T REMOVE
            //component.addRepresentation( "cartoon", {  sele: "helix", color: "#f00", opacity:.4, aspectRatio:10 } )
            //component.addRepresentation( "cartoon", {  sele: "sheet", color: "#0f0", opacity:.4, aspectRatio:10 } )
            // DON'T REMOVE
        }

        const helixLeave = (helix, chain) => {
            const helixes = document.querySelectorAll('[data-helix="' + chain + ':' + helix + '"]')
            for(const s of helixes) {
                if(s.className == 'helix') s.style.backgroundPosition = 'center bottom'
                if(s.className == 'sequence-item sequence-item-hover')  s.classList.remove('sequence-item-hover')
            }
        }

        const helixClick = (helix, chain) => {
            const residues = document.querySelectorAll('[data-helix="' + chain + ':' + helix + '"]')
            for(const res of residues) {
                if(res.className.indexOf('sequence-item-selected') === -1 && res.className.indexOf('sequence-item') !== -1) res.classList.add('sequence-item-selected')
                else res.classList.remove('sequence-item-selected', 'sequence-item-hover')
            }
        }

        return { 
            residue, window,
            onClick, onMouseOver, onMouseLeave,
            labelSheet, labelHelix,
            sheetOver, sheetLeave, sheetClick,
            helixOver, helixLeave, helixClick
        }
    }
}
</script>

<style>

</style>