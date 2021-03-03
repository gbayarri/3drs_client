import { computed } from 'vue'
import processStructure from '@/modules/ngl/processStructure'
import structureStorage from '@/modules/structure/structureStorage'

// Stage interactions
export default function loadStructure() {

    const { getStructure } = processStructure()
    const { projectData, updateStructure } = structureStorage()

    const dataProject = computed(() => projectData.value)

    const loadFileToStage = (stage, url, name, id) => {
        return stage.loadFile(url, { defaultRepresentation: false, ext: 'pdb', name:name })
            .then(function (component) {

            // set visibility to false until all structures are loaded
            component.setVisibility(false)
  
            // DON'T REMOVE
            //component.addRepresentation( "cartoon", {  sele: "helix", color: "#f00", opacity:.4, aspectRatio:10 } )
            //component.addRepresentation( "cartoon", {  sele: "sheet", color: "#0f0", opacity:.4, aspectRatio:10 } )
            // DON'T REMOVE

            //console.log('structure ' + name + ' loaded')

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

            // add default representations
            // this is representation #1
            component.addRepresentation( "cartoon", { name: "struc_1", sele: "*", color: "sstruc"} )
            //if(structure.type.isNucleic) component.addRepresentation( "base", { name: "base_1", sele: "*", color: "resname" } )
            if(structure.type === 'nucleic') component.addRepresentation( "base", { name: "base_1", sele: "*", color: "resname" } )
            component.addRepresentation( "ball+stick", { name: "ligand_1", sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
            component.addRepresentation( "ball+stick", { name: "water_1", sele: "water",  radius: .4, aspectRatio: 1.5 } )
            component.addRepresentation( "ball+stick", { name: "ion_1", sele: "ion",  radius: .4, aspectRatio: 1.5 } )

            return component
  
        })
    }

  return { loadFileToStage }

}