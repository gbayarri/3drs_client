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
import useLegend from '@/modules/viewport/useLegend'
import useFlags from '@/modules/common/useFlags'
import useSettings from '@/modules/settings/useSettings'
import useSelections from '@/modules/representations/useSelections'
import useRepresentations from '@/modules/representations/useRepresentations'
import useActions from '@/modules/representations/useActions'
export default {
    props: ['residue', 'sheets', 'helixes', 'window', 'index', 'stage'],
    setup(props) {

        const stage = props.stage

        const { updateLegend } = useLegend()
        const { setFlagStatus } = useFlags()
        const { currentStructure, getFileNames, checkIfMoleculeExists, getSetOfMolecules } = structureSettings()
        const { addMultipleResidues } = useSelections()
        const { currentRepresentation, getCurrentRepresentationSettings } = useRepresentations()
        const {  setPositionSettings } = useSettings()
        const { actionLeaveSingleMolecule, actionSheetLeave, actionHelixLeave, actionSelectSingleMolecule, actionSelectSetOfMolecules } = useActions()
        
        const filesList = computed(() => getFileNames())
        const currStr = computed(() => currentStructure.value)
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])
        const currReprVal = computed(() => currentRepresentation.value)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())

        const residue =  computed(() => props.residue)
        const window =  computed(() => props.window)

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))

        const isSelected = computed(() => checkIfMoleculeExists(residue.value, 'residues', currReprVal.value))

        const toast = useToast()

        const onMouseOver = (model, chain, resnum, resname, longname) => {
            // NGL representation
            const sele = resnum + ':' + (chain === '@' ? '' : chain) + '/' + model
            const new_name = currStr.value + '-' + sele + '-hover'
            component.value.addRepresentation( "spacefill", { 
                name: new_name,
                sele: '(' + sele + ')', 
                opacity:.5, 
                radius:1,
                color:'#5E738B'
            })
            // residue representation
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
        }

        const onMouseLeave = (model, chain, resnum, resname) => {
            actionLeaveSingleMolecule(stage, currStr.value, model, chain, resnum, resname, 'sequence')
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const onClick = (model, chain, resnum, resname) => {
            const properties = {
                stage: stage,
                residue: residue.value,
                model: model, 
                chain: chain, 
                resnum: resnum, 
                resname: resname,
                type: 'residues',
                css_type: 'sequence',
                currRepr: currReprVal.value,
                currReprSettings: currReprSettings.value,
                currStr: currStr.value,
                strName: filesList.value.filter(item => item.id === currStr.value)[0].name,
                re: re.value
            }
            actionSelectSingleMolecule(properties)
        }

        // CENTER STRUCTURE

        const onCenterResidue = (model, chain, resnum, resname) => {
            component.value.autoView(resnum + ':' + (chain === '@' ? '' : chain) + '/' + model, 500)
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
                    //if(toastSettings.value) {
                        toast.add({ 
                            severity: 'error', 
                            summary: 'Error selecting set of residues', 
                            detail: 'Unable to select set of residues from different models / chains',
                            life: 5000
                        })
                    //}
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
                    const properties = {
                        stage: stage,
                        setOfMolecules: setOfMolecules,
                        residue: residue.value,
                        model: mr.lastRes.model, 
                        chain:  mr.lastRes.chain, 
                        resnum: mr.lastRes.num, 
                        resname: null,
                        type: 'residues',
                        css_type: 'sequence',
                        set_type: 'multiple',
                        currRepr: currReprVal.value,
                        currReprSettings: currReprSettings.value,
                        currStr: currStr.value,
                        strName: filesList.value.filter(item => item.id === currStr.value)[0].name,
                        re: re.value
                    }
                    actionSelectSetOfMolecules(properties)
                }
                document.querySelectorAll('.sequence-item:not(.disabled)').forEach(el => el.style.cursor = 'pointer')
            }
        }

        const sheetOver = (sheet, chain, model) => {
            // NGL representation
            const resSheet = props.sheets.filter(item => item.id === chain)[0].sheets[sheet]
            const firstItem = resSheet[0]
            const lastItem = resSheet[resSheet.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + (chain === '@' ? '' : chain) + '/' + model
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

        const sheetLeave = (sheet, chain, model) => {
            actionSheetLeave(stage, currStr.value, props, sheet, chain, model)
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const sheetClick = (sheet, chain, model) => {
            const resSheet = props.sheets.filter(item => item.id === chain)[0].sheets[sheet]
            const properties = {
                stage: stage,
                setOfMolecules: resSheet,
                residue: residue.value,
                props: props,
                sheet: sheet,
                model: model, 
                chain:  chain,
                type: 'residues',
                set_type: 'sheet',
                currRepr: currReprVal.value,
                currReprSettings: currReprSettings.value,
                currStr: currStr.value,
                strName: filesList.value.filter(item => item.id === currStr.value)[0].name,
                re: re.value
            }
            actionSelectSetOfMolecules(properties)

        }

        const sheetCenter = (sheet, chain, model) => {
            const resSheet = props.sheets.filter(item => item.id === chain)[0].sheets[sheet]
            const firstItem = resSheet[0]
            const lastItem = resSheet[resSheet.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + (chain === '@' ? '' : chain) + '/' + model
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
            const sele = firstItem.num + '-' + lastItem.num + ':' + (chain === '@' ? '' : chain) + '/' + model
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


        const helixLeave = (helix, chain, model) => {
            actionHelixLeave(stage, currStr.value, props, helix, chain, model)
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const helixClick = (helix, chain, model) => {
            const resHelix = props.helixes.filter(item => item.id === chain)[0].helixes[helix]
            const properties = {
                stage: stage,
                setOfMolecules: resHelix,
                residue: residue.value,
                props: props,
                helix: helix,
                model: model, 
                chain:  chain,
                type: 'residues',
                set_type: 'helix',
                currRepr: currReprVal.value,
                currReprSettings: currReprSettings.value,
                currStr: currStr.value,
                strName: filesList.value.filter(item => item.id === currStr.value)[0].name,
                re: re.value
            }
            actionSelectSetOfMolecules(properties)
        }

        const helixCenter = (helix, chain, model) => {
            const resHelix = props.helixes.filter(item => item.id === chain)[0].helixes[helix]
            const firstItem = resHelix[0]
            const lastItem = resHelix[resHelix.length-1]
            const sele = firstItem.num + '-' + lastItem.num + ':' + (chain === '@' ? '' : chain) + '/' + model
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