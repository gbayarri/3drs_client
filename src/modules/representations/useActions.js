import { computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import structureSettings from '@/modules/structure/structureSettings'
import useSelections from '@/modules/representations/useSelections'
import useSettings from '@/modules/settings/useSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useProjectSettings from '@/modules/structure/useProjectSettings'

export default function UseActions() {

    const { updateMolecule, updateSetOfMolecules, getCurrentMolecules, getCurrentModel, updateAllMolecules } = structureSettings()
    const { getSelection } = useSelections()
    const { setMoleculesSettings } = useSettings()
    const { setSelectionRepresentation } = useRepresentations()
    const { getProjectSettings } = useProjectSettings()
    
    const toastSettings = computed(() => getProjectSettings().toasts) 

    const toast = useToast()

    const actionLeaveSingleMolecule = (stage, currStr, model, chain, resnum, resname, type) => {
        // NGL representation
        const sele = resnum + ':' + (chain === '@' ? '' : chain) + '/' + model
        const re = currStr + '-' + sele + '-hover'
        for(const item of stage.getRepresentationsByName(re).list) {
            item.dispose()
        }
        // residue respresentation
        //if(resname) const residues = document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"][data-resname="' + resname + '"]')
        const residues = resname ?
            document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"][data-resname="' + resname + '"]') :
            document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"]')

        for(const res of residues) {
            res.classList.remove(type + '-item-hover')
        }
    }

    const actionLeaveSingleHetero = (stage, currStr, v) => {
        // NGL representation
        const sele = v.num + ':' + (v.chain === '@' ? '' : v.chain) + '/' + v.model
        const re = currStr + '-' + sele + '-hover'
        for(const item of stage.getRepresentationsByName(re).list) {
            item.dispose()
        }
    }

    const actionSheetLeave = (stage, currStr, props, sheet, chain, model) => {
        // NGL representation
        const resSheet = props.sheets.filter(item => item.id === chain)[0].sheets[sheet]
        const firstItem = resSheet[0]
        const lastItem = resSheet[resSheet.length-1]
        const sele = firstItem.num + '-' + lastItem.num + ':' + (chain === '@' ? '' : chain) + '/' + model
        const re = currStr + '-' + sele + '-hover'
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

    const actionHelixLeave = (stage, currStr, props, helix, chain, model) => {
        // NGL representation
        const resHelix = props.helixes.filter(item => item.id === chain)[0].helixes[helix]
        const firstItem = resHelix[0]
        const lastItem = resHelix[resHelix.length-1]
        const sele = firstItem.num + '-' + lastItem.num + ':' + (chain === '@' ? '' : chain) + '/' + model
        const re = currStr + '-' + sele + '-hover'
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

    const actionSelectSingleMolecule = (p) => {
    
        //console.log(p.residue)

        const [molecules, msg, status] = updateMolecule(p.residue, p.type, p.currRepr)
        // update representations selections
        const [selection, structures] = getSelection(molecules, status, p.currRepr, p.currStr, p.stage)
        //console.log(structures)
        // remove mouseover representation
        let txt_type = ''
        let res = null
        if( p.type === 'residues' ) {
            txt_type = 'residue'
            res = p.residue.id 
            actionLeaveSingleMolecule(p.stage, p.currStr, p.model, p.chain, p.resnum, p.resname, p.css_type)
        }
        if( p.type === 'waters' ) {
            txt_type = 'water'
            res = 'HOH'
            actionLeaveSingleMolecule(p.stage, p.currStr, p.model, p.chain, p.resnum, p.resname, p.css_type)
        }
        if( p.type === 'heteroatoms' ) {
            txt_type = 'heteroatom'
            res = p.residue.resname
            actionLeaveSingleHetero(p.stage, p.currStr, p.residue)
        }
        if( p.type === 'ions' ) {
            txt_type = 'ion'
            res = p.residue.resname
            actionLeaveSingleHetero(p.stage, p.currStr, p.residue)
        }
        // TODO: CLEAN residue, structure
        //console.log(p)
        setMoleculesSettings(p.residue, p.currStr, p.currRepr)
            .then((r) => {
                if(r.code != 404) {
                    if(toastSettings.value) {
                        toast.add({ 
                            severity: msg.status, 
                            summary: msg.tit, 
                            detail: 'The ' + txt_type + ' [ Model ' 
                                    + (p.residue.model + 1)
                                    + ' | Chain ' 
                                    + p.residue.chain 
                                    + ' | ' 
                                    + res
                                    + ' ' 
                                    + p.residue.num 
                                    + ' ] of ' 
                                    + p.strName 
                                    + ' structure has been ' 
                                    + msg.txt 
                                    + p.currReprSettings.name 
                                    + ' representation',
                            life: 10000
                        })
                    }
                    // check if selection is empty
                    if(selection === 'not(*)' && toastSettings.value) {
                        toast.add({ severity: 'warn', summary: 'Empty structure', detail: 'Warning! The ' + p.strName + ' structure of the ' + p.currReprSettings.name + ' representation is currently empty.', life: 10000 })
                    }
                    // save selection representation
                    setSelectionRepresentation(p.stage, selection, structures, p.re, true)
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

    const actionSelectSetOfMolecules = (p) => {

        const [status, msg] = updateSetOfMolecules(p.type, p.currRepr, p.setOfMolecules, p.residue.chain, p.set_type)
        // update representations selections
        const [selection, structures] = getSelection(p.setOfMolecules, status, p.currRepr, p.currStr, p.stage)
        let txt_type = ''
        // remove mouseover representation
        if( p.set_type === 'multiple' ) {
            txt_type = 'range'
            actionLeaveSingleMolecule(p.stage, p.currStr, p.model, p.chain, p.num, p.resname, p.css_type)
        }
        if( p.set_type === 'sheet' ) {
            txt_type = 'sheet'
            actionSheetLeave(p.stage, p.currStr, p.props, p.sheet, p.chain, p.model)
        }
        if( p.set_type === 'helix' ) {
            txt_type = 'helix'
            actionHelixLeave(p.stage, p.currStr, p.props, p.helix, p.chain, p.model)
        }
        // TODO: CLEAN residue, structure
        setMoleculesSettings(p.residue, p.currStr, p.currRepr)
            .then((r) => {
                if(r.code != 404) {
                    if(toastSettings.value) {
                        toast.add({ 
                            severity: msg.status, 
                            summary: msg.tit, 
                            detail: 'The ' + txt_type + ' [ Model '  
                                    + (p.residue.model + 1)
                                    + ' | Chain ' 
                                    + p.residue.chain 
                                    + ' | ' 
                                    + msg.range 
                                    + ' ] of ' 
                                    + p.strName 
                                    + ' structure has been ' 
                                    + msg.txt 
                                    + p.currReprSettings.name 
                                    + ' representation',
                            life: 10000
                        })
                    }
                    // check if selection is empty
                    if(selection === 'not(*)' && toastSettings.value) {
                        toast.add({ severity: 'warn', summary: 'Empty structure', detail: 'Warning! The ' + p.strName + ' structure of the ' + p.currReprSettings.name + ' representation is currently empty.', life: 10000 })
                    }
                    // save selection representation
                    setSelectionRepresentation(p.stage, selection, structures, p.re, true)
                        .then((r) => {
                            if(r.code != 404) console.log(r.message)
                            else console.error(r.message)
                        })
                    console.log(r.message)
                } else  console.error(r.message)
            })
    }

    const actionSelectAllHeteros = (p) => {
    
        let status, msg
        if(p.allSelected) {
            status = 'remove'
            msg = updateAllMolecules(p.type, p.currRepr, status)
            //console.log('I want to unselect all')
        } else {
            status = 'add'
            msg = updateAllMolecules(p.type, p.currRepr, status, p.model)
            //console.log('I want to select all')
        }

        // update representations selections
        const [selection, structures] = getSelection(p.model, status, p.currRepr, p.currStr, p.stage)
        // TODO: CLEAN residue, structure
        setMoleculesSettings(null, null, p.currRepr)
            .then((r) => {
                if(r.code != 404) {
                    //prevSelection = getCurrentMolecules(p.currRepr, 'heteroatoms')
                    if(toastSettings.value) {
                        toast.add({ 
                            severity: msg.status, 
                            summary: msg.tit, 
                            detail: 'All the ' + p.type + ' of Model ' 
                                    + (getCurrentModel(p.currRepr) + 1)
                                    + ' in ' 
                                    + p.strName 
                                    + ' structure have been ' 
                                    + msg.txt 
                                    + p.currReprSettings.name 
                                    + ' representation',
                            life: 10000
                        })
                    }
                    // check if selection is empty
                    if(selection === 'not(*)' && toastSettings.value) {
                        toast.add({ severity: 'warn', summary: 'Empty structure', detail: 'Warning! The ' + p.strName + ' structure of the ' + p.currReprSettings.name + ' representation is currently empty.', life: 10000 })
                    }
                    // save selection representation
                    setSelectionRepresentation(p.stage, selection, structures, p.re, true)
                        .then((r) => {
                            if(r.code != 404) console.log(r.message)
                            else console.error(r.message)
                        })
                    console.log(r.message)
                    
                } else  console.error(r.message)
            })

        return getCurrentMolecules(p.currRepr, p.type)

    }

    return { 
        actionLeaveSingleMolecule,
        actionLeaveSingleHetero,
        actionSheetLeave,
        actionHelixLeave,
        actionSelectSingleMolecule,
        actionSelectSetOfMolecules,
        actionSelectAllHeteros
    }

}