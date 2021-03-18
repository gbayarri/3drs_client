<template>
    <span class="sequence-number" v-if="index % 10 === 0">{{ residue.num }}
        <span v-if="residue.num.toString().length == 3">&nbsp;</span>
        <span v-if="residue.num.toString().length == 2">&nbsp;&nbsp;</span>
        <span v-if="residue.num.toString().length == 1">&nbsp;&nbsp;&nbsp;</span>
    </span>
    
    <span v-if="residue.id" :class="isSelected ? 'sequence-item sequence-item-selected' : 'sequence-item'" 
    :data-model="residue.model" 
    :data-chain="residue.chain" 
    :data-resnum="residue.num" 
    :data-resname="residue.label" 
    :data-sheet="(residue.sheet !== null) ? residue.chain + ':' + residue.sheet + '/' + residue.model : null" 
    :data-helix="(residue.helix !== null) ? residue.chain + ':' + residue.helix + '/' + residue.model : null" 
    @mouseover="onMouseOver(residue.model, residue.chain, residue.num, residue.label, residue.longname)"
    @mouseleave="onMouseLeave(residue.model, residue.chain, residue.num, residue.label)"
    @click.exact="onClick(residue.model, residue.chain, residue.num, residue.label, residue.longname)"
    @click.shift.exact="onSelectMultiple(residue.model, residue.chain, residue.num, residue.label)"
    @click.alt.exact="centerResidue(residue.model, residue.chain, residue.num, residue.label)">
        {{ residue.id }}
    </span>
    <span v-else class="sequence-item disabled">&nbsp;</span>

    <span :class="residue.last_sheet ? 'sheet-arrow' : 'sheet'" 
    v-if="(residue.sheet !== null) && window" 
    @mouseover="sheetOver(residue.sheet, residue.chain, residue.model)" 
    @mouseleave="sheetLeave(residue.sheet, residue.chain, residue.model)" 
    @click="sheetClick(residue.sheet, residue.chain, residue.model)"
    @dblclick="sheetDoubleClick(residue.sheet, residue.chain, residue.model)"
    :data-sheet="residue.chain + ':' + residue.sheet + '/' + residue.model" >
    <span v-if="!residue.last_sheet">&nbsp;&nbsp;</span><span v-else>&#9654;&nbsp;</span></span>

    <span class="helix" 
    v-if="(residue.helix !== null) && window" 
    @mouseover="helixOver(residue.helix, residue.chain, residue.model)" 
    @mouseleave="helixLeave(residue.helix, residue.chain, residue.model)" 
    @click="helixClick(residue.helix, residue.chain, residue.model)"
    @dblclick="helixDoubleClick(residue.helix, residue.chain, residue.model)"
    :data-helix="residue.chain + ':' + residue.helix + '/' + residue.model" >&nbsp;&nbsp;</span>
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
//import useZoomWindow from '@/modules/representations/useZoomWindow'
export default {
    props: ['residue', 'sheets', 'helixes', 'window', 'index', 'stage'],
    setup(props) {

        //const { allSelected } = useZoomWindow()

        //console.log('loading ' + props.residue.num )

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

        const residue =  computed(() => props.residue)
        const sheets =  computed(() => props.sheets)
        const helixes =  computed(() => props.helixes)
        const window =  computed(() => props.window)

        const isSelected = computed(() => checkIfMoleculeExists(residue.value, 'residues', currReprVal.value))

        const toast = useToast()

        const onMouseOver = (model, chain, resnum, resname, longname) => {
            // NGL representation
            const sele = resnum + ':' + chain + '/' + model
            const new_name = currStr.value + '-' + sele + '-hover'
            component.value.addRepresentation( "spacefill", { 
                name: new_name,
                sele: '(' + sele + ')', 
                opacity:.5, 
                radius:1,
                color:'#5E738B'
            })
            // residue respresentation
            const residues = document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"][data-resname="' + resname + '"]')
            for(const res of residues) {
                res.classList.add('sequence-item-hover')
            }
            // legend
            const name = filesList.value.filter(item => item.id === currStr.value)[0].name
            updateLegend({
                name: name,
                chainname:chain,
                resname: resname + ' (' + longname + ')',
                resno: resnum,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
            // old tooltip format
            // v-tooltip.left="residue.longname[0].toUpperCase() + residue.longname.substring(1) + ' (' +  residue.label + ')<br>' + residue.chain + ': ' + residue.id + ' ' + residue.num"
        }

        const onMouseLeave = (model, chain, resnum, resname) => {
            // NGL representation
            const sele = resnum + ':' + chain + '/' + model
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
            // residue respresentation
            const residues = document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"][data-resname="' + resname + '"]')
            for(const res of residues) {
                res.classList.remove('sequence-item-hover')
            }
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const onClick = (model, chain, resnum, resname, longname) => {

            //const residues = document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"][data-resname="' + resname + '"]')
   
            const [settings, msg] = updateMolecules(residue.value, 'residues', currReprVal.value)
            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // update representations selections
            //console.log(currReprVal.value)
            //const selection = createSelection(settings)
            // TODO: CLEAN residue, structure
            setMoleculesSettings(residue.value, currStr.value, currReprVal.value)
                .then((r) => {
                    if(r.code != 404) {
                        toast.add({ 
                            severity: msg.status, 
                            summary: msg.tit, 
                            detail: 'The residue [ Model ' 
                                    + (residue.value.model + 1)
                                    + ' | Chain ' 
                                    + residue.value.chain 
                                    + ' | ' 
                                    + residue.value.id 
                                    + ' ' 
                                    + residue.value.num 
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


            // MODIFY THAT BY A CALL TO updateMolecules
            /*for(const res of residues) {
                if(res.className.indexOf('sequence-item-selected') === -1) res.classList.add('sequence-item-selected')
                else res.classList.remove('sequence-item-selected', 'sequence-item-hover')
            }*/
            // CREATE UPDATE RESIDUES IN STRUCTURE SETTINGS

            // CREATE NGL SELECTION IN USE SELECTIONS

            // GET SELECTION AND SAVE IT INTO settings.value AND MONGO. SAVE NAVIGATION IN MONGO AS WELL
        }

        // CENTER STRUCTURE

        const centerResidue = (model, chain, resnum, resname) => {
            component.value.autoView(resnum + ':' + chain + '/' + model, 500)
            setPositionSettings(stage)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        const onSelectMultiple = (model, chain, resnum, resname) => {
            // GET OUTPUT FOR TOAST WARNING!!!!
            addMultipleResidues(resnum)
            //console.log('multiple on: ',e.target.dataset.model,e.target.dataset.chain,e.target.dataset.resnum, e.target.dataset.resname)
        }

        const sheetOver = (sheet, chain, model) => {
            // NGL representation
            const resSheet = props.sheets.filter(item => item.id === chain)[0].sheets[sheet]
            const firstItem = resSheet[0]
            const lastItem = resSheet[resSheet.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + chain + '/' + model
            //const sele = '(724-731:A/0)'
            const repr = resSheet.length > 3 ? 'cartoon' : 'licorice'
            const new_name = currStr.value + '-' + sele + '-hover'
            component.value.addRepresentation( repr, { 
                name: new_name,
                sele: '(' + sele + ')', 
                opacity:.5, 
                radius:.5,
                color:'#5E738B',
                side: 'front'
            })
            // sheet representation
            const sheets = document.querySelectorAll('[data-sheet="' + chain + ':' + sheet + '/' + model + '"]')
            for(const s of sheets) {
                if(s.className == 'sheet') s.style.backgroundColor = 'rgb(46, 199, 150)'
                if(s.className == 'sheet-arrow') s.style.color = 'rgb(46, 199, 150)'
                if(s.className == 'sequence-item')  s.classList.add('sequence-item-hover')
            }
            // legend
            const name = filesList.value.filter(item => item.id === currStr.value)[0].name
            const labelSh = firstItem.label + firstItem.num + "~" + lastItem.label + lastItem.num
            updateLegend({
                name: name,
                chainname: chain,
                resname: '<span class="greek-char">β</span>-sheet',
                resno: labelSh,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
        }

        const sheetLeave = (sheet, chain, model) => {
            // NGL representation
            const resSheet = props.sheets.filter(item => item.id === chain)[0].sheets[sheet]
            const firstItem = resSheet[0]
            const lastItem = resSheet[resSheet.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + chain + '/' + model
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
            // sheet representation
            const sheets = document.querySelectorAll('[data-sheet="' + chain + ':' + sheet + '/' + model + '"]')
            for(const s of sheets) {
                if(s.className == 'sheet') s.style.backgroundColor = 'rgb(104, 158, 153)'
                if(s.className == 'sheet-arrow') s.style.color = 'rgb(104, 158, 153)'
                if(s.className == 'sequence-item sequence-item-hover')  s.classList.remove('sequence-item-hover')
            }
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const sheetClick = (sheet, chain, model) => {
            const residues = document.querySelectorAll('[data-sheet="' + chain + ':' + sheet + '/' + model + '"]')
            for(const res of residues) {
                if(res.className.indexOf('sequence-item-selected') === -1 && res.className.indexOf('sequence-item') !== -1) res.classList.add('sequence-item-selected')
                else res.classList.remove('sequence-item-selected', 'sequence-item-hover')
            }
        }

        const sheetDoubleClick = (sheet, chain, model) => {
            console.log('center on: ',model,chain,sheet)
            /*const residues = document.querySelectorAll('[data-model="' + e.target.dataset.model + '"][data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const res of residues) {
                if(res.className.indexOf('sequence-item-selected') === -1) res.classList.add('sequence-item-selected')
                else res.classList.remove('sequence-item-selected', 'sequence-item-hover')
            }*/
        }

        const helixOver = (helix, chain, model) => {
            // NGL representation
            const resHelix = props.helixes.filter(item => item.id === chain)[0].helixes[helix]
            const firstItem = resHelix[0]
            const lastItem = resHelix[resHelix.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + chain + '/' + model
            const repr = resHelix.length > 3 ? 'cartoon' : 'licorice'
            const new_name = currStr.value + '-' + sele + '-hover'
            component.value.addRepresentation( repr, { 
                name: new_name,
                sele: '(' + sele + ')', 
                opacity:.5, 
                radius:.5,
                color:'#5E738B',
                side: 'front'
            })
            // helix representation
            const helixes = document.querySelectorAll('[data-helix="' + chain + ':' + helix + '/' + model + '"]')
            for(const s of helixes) {
                if(s.className == 'helix') s.style.backgroundPosition = 'center top'
                if(s.className == 'sequence-item')  s.classList.add('sequence-item-hover')
            }
            // legend
            const name = filesList.value.filter(item => item.id === currStr.value)[0].name
            const labelHx = firstItem.label + firstItem.num + "~" + lastItem.label + lastItem.num
            updateLegend({
                name: name,
                chainname: chain,
                resname: '<span class="greek-char">α</span>-helix',
                resno: labelHx,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
        }

        const helixLeave = (helix, chain, model) => {
            // NGL representation
            const resHelix = props.helixes.filter(item => item.id === chain)[0].helixes[helix]
            const firstItem = resHelix[0]
            const lastItem = resHelix[resHelix.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + chain + '/' + model
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
            // helix representation
            const helixes = document.querySelectorAll('[data-helix="' + chain + ':' + helix + '/' + model + '"]')
            for(const s of helixes) {
                if(s.className == 'helix') s.style.backgroundPosition = 'center bottom'
                if(s.className == 'sequence-item sequence-item-hover')  s.classList.remove('sequence-item-hover')
            }
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const helixClick = (helix, chain, model) => {
            const residues = document.querySelectorAll('[data-helix="' + chain + ':' + helix + '/' + model + '"]')
            for(const res of residues) {
                if(res.className.indexOf('sequence-item-selected') === -1 && res.className.indexOf('sequence-item') !== -1) res.classList.add('sequence-item-selected')
                else res.classList.remove('sequence-item-selected', 'sequence-item-hover')
            }
        }

        const helixDoubleClick = (helix, chain, model) => {
            console.log('center on: ',model,chain,helix)
            /*const residues = document.querySelectorAll('[data-model="' + e.target.dataset.model + '"][data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const res of residues) {
                if(res.className.indexOf('sequence-item-selected') === -1) res.classList.add('sequence-item-selected')
                else res.classList.remove('sequence-item-selected', 'sequence-item-hover')
            }*/
        }

        return { 
            isSelected,
            residue, window,
            onClick, centerResidue, onSelectMultiple, onMouseOver, onMouseLeave,
            sheetOver, sheetLeave, sheetClick, sheetDoubleClick,
            helixOver, helixLeave, helixClick, helixDoubleClick
        }
    }
}
</script>

<style>

</style>