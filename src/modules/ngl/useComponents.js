import { computed } from 'vue'
import globals from '@/globals'
import processStructure from '@/modules/ngl/processStructure'
import structureStorage from '@/modules/structure/structureStorage'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import drawRepresentation from '@/modules/ngl/drawRepresentation'
import useTrajectories from '@/modules/ngl/useTrajectories'
import useStage from '@/modules/ngl/useStage'
//import useFlags from '@/modules/common/useFlags'
import useModals from '@/modules/common/useModals'
//import useAPI from '@/modules/api/useAPI'
// Stage interactions
export default function useComponents() {

    const { getStructure } = processStructure()
    const { projectData, updateStructure, updateStructureFirst } = structureStorage()
    const {  setVisibilityRepresentation, setOpacityRepresentation
    } = useRepresentations()
    const { currentStructure, updateTrajectorySettings, updateTrajectory } = structureSettings()
    const { addRepresentationToComponent } = drawRepresentation()
    const { createTrajectoryPlayer, getStage, createSelection } = useStage()
    const { checkTrajectory, setInitPlayer, setTrajectoryPlayer, updateCurrentFrame, setTrajectorySettings } = useTrajectories()
    const { closeModal } = useModals()
    //const { updateTrajectoryData } = useAPI()
    //const { setFlagStatus } = useFlags()


    const dataProject = computed(() => projectData.value)
    //const curr_repr = computed(() => projectData.value.currentRepresentation) 
    const currStr = computed(() => currentStructure.value)
    const def_repr = computed(() => projectData.value.defaultRepresentation) 
    const representations = computed(() => dataProject.value.representations) 

    const hex2rgba = (hex, alpha) => {
        const validHEXInput = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        if (!validHEXInput) return false
        const  output = {
            r: parseInt(validHEXInput[1], 16),
            g: parseInt(validHEXInput[2], 16),
            b: parseInt(validHEXInput[3], 16),
            a: alpha
        }
        return `rgba(${output.r}, ${output.g}, ${output.b}, ${output.a})`;
    }

    const loadFileToStage = (stage, url, name, ext, id, traj) => {
        const extension = (ext === undefined) ? 'pdb' : ext
        return stage.loadFile(url, { defaultRepresentation: false, ext: extension, name:id })
            .then(function (component) {

            //console.log(component.parameters.name)

            // set visibility to false until all structures are loaded
            component.setVisibility(false)

            // get structure
            // ONLY PARSE NGL IF FIRST TIME
            let structure = null
            if(dataProject.value.structure.length === 0 && dataProject.value.settings.length === 0) {
                structure = getStructure(component, name, extension)
                updateStructureFirst(structure, id)
            } else {
                const f = dataProject.value.files.filter(item => item.id === id)[0]
                structure = {
                    name: f.name,
                    type: f.type,
                    ext: f.ext,
                    trajectory: f.trajectory,
                    models: dataProject.value.structure.filter(item => item.id === id)[0].models 
                }
                //console.log(dataProject.value.settings)
                updateStructure(structure, id)
            }
            

            // add default representation
            if(def_repr.value) {
                // default representation
                component.addRepresentation( "cartoon", { name: def_repr.value + "-" + id + "-struc", sele: "/0", color: "sstruc", side: 'front'} )
                component.addRepresentation( "base", { name: def_repr.value + "-" + id + "-based", sele: "/0", color: "resname", side: 'front'} )
                component.addRepresentation( "ball+stick", { name: def_repr.value + "-" + id + "-ligand", sele: "/0 and hetero and not(water or ion)",  radius: .3 } )
                component.addRepresentation( "ball+stick", { name: def_repr.value + "-" + id + "-water", sele: "/0 and (water and not sol)",  radius: .3 } )
                component.addRepresentation( "ball+stick", { name: def_repr.value + "-" + id + "-ion", sele: "/0 and ion",  radius: .3 } )

                if(traj !== null) {
                    console.log('loading', traj.path, 'size', traj.size)
                    const t = component.addTrajectory( '3dRS/trajectories/' + traj.path, {centerPdb: true, removePbc: true, superpose: true, initialFrame: 0} )
                    //console.log(t)
                    // initialising players
                    setInitPlayer(id, traj)
                    // wait until trajectory parameters are completely loaded
                    checkTrajectory(t)
                        .then((trajectory) => {
                            //console.log(trajectory.frameCount)
                            const settings = traj.settings

                            // close BlockUI
                            //closeModal('block')

                            if(trajectory.frameCount === 0) console.error('Ooops! Trajectory not loaded yet!')
                            // if no settings.end (first time): default settings
                            // LEAVING THAT HERE JUST IN CASE SOMETHING WENT WRONG IN THE INITIAL LOADING
                            if(traj.settings.end === null || traj.settings.end === -1) {
                                settings.end =  trajectory.frameCount - 1
                                settings.range[1] =  trajectory.frameCount - 1
                                updateTrajectorySettings(settings)
                                setTrajectorySettings({ structure: currStr.value, settings: settings })
                                    .then((r) => {
                                        if(r.code != 404) console.log(r.message)
                                        else console.error(r.message)
                                    })
                            }
                            const player = createTrajectoryPlayer(trajectory, settings)
                            setTrajectoryPlayer(player, id)
                            //console.log(player)
                            //setFlagStatus('trajectoryLoaded', true)
                            // SET SOME FLAG HERE FOR ACTIVATE Trajectory.vue
                            trajectory.signals.frameChanged.add((a) => {
                                updateCurrentFrame(a, id)
                            })
                            /*trajectory.signals.parametersChanged.add((a) => {
                                console.log(a)
                            })*/
                            if(settings.autoplay) player.play()
                        })

                }

                // set initial values for default representation
                const re = new RegExp('(' + def_repr.value + '\-' + id + '\-[a-z]*)', 'g')
                const visible = representations.value.filter(item => item.id === def_repr.value)[0].visible
                setVisibilityRepresentation(stage, visible, re, false)
                const opacity = representations.value.filter(item => item.id === def_repr.value)[0].opacity * 100
                setOpacityRepresentation(stage, opacity, re, false)
            } 

            // only for user representations (not default)
            if(representations.value.length > 1) {
                for(const representation of representations.value) {
                    // jump default
                    if(representation.id !== def_repr.value) {
                        // representation name
                        const name_new = representation.id + "-" + component.parameters.name
                        // get selection for this structure (check if custom or manual)
                        const selection = 
                            representation.structures.filter(item => item.id === id)[0].selection.custom === "" ? 
                            representation.structures.filter(item => item.id === id)[0].selection.string :
                            representation.structures.filter(item => item.id === id)[0].selection.custom
                        // add new representation to component
                        const generatedRepresentations = addRepresentationToComponent(representation, component, name_new, selection)

                        // labels
                        if(selection !== 'not(*)') {
                            // TODO!!!! CHECK HERE IF selection.label
                            // CHECK AS WELL IF THERE IS A SINGLE STRUCTURE (IN THIS CASE, DON'T SHOW STRUCTURE NAME IN ANNOTATION)
                            // ON CHANGE COLOR SCHEME, MODIFY COLOR (??)
                            // ON ACTIVATE / DEACTIVATE, CREATE / DESTROY ANNOTATION (SEE REMOVE ANNOTATION)
                            //console.log(name, component.name, representation.name)
                            //console.log(representation)
                            const ap = component.getCenterUntransformed(selection)
                            //var ap = component.structure.getAtomProxy(0)
                            /*const sele = createSelection(selection)
                            const idx = component.structure.getAtomIndices(sele)[ 0 ]
                            const ap = component.structure.getAtomProxy(idx)*/
                            //console.log(ap2)
                            const color = representation.color_scheme === 'uniform' ? 
                                            representation.color : 
                                            globals.colorScheme.filter(item => item.id === representation.color_scheme)[0].color
                            const elm = document.createElement("div")
                                elm.innerText = name + ' - ' + representation.name
                                elm.style.color = "#fff"
                                elm.style.backgroundColor = hex2rgba(color, .5)
                                elm.style.padding = "15px"
                                elm.style.fontSize = "25px"
                                elm.style.textShadow =  '-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000'
                            //component.addAnnotation(ap.positionToVector3(), elm)
                            const ann = component.addAnnotation(ap, elm)
                            ann.id = representation.id
                            console.log(ann)
                        }
                    }
                }
            }

            return component
        })
    }

    const addRepresentation = (stage, representation) => {

        stage.eachComponent( function( component ){
            //console.log(component.parameters.name)
            // representation name
            const name_new = representation.id + "-" + component.parameters.name
            // get selection for this structure
            const selection = representation.structures.filter(item => item.id === component.parameters.name)[0].selection.string
            // add representation
            const generatedRepresentations = addRepresentationToComponent(representation, component, name_new, selection)
        } )

        //console.log(stage)

    }

    const addNewTrajectory = (traj) => {
        const stg = getStage()
        const component = computed(() => stg.compList.filter(item => item.parameters.name === currStr.value)[0])
        //console.log(stg)
        //console.log(component)
        
        console.log('loading', traj.path, 'size', traj.size)
        const t = component.value.addTrajectory( '3dRS/trajectories/' + traj.path, {centerPdb: true, removePbc: true, superpose: true, initialFrame: 0} )
        //console.log(t)
        const cs = currStr.value
        // initialising players
        setInitPlayer(cs, traj)
        // wait until trajectory parameters are completely loaded
        checkTrajectory(t)
            .then((trajectory) => {
                //console.log(trajectory.frameCount)
                const settings = traj.settings
                if(trajectory.frameCount === 0) console.error('Ooops! Trajectory not loaded yet!')
                // if no settings.end (first time): default settings
                if(traj.settings.end === null) {
                    settings.end =  trajectory.frameCount - 1
                    settings.range[1] =  trajectory.frameCount - 1
                    updateTrajectory(traj)
                    setTrajectorySettings({ structure: cs, settings: settings })
                        .then((r) => {
                            //console.log(stage)
                            if(r.code != 404) console.log(r.message)
                            else console.error(r.message)
                        })
                    // close BlockUI
                    closeModal('block')
                }
                const player = createTrajectoryPlayer(trajectory, settings)
                setTrajectoryPlayer(player, cs)
                //console.log(player)
                trajectory.signals.frameChanged.add((a) => {
                    updateCurrentFrame(a, cs)
                })
            })

    }

    const delRepresentation = (stage, representation_id) => {

        //stage.eachComponent()

        //const re = computed(() => new RegExp('(' + currReprVal.value + '\-[0-9a-z]*\-[a-z]*)', 'g'))
        
        /*for(const item of stage.getRepresentationsByName(representation_id + "-" + file_id + "-all").list) {
            console.log(item)
        }*/

        stage.eachComponent( function( component ){
            //console.log(component.parameters.name)
            //console.log(stage.getRepresentationsByName(representation_id + "-" + component.parameters.name + "-all"))
            const re = new RegExp('(' + representation_id + '\-' + component.parameters.name + '\-[a-z]*)', 'g')
            for(const item of stage.getRepresentationsByName(re).list) {
                //console.log(item)
                item.dispose()
            }
            //component.list[0].dispose()
            //component.addRepresentation( representation.mol_repr, { name: representation.id + "-" + component.parameters.name + "-all", sele: "not(*)", color: representation.color_scheme} )
        } )

        //console.log(stage)

    }

  return { loadFileToStage, addRepresentation, addNewTrajectory, delRepresentation }

}