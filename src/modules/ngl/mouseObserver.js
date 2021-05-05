import { ref, computed, onMounted } from 'vue'
import useLegend from '@/modules/viewport/useLegend'
import structureStorage from '@/modules/structure/structureStorage'
import useFlags from '@/modules/common/useFlags'
import useAPI from '@/modules/api/useAPI'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useActions from '@/modules/representations/useActions'
const initialOrientation = ref([])

// Stage interactions
export default function mouseObserver() {

    const { updateLegend } = useLegend()
    const { setFlagStatus } = useFlags()
    const { projectData } = structureStorage()
    const { updateProjectData } = useAPI()
    const { currentStructure, getFileNames, getMolecule } = structureSettings()
    const { currentRepresentation, getCurrentRepresentationSettings } = useRepresentations()
    const { actionSelectSingleMolecule } = useActions()

    const filesList = computed(() => getFileNames())
    //const currStr = computed(() => currentStructure.value)
    const currReprVal = computed(() => currentRepresentation.value)
    const currReprSettings = computed(() => getCurrentRepresentationSettings())
    const dataProject = computed(() => projectData.value)
    const shortTimeOut = 1000
    const timeOut = 5000

    //const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))

    /*onMounted(() => {
        console.log(currentStructure.value)
    })*/

    const setInitOrientation = function (orientation) {
        initialOrientation.value = orientation
    }
  
    const autoSaveOrientation = function(orientation) {
        updateProjectData(dataProject.value._id, { orientation: orientation })
            .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
            })
    }

    const cleanSequences = () => {
        const allResidues = document.querySelectorAll('.sequence-item, .water-item')
        for(const res of allResidues) {
            res.classList.remove('sequence-item-hover')
        }
    }

    const cleanHeteroIons = () => {
        const selHetsIons = document.querySelectorAll('.settings-panel .p-listbox .p-listbox-list .p-listbox-item')
        // TODO!!! CHECK IF SELECTEEEEDD!!!!!
        for(const hi of selHetsIons) {
            if(!hi.classList.contains('p-highlight')) hi.style.background = 'none'
            else hi.style.background = '#dfe7ef'
            //hi.classList.remove('p-highlight')
        }
    }

    const cleanRepresentation = (stage, re) => {
        for(const item of stage.getRepresentationsByName(re).list) {
            item.dispose()
        }
    }

    const checkMouseSignals = (stage) => {

        //const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])
        let component = null

        // on hover actions: show atoms / bonds in legend
        stage.signals.hovered.add( function(pickingProxy){ 
            // update / show legend
            if (pickingProxy && pickingProxy.atom) {

                component = stage.compList.filter(item => item.parameters.name === pickingProxy.atom.structure.name)[0]

                const name = filesList.value.filter(item => item.id === pickingProxy.atom.structure.name)[0].name
                const model = pickingProxy.atom.modelIndex
                const chain = pickingProxy.atom.chainname
                const resname = pickingProxy.atom.resname
                const resnum = pickingProxy.atom.resno
                const atomname = pickingProxy.atom.atomname
                updateLegend({
                    name: name,
                    model: model,
                    chainname: chain,
                    resname: resname,
                    resno: resnum,
                    atomname: atomname
                })
                setFlagStatus('legendEnabled', true)
                // TODO BETTER:
                cleanSequences()
                cleanHeteroIons()
                // FIX WITH MULTIMODEL!!!!!!
                const selResidues = document.querySelectorAll('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"]')
                //console.log('[data-model="' + model + '"][data-chain="' + chain + '"][data-resnum="' + resnum + '"]')
                for(const res of selResidues) {
                    res.classList.add('sequence-item-hover')
                }
                
                let radius = 1
                // nor residues neither waters ( === hetero && ions )
                //if(selResidues.length === 0) {
                    // NOT WORKING FOR MULTI STRUCTURES!!!!
                if(pickingProxy.atom.isHetero() || pickingProxy.atom.isIon()) {
                    radius = 2
                    //console.log(pickingProxy)
                    const selHetsIons = document.querySelectorAll('[aria-label="' + chain + ': ' + resname + ' ' + resnum + '"]')
                    //console.log(chain + ': ' + resname + ' ' + resnum)
                    /*if(!selHetsIons[0].classList.contains('p-highlight')) */
                    if(selHetsIons.length === 1) selHetsIons[0].style.background = '#e9ecef'
                    //selHetsIons[0].classList.add('p-highlight')
                    //document.querySelector("#a-hyz-1").style.background = '#e9ecef'
                }

                // NGL representation
                const sele = resnum + ':' + chain + '/' + model
                //const new_name = currStr.value + '-' + sele + '-hover'
                //const re = new RegExp('(' + currStr.value + '\-[0-9A-Z\:\/]*\-hover)', 'g')
                const new_name = pickingProxy.atom.structure.name + '-' + sele + '-hover'
                //const re = new RegExp('(' + pickingProxy.atom.structure.name + '\-[0-9A-Z\:\/]*\-hover)', 'g')
                const re = new RegExp('([0-9A-Z\:\/]*\-[0-9A-Z\:\/]*\-hover)', 'g')
                cleanRepresentation(stage, re)
                component.addRepresentation( "spacefill", { 
                    name: new_name,
                    sele: '(' + sele + ')', 
                    opacity:.5, 
                    radius:radius,
                    color:'#5E738B'
                })
            }
            if (pickingProxy && pickingProxy.bond) {
                const name = filesList.value.filter(item => item.id === pickingProxy.bond.structure.name)[0].name
                updateLegend({
                    name: name,
                    model: pickingProxy.bond.atom1.modelIndex,
                    chainname: pickingProxy.bond.atom1.chainname,
                    resname: pickingProxy.bond.atom1.resname,
                    resno: pickingProxy.bond.atom1.resno,
                    atomname: pickingProxy.bond.atom1.atomname + '-' + pickingProxy.bond.atom2.atomname
                })
                setFlagStatus('legendEnabled', true)
            }
            // hide legend
            if (!pickingProxy) {
                setFlagStatus('legendEnabled', false)
                cleanSequences()
                cleanHeteroIons()
                //const re = new RegExp('(' + currStr.value + '\-[0-9A-Z\:\/]*\-hover)', 'g')
                const re = new RegExp('([0-9A-Z\:\/]*\-[0-9A-Z\:\/]*\-hover)', 'g')
                cleanRepresentation(stage, re)
            }
        })

        // on drag / scroll actions: save orientation after 5s
        let myTimeOut = null
        stage.mouseObserver.signals.dragged.add(function (delta) {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), timeOut)
        })

        stage.mouseObserver.signals.scrolled.add(function (scroll) {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), timeOut)
        })

        stage.mouseObserver.signals.doubleClicked.add(function (scroll) {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), timeOut)
        })

        //console.log(stage.signals)

    }

    const checkMouseSignalsShared = (stage) => {

        // on hover actions: show atoms / bonds in legend
        stage.signals.hovered.add( function(pickingProxy){ 
            // update / show legend
            if (pickingProxy && pickingProxy.atom) {
                const name = filesList.value.filter(item => item.id === pickingProxy.atom.structure.name)[0].name
                const model = pickingProxy.atom.modelIndex
                const chain = pickingProxy.atom.chainname
                const resname = pickingProxy.atom.resname
                const resnum = pickingProxy.atom.resno
                const atomname = pickingProxy.atom.atomname
                updateLegend({
                    name: name,
                    model: model,
                    chainname: chain,
                    resname: resname,
                    resno: resnum,
                    atomname: atomname
                })
                setFlagStatus('legendEnabled', true)
                
            }
            if (pickingProxy && pickingProxy.bond) {
                const name = filesList.value.filter(item => item.id === pickingProxy.bond.structure.name)[0].name
                updateLegend({
                    name: name,
                    model: pickingProxy.bond.atom1.modelIndex,
                    chainname: pickingProxy.bond.atom1.chainname,
                    resname: pickingProxy.bond.atom1.resname,
                    resno: pickingProxy.bond.atom1.resno,
                    atomname: pickingProxy.bond.atom1.atomname + '-' + pickingProxy.bond.atom2.atomname
                })
                setFlagStatus('legendEnabled', true)
            }
            // hide legend
            if (!pickingProxy) {
                setFlagStatus('legendEnabled', false)
            }
        })

    }

    const zoomToResidue = (stage, pickingProxy) => {
        if (pickingProxy && pickingProxy.atom) {

            let myTimeOut = null
            //const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])
            const component = stage.compList.filter(item => item.parameters.name === pickingProxy.atom.structure.name)[0]
            const model = pickingProxy.atom.modelIndex
            const chain = pickingProxy.atom.chainname
            const resnum = pickingProxy.atom.resno

            const sele = resnum + ':' + chain + '/' + model

            component.autoView(sele, 500)

            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), shortTimeOut)
        }
    }

    const selectResidue = (stage, pickingProxy) => {
        if (pickingProxy && pickingProxy.atom) {
            const name = filesList.value.filter(item => item.id === pickingProxy.atom.structure.name)[0].name
            const model = pickingProxy.atom.modelIndex
            const chain = pickingProxy.atom.chainname
            const resname = pickingProxy.atom.resname
            const resnum = pickingProxy.atom.resno
            const atomname = pickingProxy.atom.atomname

            const properties = {
                stage: stage,
                model: model, 
                chain: chain, 
                resnum: resnum, 
                resname: resname,
                currRepr: currReprVal.value,
                currReprSettings: currReprSettings.value,
                //currStr: currStr.value,
                currStr: pickingProxy.atom.structure.name,
                //strName: filesList.value.filter(item => item.id === currStr.value)[0].name,
                strName: filesList.value.filter(item => item.id === pickingProxy.atom.structure.name)[0].name,
                //re: re.value
                re: computed(() => new RegExp('(' + currReprVal.value + '\-' + pickingProxy.atom.structure.name + '\-[a-z]*)', 'g')).value
            }

            let type = ''
            if(pickingProxy.atom.isPolymer()) {
                type = 'residues'
                properties.css_type = 'sequence'
            }
            if(pickingProxy.atom.isWater()) {
                type = 'waters'
                properties.css_type = 'water'
            }
            if(pickingProxy.atom.isHetero()) type = 'heteroatoms'
            if(pickingProxy.atom.isIon()) type = 'ions'

            properties.residue = getMolecule(currReprVal.value, type, model, chain, resnum)
            properties.type = type

            actionSelectSingleMolecule(properties)
        }
    }

  return { 
      initialOrientation,
      setInitOrientation,
      checkMouseSignals, 
      checkMouseSignalsShared, 
      zoomToResidue,
      selectResidue
    }

}