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
    @click.exact="onClick(residue.model, residue.chain, residue.num, residue.label)"
    @click.shift.exact="onSelectMultiple(residue.model, residue.chain, residue.num)"
    @click.alt.exact="onCenterResidue(residue.model, residue.chain, residue.num, residue.label)">
        {{ residue.id }}
    </span>
    <span v-else class="sequence-item disabled">&nbsp;</span>

    <span :class="residue.last_sheet ? 'sheet-arrow' : 'sheet'" 
    v-if="(residue.sheet !== null) && window" 
    @mouseover="sheetOver(residue.sheet, residue.chain, residue.model)" 
    @mouseleave="sheetLeave(residue.sheet, residue.chain, residue.model)" 
    @click.exact="sheetClick(residue.sheet, residue.chain, residue.model)"
    @click.alt.exact="sheetCenter(residue.sheet, residue.chain, residue.model)"
    :data-sheet="residue.chain + ':' + residue.sheet + '/' + residue.model" >
    <span v-if="!residue.last_sheet">&nbsp;&nbsp;</span><span v-else>&#9654;&nbsp;</span></span>

    <span class="helix" 
    v-if="(residue.helix !== null) && window" 
    @mouseover="helixOver(residue.helix, residue.chain, residue.model)" 
    @mouseleave="helixLeave(residue.helix, residue.chain, residue.model)" 
    @click.exact="helixClick(residue.helix, residue.chain, residue.model)"
    @click.alt.exact="helixCenter(residue.helix, residue.chain, residue.model)"
    :data-helix="residue.chain + ':' + residue.helix + '/' + residue.model" >&nbsp;&nbsp;</span>
</template>

