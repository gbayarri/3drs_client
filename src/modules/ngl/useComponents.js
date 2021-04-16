import { computed } from 'vue'
import processStructure from '@/modules/ngl/processStructure'
import structureStorage from '@/modules/structure/structureStorage'
import useRepresentations from '@/modules/representations/useRepresentations'
import drawRepresentation from '@/modules/ngl/drawRepresentation'
import useStage from '@/modules/ngl/useStage'
// Stage interactions
export default function useComponents() {

    const { getStructure } = processStructure()
    const { projectData, updateStructure, updateStructureFirst } = structureStorage()
    const { 
        setVisibilityRepresentation,
        setOpacityRepresentation
    } = useRepresentations()
    const { addRepresentationToComponent } = drawRepresentation()
    const { createTrajectoryPlayer } = useStage()

    const dataProject = computed(() => projectData.value)
    //const curr_repr = computed(() => projectData.value.currentRepresentation) 
    const def_repr = computed(() => projectData.value.defaultRepresentation) 
    const representations = computed(() => dataProject.value.representations) 

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
                structure = {
                    name: dataProject.value.files.filter(item => item.id === id)[0].name,
                    type: dataProject.value.files.filter(item => item.id === id)[0].type,
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

                // *************************************************
                // *************************************************
                if(traj !== null) {
                    console.log('loading', traj.path, 'size', traj.size)
                    const t = component.addTrajectory( '3dRS/trajectories/' + traj.path, {centerPdb: true, removePbc: true, superpose: true, initialFrame: 0} )
                    console.log(t)
                    const player = createTrajectoryPlayer(t.trajectory, 1, 0, 150)
                    // HARDCODED!!!!
                    player.parameters.end = 150
                    console.log(player)
                    player.play()
                    /*totalFrames = 151
					var player = new NGL.TrajectoryPlayer( traj, {
							step: step,
							//timeout: 100,
							start: 0,
							end: totalFrames,
							interpolateType: "linear",
							mode: "loop"
					} );
					player.end = traj.frames.length;
					traj.setPlayer( player );
					traj.player.play();
					trajectoryPlayer = traj.player;
					
					traj.signals.frameChanged.add((a) => {
						updateCurrentFrame(a);
					});*/
                }
                // *************************************************
                // *************************************************

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

  return { loadFileToStage, addRepresentation, delRepresentation }

}