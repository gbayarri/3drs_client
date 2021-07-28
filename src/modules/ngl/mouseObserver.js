import globals from '@/globals'
import { ref, computed/*, onMounted*/ } from 'vue'
import { useToast } from 'primevue/usetoast'
import useLegend from '@/modules/viewport/useLegend'
import structureStorage from '@/modules/structure/structureStorage'
import useFlags from '@/modules/common/useFlags'
import useAPI from '@/modules/api/useAPI'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useActions from '@/modules/representations/useActions'
import useStage from '@/modules/ngl/useStage'
import useMeasurements from '@/modules/structure/useMeasurements'
import useProjectSettings from '@/modules/structure/useProjectSettings'
const initialOrientation = ref([])
//const distances = ref([])

// Stage interactions
export default function mouseObserver() {

    const { updateLegend } = useLegend()
    const { setFlagStatus } = useFlags()
    const { projectData } = structureStorage()
    const { updateProjectData } = useAPI()
    const { /*currentStructure,*/ getFileNames, getMolecule, getChains } = structureSettings()
    const { currentRepresentation, getCurrentRepresentationSettings, updateRepresentationProperty, setLabelPosition } = useRepresentations()
    const { actionSelectSingleMolecule } = useActions()
    const { calculateDistance, calculateAngle } = useStage()
    const { getMeasurements, updateMeasurements, createDistance, createAngle } = useMeasurements()
    const { getProjectSettings } = useProjectSettings()

    const toast = useToast()
    const filesList = computed(() => getFileNames())
    //const currStr = computed(() => currentStructure.value)
    const currReprVal = computed(() => currentRepresentation.value)
    const currReprSettings = computed(() => getCurrentRepresentationSettings())
    const dataProject = computed(() => projectData.value)
    const toastSettings = computed(() => getProjectSettings().toasts) 
    const shortTimeOut = 1000
    const timeOut = 5000
    let atomPair = []
    let atomTriple = []

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

    const chainImpostor = (ch) => {
        if(ch === '') {
            if(getChains(currReprVal.value).length > 1) return '@'
            else return 'A'
        } else return ch
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
                const chain = chainImpostor(pickingProxy.atom.chainname)
                const resname = pickingProxy.atom.resname
                const resnum = pickingProxy.atom.resno
                const atomname = pickingProxy.atom.atomname
                const aminoacid = globals.aminoacids[resname.toLowerCase()]
                let residue_name = resname
                if(pickingProxy.atom.isProtein() ||
                    pickingProxy.atom.isNucleic()) {
                        const aminoacid_name = (aminoacid !== undefined) ? aminoacid.name : 'modified residue'
                        residue_name = resname + ' (<span class="lowercase-legend">' + aminoacid_name + '</span>)'
                }
                updateLegend({
                    name: name,
                    model: model,
                    chainname: chain,
                    resname: residue_name,
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
                const sele = resnum + ':' + (chain === '@' ? '' : chain) + '/' + model
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
                const resname = pickingProxy.bond.atom1.resname
                const aminoacid = globals.aminoacids[resname.toLowerCase()]
                let residue_name = resname
                if(pickingProxy.bond.atom1.isProtein() ||
                    pickingProxy.bond.atom1.isNucleic()) {
                        const aminoacid_name = (aminoacid !== undefined) ? aminoacid.name : 'modified residue'
                        residue_name = resname + ' (<span class="lowercase-legend">' + aminoacid_name + '</span>)'
                }
                updateLegend({
                    name: name,
                    model: pickingProxy.bond.atom1.modelIndex,
                    chainname: chainImpostor(pickingProxy.bond.atom1.chainname),
                    resname: residue_name,
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
            //console.log(stage.viewer.camera.far)
            //console.log(stage.viewerControls.position)
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
                const chain = chainImpostor(pickingProxy.atom.chainname)
                const resname = pickingProxy.atom.resname
                const resnum = pickingProxy.atom.resno
                const atomname = pickingProxy.atom.atomname
                const aminoacid = globals.aminoacids[resname.toLowerCase()]
                let residue_name = resname
                if(pickingProxy.atom.isProtein() ||
                    pickingProxy.atom.isNucleic()) {
                        const aminoacid_name = (aminoacid !== undefined) ? aminoacid.name : 'modified residue'
                        residue_name = resname + ' (<span class="lowercase-legend">' + aminoacid_name + '</span>)'
                }
                updateLegend({
                    name: name,
                    model: model,
                    chainname: chain,
                    resname: residue_name,
                    resno: resnum,
                    atomname: atomname
                })
                setFlagStatus('legendEnabled', true)
                
            }
            if (pickingProxy && pickingProxy.bond) {
                const name = filesList.value.filter(item => item.id === pickingProxy.bond.structure.name)[0].name
                const resname = pickingProxy.bond.atom1.resname
                const aminoacid = globals.aminoacids[resname.toLowerCase()]
                let residue_name = resname
                if(pickingProxy.bond.atom1.isProtein() ||
                    pickingProxy.bond.atom1.isNucleic()) {
                        const aminoacid_name = (aminoacid !== undefined) ? aminoacid.name : 'modified residue'
                        residue_name = resname + ' (<span class="lowercase-legend">' + aminoacid_name + '</span>)'
                }
                updateLegend({
                    name: name,
                    model: pickingProxy.bond.atom1.modelIndex,
                    chainname: chainImpostor(pickingProxy.bond.atom1.chainname),
                    resname: residue_name,
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
            const chain = chainImpostor(pickingProxy.atom.chainname)
            const resnum = pickingProxy.atom.resno

            const sele = resnum + ':' + (chain === '@' ? '' : chain) + '/' + model

            component.autoView(sele, 500)

            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), shortTimeOut)
        }
    }

    const pickAtomPosition = (stage, pickingProxy) => {
        if (pickingProxy && pickingProxy.atom) {
            const pos = [pickingProxy.atom.x, pickingProxy.atom.y, pickingProxy.atom.z]
            currReprSettings.value.label.position = pos
            updateRepresentationProperty('label', currReprSettings.value.label)
            setLabelPosition(stage, currReprSettings.value, true)
                .then((r) => {
                    if(r.code != 404) {
                        setFlagStatus('labelPositionMode', false)
                        console.log(r.message)
                    }else console.error(r.message)
                })
        }
    }

    const selectResidue = (stage, pickingProxy) => {
        if (pickingProxy && pickingProxy.atom) {
            //const name = filesList.value.filter(item => item.id === pickingProxy.atom.structure.name)[0].name
            const model = pickingProxy.atom.modelIndex
            const chain = chainImpostor(pickingProxy.atom.chainname)
            const resname = pickingProxy.atom.resname
            const resnum = pickingProxy.atom.resno
            //const atomname = pickingProxy.atom.atomname

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
                re: computed(() => new RegExp('(' + currReprVal.value + '\-' + pickingProxy.atom.structure.name + '\-[a-z]*)', 'g')).value,
            }

            //console.log(pickingProxy.atom.isWater(), pickingProxy.atom.isHetero())
            let type = ''
            if(pickingProxy.atom.isProtein() ||
                pickingProxy.atom.isNucleic()) {
                type = 'residues'
                properties.css_type = 'sequence'
            }
            if(pickingProxy.atom.isWater()) {
                type = 'waters'
                properties.css_type = 'water'
            }
            if(pickingProxy.atom.isHetero() && !pickingProxy.atom.isWater()) type = 'heteroatoms'
            if(pickingProxy.atom.isIon()||
            pickingProxy.atom.isMetal()) type = 'ions'

            // **************************************
            // **************************************
            // **************************************
            /*console.log(pickingProxy.atom)
            console.log(pickingProxy.atom.isPolymer(), 
            pickingProxy.atom.isBackbone(), 
            pickingProxy.atom.isHelix(), 
            pickingProxy.atom.isSheet(),
            pickingProxy.atom.isAromatic(),
            pickingProxy.atom.isProtein()
            )*/
            // **************************************
            // **************************************
            // **************************************
            properties.residue = getMolecule(currReprVal.value, type, model, chain, resnum)
            properties.type = type

            //console.log(properties)

            actionSelectSingleMolecule(properties)
        }
    }

    const getDistance = (stage, pickingProxy) => {
        if (pickingProxy && pickingProxy.atom) {

            const model = pickingProxy.atom.modelIndex
            const chain = chainImpostor(pickingProxy.atom.chainname)
            const resnum = pickingProxy.atom.resno
            const atomname = pickingProxy.atom.atomname

            atomPair.push({
                sele: `${resnum}:${(chain === '@' ? '' : chain)}.${atomname}/${model}`,
                coords: {
                    x: pickingProxy.atom.x,
                    y: pickingProxy.atom.y,
                    z: pickingProxy.atom.z
                }
            })

            if(atomPair.length === 2) {        

                const component = stage.compList.filter(item => item.parameters.name === pickingProxy.atom.structure.name)[0]
                const atom1 = atomPair[0]
                const atom2 = atomPair[1]

                const dist = calculateDistance(atom1.coords, atom2.coords)
                const uuid = Math.random().toString(36).slice(-6)
                const ap = {
                    id: uuid,
                    sele: [ atom1.sele, atom2.sele ],
                    dist: dist,
                    color: '#000000',
                    size: 5
                }

                createDistance(ap, component, pickingProxy.atom.structure.name)

                const distances = getMeasurements('distances')
                distances.filter(item => item.id === pickingProxy.atom.structure.name)[0].atomPairs.push(ap)

                updateMeasurements('distances', distances)
                    .then((r) => {
                        if(r.code != 404) {
                            if(toastSettings.value) {
                                toast.add({ 
                                    severity:'info', 
                                    summary: 'New distance', 
                                    detail:`A new distance of <strong>${dist} Å</strong> has been added.`, 
                                    life: 5000
                                })
                            }
                            console.log(r.message)
                        } else console.error(r.message)
                    })

                atomPair = []
            }

        }
    }


    const getAngle = (stage, pickingProxy) => {
        if (pickingProxy && pickingProxy.atom) {

            const model = pickingProxy.atom.modelIndex
            const chain = chainImpostor(pickingProxy.atom.chainname)
            const resnum = pickingProxy.atom.resno
            const atomname = pickingProxy.atom.atomname

            atomTriple.push({
                sele: `${resnum}:${(chain === '@' ? '' : chain)}.${atomname}/${model}`,
                coords: {
                    x: pickingProxy.atom.x,
                    y: pickingProxy.atom.y,
                    z: pickingProxy.atom.z
                }
            })

            if(atomTriple.length === 3) {
                console.log(atomTriple)           

                const component = stage.compList.filter(item => item.parameters.name === pickingProxy.atom.structure.name)[0]
                const atom1 = atomTriple[0]
                const atom2 = atomTriple[1]
                const atom3 = atomTriple[2]

                const angle = calculateAngle(atom1.coords, atom2.coords, atom3.coords)
                const uuid = Math.random().toString(36).slice(-6)
                const at = {
                    id: uuid,
                    sele: [ atom1.sele, atom2.sele, atom3.sele ],
                    angle: angle,
                    color: '#546974',
                    size: 5
                }

                createAngle(at, component, pickingProxy.atom.structure.name)

                const angles = getMeasurements('angles')
                angles.filter(item => item.id === pickingProxy.atom.structure.name)[0].atomTriples.push(at)

                updateMeasurements('angles', angles)
                    .then((r) => {
                        if(r.code != 404) {
                            if(toastSettings.value) {
                                toast.add({ 
                                    severity:'info', 
                                    summary: 'New angle', 
                                    detail:`A new angle of <strong>${angle}°</strong> has been added.`, 
                                    life: 5000
                                })
                            }
                            console.log(r.message)
                        } else console.error(r.message)
                    })

                atomTriple = []
            }

        }        
    }

  return { 
      initialOrientation,
      setInitOrientation,
      checkMouseSignals, 
      checkMouseSignalsShared, 
      zoomToResidue,
      pickAtomPosition,
      selectResidue,
      getDistance,
      getAngle
    }

}