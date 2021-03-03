import { ref } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'

//const processedStructure = ref([])
const projectData = ref({})

// stores data to project value
// CHECK IF ALL THIS STRUCTURE FITS WITH MONGO STRUCTURE
export default function structureStorage() {

    const { settings } = structureSettings()

    const resetStructure = function (str) {
        // reset processedStructure & settings
        //console.log("resetting structure")
        //processedStructure.value = []
        //TO CHECK!!!!!
        settings.value = []
    }

    const updateProject = function (data) {
        projectData.value = data
    }

    const updateStructure = function (str, id) {
        // init processedStructure
        /*processedStructure.value.push({
            structure: str, 
            id:id
        })*/
        //console.log(processedStructure.value)
        // ***************************************************
        // THINK IF NAVIGATION MUST BE CHANGED BY SOMETHING MORE HIERARCHICAL LIKE ORIGINAL
        // ***************************************************
        // init settings
        settings.value.push({
            id: id,
            name: str.name,
            navigation: {
                curr_model: 0,
                visible: true,
                models: [],
            },
            original: str
        })
        // init each model of each structure
        for(const model of str.models) {
            const chains = []
            for(const chs of model.chains) {
                chains.push({ name: 'Chain ' + chs.id, id: chs.id  })
            }
            settings.value.filter(item => item.id === id)[0].navigation.models.push({
                id: model.id,
                chains: chains,
                residues: [],
                ions: [],
                waters: []
            })
        }
        //console.log(settings.value)
    }

    const getFirstProjectData = function (orientation) {

        const files = []
        const structure = []
        const setngs = []
        console.log(settings.value)
        for(const item of settings.value) {
            files.push({
                id: item.id,
                name: item.name,
                //type: item.original.type.isProtein ? 'protein' : 'nucleic',
                type: item.original.type,
                trajectory: null
            })
            setngs.push({
                id: item.id,
                curr_model: item.navigation.curr_model,
                visible: item.navigation.visible,
                models: item.navigation.models
            })
            structure.push({
                id: item.id,
                models: item.original.models
            })
        }

        const data = {
            orientation: orientation,
            files: files,
            structure: structure,
            settings: setngs
        }

        return data
    }

    return { 
        //processedStructure, 
        projectData,
        updateProject,
        updateStructure, 
        resetStructure,
        getFirstProjectData
    }

}