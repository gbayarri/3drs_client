import { computed } from 'vue'
import processStructure from '@/modules/ngl/processStructure'
import structureStorage from '@/modules/structure/structureStorage'
// Stage interactions
export default function loadStructure() {

    const { getStructure } = processStructure()
    const { projectData, updateStructure } = structureStorage()

    const dataProject = computed(() => projectData.value)
    const curr_repr = computed(() => projectData.value.currentRepresentation) 
    const def_repr = computed(() => projectData.value.defaultRepresentation) 

    const loadFileToStage = (stage, url, name, id) => {
        return stage.loadFile(url, { defaultRepresentation: false, ext: 'pdb', name:name })
            .then(function (component) {

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
            if(def_repr.value === curr_repr.value) {
                // default representation
                component.addRepresentation( "cartoon", { name: curr_repr.value + "-" + id + "-struc", sele: "*", color: "sstruc"} )
                if(structure.type === 'nucleic') component.addRepresentation( "base", { name: curr_repr.value + "-" + id + "-base", sele: "*", color: "resname" } )
                component.addRepresentation( "ball+stick", { name: curr_repr.value + "-" + id + "-ligand", sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
                component.addRepresentation( "ball+stick", { name: curr_repr.value + "-" + id + "-water", sele: "water",  radius: .4, aspectRatio: 1.5 } )
                component.addRepresentation( "ball+stick", { name: curr_repr.value + "-" + id + "-ion", sele: "ion",  radius: .4, aspectRatio: 1.5 } )
            } else {
                // TODO!!!!
            }

            return component
  
        })
    }

  return { loadFileToStage }

}