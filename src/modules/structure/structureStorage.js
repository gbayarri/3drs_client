import { ref } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'

const processedStructure = ref([])
const projectData = ref({})

// stores data to project value
// CHECK IF ALL THIS STRUCTURE FITS WITH MONGO STRUCTURE
export default function structureStorage() {

    const { settings } = structureSettings()

    const resetStructure = function (str) {
        // reset processedStructure & settings
        processedStructure.value = []
        settings.value = []
    }

    const initProject = function (apiData) {
        projectData.value = apiData
    }

    const updateStructure = function (str, id) {
        // init processedStructure
        processedStructure.value.push({
            structure: str, 
            id:id
        })
        //console.log(processedStructure.value)
        // init settings
        settings.value.push({
            id:id,
            name: str.name,
            curr_model: 0,
            models: [],
            original: {
                structure: str, 
                id:id
            }
        })
        // init each model of each structure
        for(const model of str.models) {
            const chains = []
            for(const chs of model.chains) {
                chains.push({ name: 'Chain ' + chs.id, id: chs.id  })
            }
            settings.value.filter(item => item.id === id)[0].models.push({
                id: model.id,
                chains: chains,
                residues: [],
                ions: [],
                waters: []
            })
        }
        //console.log(settings.value)
    }

    return { 
        processedStructure, 
        projectData,
        initProject,
        updateStructure, 
        resetStructure
    }

}