<script>
import { computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import structureSettings from '@/modules/structure/structureSettings'
//import structureStorage from '@/modules/structure/structureStorage'
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
        const { currentStructure, getFileNames, checkIfMoleculeExists, updateMolecule, updateSetOfMolecules, getSetOfMolecules } = structureSettings()
        //const { projectData } = structureStorage()
        const { addMultipleResidues, getSelection } = useSelections()
        const { currentRepresentation, getCurrentRepresentationSettings, setSelectionRepresentation } = useRepresentations()
        const { setMoleculesSettings, setPositionSettings } = useSettings()
        
        const filesList = computed(() => getFileNames())
        //const dataProject = computed(() => projectData.value)
        const currStr = computed(() => currentStructure.value)
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])
        const currReprVal = computed(() => currentRepresentation.value)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())

        const residue =  computed(() => props.residue)
        //const sheets =  computed(() => props.sheets)
        //const helixes =  computed(() => props.helixes)
        const window =  computed(() => props.window)

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))

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
                model: model,
                chainname:chain,
                resname: resname + ' (<span class="lowercase-legend">' + longname + '</span>)',
                resno: resnum,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
            // old tooltip format
            // v-tooltip.left="residue.longname[0].toUpperCase() + residue.longname.substring(1) + ' (' +  residue.label + ')<br>' + residue.chain + ': ' + residue.id + ' ' + residue.num"
        }

        const actionLeave = (model, chain, resnum, resname) => {
            // NGL representation
            const sele = resnum + ':' + chain + '/' + model
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
            // residue respresentation
            //if(resname) const residues = document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"][data-resname="' + resname + '"]')
            const residues = resname ?
                document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"][data-resname="' + resname + '"]') :
                document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"]')

            for(const res of residues) {
                res.classList.remove('sequence-item-hover')
            }
        }

        const onMouseLeave = (model, chain, resnum, resname) => {
            actionLeave(model, chain, resnum, resname)
            // legend
            setFlagStatus('legendEnabled', false)
        }

        // *******************************************
        // *******************************************
        // put the content of that function out of here to make it acessible from mouseObserver!!!
        // *******************************************
        // *******************************************
        const onClick = (model, chain, resnum, resname) => {  
            const [molecules, msg, status] = updateMolecule(residue.value, 'residues', currReprVal.value)
            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // update representations selections
            const [selection, structures] = getSelection(molecules, status, currReprVal.value, currStr.value)
            // remove mouseover representation
            actionLeave(model, chain, resnum, resname)
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
                        // check if selection is empty
                        if(selection === 'not(*)') {
                            toast.add({ severity: 'warn', summary: 'Empty structure', detail: 'Warning! The ' + strName + ' structure of the ' + currReprSettings.value.name + ' representation is currently empty.', life: 10000 })
                        }
                        // save selection representation
                        setSelectionRepresentation(stage, selection, structures, re.value, true)
                            .then((r) => {
                                if(r.code != 404) {
                                    //console.log(stage)
                                    console.log(r.message)
                                }else console.error(r.message)
                            })
                        console.log(r.message)
                    } else  console.error(r.message)
                })
        }

        // CENTER STRUCTURE

        const onCenterResidue = (model, chain, resnum, resname) => {
            component.value.autoView(resnum + ':' + chain + '/' + model, 500)
            setPositionSettings(stage)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        const onSelectMultiple = (model, chain, resnum) => {
            const mr = addMultipleResidues({ model: model, num: resnum, chain: chain})
            document.querySelectorAll('.sequence-item:not(.disabled)').forEach(el => el.style.cursor = 'copy')
            // on second click
            if(!mr.status) {
                // check if error
                if(mr.error) {
                    toast.add({ 
                        severity: 'error', 
                        summary: 'Error selecting set of residues', 
                        detail: 'Unable to select set of residues from different models / chains',
                        life: 5000
                    })
                } else  {

                    let first, last
                    // sort first last properly
                    if(mr.firstRes.num > mr.lastRes.num) {
                        first = mr.lastRes
                        last = mr.firstRes
                    } else {
                        first = mr.firstRes
                        last = mr.lastRes
                    }
                    // get set of molecules
                    const setOfMolecules = getSetOfMolecules('residues', currReprVal.value, residue.value.chain, first, last)
                    const [status, msg] = updateSetOfMolecules('residues', currReprVal.value, setOfMolecules, residue.value.chain, 'multiple')
                    const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
                    // update representations selections
                    const [selection, structures] = getSelection(setOfMolecules, status, currReprVal.value, currStr.value)
                    // remove mouseover representation
                    actionLeave(mr.lastRes.model, mr.lastRes.chain, mr.lastRes.num, null)
                    // TODO: CLEAN residue, structure
                    setMoleculesSettings(residue.value, currStr.value, currReprVal.value)
                        .then((r) => {
                            if(r.code != 404) {
                                toast.add({ 
                                    severity: msg.status, 
                                    summary: msg.tit, 
                                    detail: 'The range [ Model '  
                                            + (residue.value.model + 1)
                                            + ' | Chain ' 
                                            + residue.value.chain 
                                            + ' | ' 
                                            + msg.range 
                                            + ' ] of ' 
                                            + strName 
                                            + ' structure has been ' 
                                            + msg.txt 
                                            + currReprSettings.value.name 
                                            + ' representation',
                                    life: 10000
                                })
                                // check if selection is empty
                                if(selection === 'not(*)') {
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
                document.querySelectorAll('.sequence-item:not(.disabled)').forEach(el => el.style.cursor = 'pointer')
            }
            //console.log('multiple on: ',e.target.dataset.model,e.target.dataset.chain,e.target.dataset.resnum, e.target.dataset.resname)
        }

        const sheetOver = (sheet, chain, model) => {
            // NGL representation
            const resSheet = props.sheets.filter(item => item.id === chain)[0].sheets[sheet]
            const firstItem = resSheet[0]
            const lastItem = resSheet[resSheet.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + chain + '/' + model
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
            const labelSh = firstItem.label + ' ' + firstItem.num + ' - ' + lastItem.label + ' ' + lastItem.num
            updateLegend({
                name: name,
                model: model,
                chainname: chain,
                resname: '<span class="lowercase-legend">β-sheet</span>',
                resno: labelSh,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
        }

        const actionSheetLeave = (sheet, chain, model) => {
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
        }

        const sheetLeave = (sheet, chain, model) => {
            actionSheetLeave(sheet, chain, model)
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const sheetClick = (sheet, chain, model) => {
            const resSheet = props.sheets.filter(item => item.id === chain)[0].sheets[sheet]
            const [status, msg] = updateSetOfMolecules('residues', currReprVal.value, resSheet, residue.value.chain, 'sheet')
            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // update representations selections
            const [selection, structures] = getSelection(resSheet, status, currReprVal.value, currStr.value)
            // remove mouseover representation
            actionSheetLeave(sheet, chain, model)
            // TODO: CLEAN residue, structure
            setMoleculesSettings(residue.value, currStr.value, currReprVal.value)
                .then((r) => {
                    if(r.code != 404) {
                        toast.add({ 
                            severity: msg.status, 
                            summary: msg.tit, 
                            detail: 'The sheet [ Model '  
                                    + (residue.value.model + 1)
                                    + ' | Chain ' 
                                    + residue.value.chain 
                                    + ' | ' 
                                    + msg.range 
                                    + ' ] of ' 
                                    + strName 
                                    + ' structure has been ' 
                                    + msg.txt 
                                    + currReprSettings.value.name 
                                    + ' representation',
                            life: 10000
                        })
                        // check if selection is empty
                        if(selection === 'not(*)') {
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

        const sheetCenter = (sheet, chain, model) => {
            const resSheet = props.sheets.filter(item => item.id === chain)[0].sheets[sheet]
            const firstItem = resSheet[0]
            const lastItem = resSheet[resSheet.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + chain + '/' + model
            component.value.autoView(sele, 500)
            setPositionSettings(stage)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
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
            const labelHx = firstItem.label + ' ' + firstItem.num + ' - ' + lastItem.label + ' ' + lastItem.num
            updateLegend({
                name: name,
                model: model,
                chainname: chain,
                resname: '<span class="lowercase-legend">α-helix</span>',
                resno: labelHx,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
        }

        const actionHelixLeave = (helix, chain, model) => {
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
        }

        const helixLeave = (helix, chain, model) => {
            actionHelixLeave(helix, chain, model)
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const helixClick = (helix, chain, model) => {
            const resHelix = props.helixes.filter(item => item.id === chain)[0].helixes[helix]
            const [status, msg] = updateSetOfMolecules('residues', currReprVal.value, resHelix, residue.value.chain, 'helix')
            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // update representations selections
            const [selection, structures] = getSelection(resHelix, status, currReprVal.value, currStr.value)
            // remove mouseover representation
            actionHelixLeave(helix, chain, model)
            // TODO: CLEAN residue, structure
            setMoleculesSettings(residue.value, currStr.value, currReprVal.value)
                .then((r) => {
                    if(r.code != 404) {
                        toast.add({ 
                            severity: msg.status, 
                            summary: msg.tit, 
                            detail: 'The helix [ Model '  
                                    + (residue.value.model + 1)
                                    + ' | Chain ' 
                                    + residue.value.chain 
                                    + ' | ' 
                                    + msg.range 
                                    + ' ] of ' 
                                    + strName 
                                    + ' structure has been ' 
                                    + msg.txt 
                                    + currReprSettings.value.name 
                                    + ' representation',
                            life: 10000
                        })
                        // check if selection is empty
                        if(selection === 'not(*)') {
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

        const helixCenter = (helix, chain, model) => {
            const resHelix = props.helixes.filter(item => item.id === chain)[0].helixes[helix]
            const firstItem = resHelix[0]
            const lastItem = resHelix[resHelix.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + chain + '/' + model
            component.value.autoView(sele, 500)
            setPositionSettings(stage)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        return { 
            isSelected,
            residue, window,
            onClick, onCenterResidue, onSelectMultiple, onMouseOver, onMouseLeave,
            sheetOver, sheetLeave, sheetClick, sheetCenter,
            helixOver, helixLeave, helixClick, helixCenter
        }
    }
}
</script>

<style>

</style>