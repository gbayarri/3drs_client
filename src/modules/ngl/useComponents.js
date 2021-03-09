import { computed } from 'vue'
import processStructure from '@/modules/ngl/processStructure'
import structureStorage from '@/modules/structure/structureStorage'
import useRepresentations from '@/modules/representations/useRepresentations'
import drawRepresentation from '@/modules/ngl/drawRepresentation'
// Stage interactions
export default function useComponents() {

    const { getStructure } = processStructure()
    const { projectData, updateStructure } = structureStorage()
    const { 
        setVisibilityRepresentation,
        setOpacityRepresentation
    } = useRepresentations()
    const { addRepresentationToComponent } = drawRepresentation()

    const dataProject = computed(() => projectData.value)
    const curr_repr = computed(() => projectData.value.currentRepresentation) 
    const def_repr = computed(() => projectData.value.defaultRepresentation) 
    const representations = computed(() => dataProject.value.representations) 

    /*const addRepresentationToComponent = (representation, component, name_new, selection) => {

        const color_scheme = computed(() => representation.color_scheme === 'uniform' ? representation.color : representation.color_scheme)

        switch (representation.mol_repr) {
            // in case of cartoon, add base (just in case is nucleic)
            case 'cartoon':
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                //component.addRepresentation( 'cartoon', { name: name_new + '-cartoon', sele: selection, color: color_scheme.value } )
                //component.addRepresentation( 'base', { name: name_new + '-base', sele: selection, color: color_scheme.value } )
                ///********************************************************************* 
                ///********************************************************************* 
                ///********************************************************************* 
                component.addRepresentation( 'cartoon', { name: name_new + '-cartoon', sele: '*', color: color_scheme.value } )
                component.addRepresentation( 'base', { name: name_new + '-base', sele: '*', color: color_scheme.value } )
              break
            default:
              
              break
        }

    }*/

    const loadFileToStage = (stage, url, name, id) => {
        // NAME GIVES PROBLEMS IN LEGEND
        return stage.loadFile(url, { defaultRepresentation: false, ext: 'pdb', name:id })
            .then(function (component) {

            //console.log(component.parameters.name)

            // set visibility to false until all structures are loaded
            component.setVisibility(false)

            // get structure
            // ONLY PARSE NGL IF FIRST TIME
            let structure = null
            if(dataProject.value.structure.length === 0 && dataProject.value.settings.length === 0) {
                structure = getStructure(component, name)
            } else {
                structure = {
                    name: dataProject.value.files.filter(item => item.id === id)[0].name,
                    type: dataProject.value.files.filter(item => item.id === id)[0].type,
                    models: dataProject.value.structure.filter(item => item.id === id)[0].models 
                }
            }
            updateStructure(structure, id)

            // add representations
            // CHECK THAT!!! ALL THE REPRESENTATIONS SHOULD BE SHOWN!!!!!
            if(def_repr.value/* === curr_repr.value*/) {
                // default representation
                component.addRepresentation( "cartoon", { name: def_repr.value + "-" + id + "-struc", sele: "*", color: "sstruc"} )
                /*if(structure.type === 'nucleic') */component.addRepresentation( "base", { name: def_repr.value + "-" + id + "-base", sele: "*", color: "resname" } )
                component.addRepresentation( "ball+stick", { name: def_repr.value + "-" + id + "-ligand", sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
                component.addRepresentation( "ball+stick", { name: def_repr.value + "-" + id + "-water", sele: "water",  radius: .4, aspectRatio: 1.5 } )
                component.addRepresentation( "ball+stick", { name: def_repr.value + "-" + id + "-ion", sele: "ion",  radius: .4, aspectRatio: 1.5 } )
                // set initial values for default representation
                const re = new RegExp('(' + def_repr.value + '\-[0-9a-z]*\-[a-z]*)', 'g')
                const visible = representations.value.filter(item => item.id === def_repr.value)[0].visible
                setVisibilityRepresentation(stage, visible, re.value, false)
                const opacity = representations.value.filter(item => item.id === def_repr.value)[0].opacity * 100
                setOpacityRepresentation(stage, opacity, re.value, false)
            } /*else {
                
            }*/

            // only for user representations (not default)
            if(representations.value.length > 1) {
                for(const representation of representations.value) {
                    // jump default
                    if(representation.id !== def_repr.value) {
                        // representation name
                        const name_new = representation.id + "-" + component.parameters.name
                        // get selection for this structure
                        const selection = representation.structures.filter(item => item.id === id)[0].selection
                        // add new representation to component
                        addRepresentationToComponent(representation, component, name_new, selection)

                          
                        

                        // make a switch with all the possible molecular representations
                        //component.addRepresentation( representation.mol_repr, { name: name_new, sele: selection, color: representation.color_scheme} )

                        // TODO: set initial values for other representations: opacity, radius, color...    
                    }

                    

                }

            }
            
            return component
  
        })
    }

    const addRepresentation = (stage, representation) => {

        /*'id' => $repr, 
			'name' => $data['name'],
			'visible' => true,prjID
			'opacity' => 1,
			'navigation' => [],
			'structures' => $structures,
			'mol_repr' => 'cartoon',
            'radius' => 5,
            'color_scheme' => 'sstruc',
			'color' => '#f1f1f1'*/
        
        // PUT CONDITIONALS FOR COLOR, RADIUS...    

        //stage.eachComponent()

        console.log(representation)

        stage.eachComponent( function( component ){
            //console.log(component.parameters.name)
            // representation name
            const name_new = representation.id + "-" + component.parameters.name
            // get selection for this structure
            const selection = representation.structures.filter(item => item.id === component.parameters.name)[0].selection

            addRepresentationToComponent(representation, component, name_new, selection)

            //component.addRepresentation( representation.mol_repr, { name: representation.id + "-" + component.parameters.name + "-all", sele: representation.selection, color: representation.color_scheme} )
        } )

        console.log(stage)

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

        console.log(stage)

    }

  return { loadFileToStage, addRepresentation, delRepresentation }

}