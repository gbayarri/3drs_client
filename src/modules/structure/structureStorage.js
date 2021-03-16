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

    const updateStructureFirst = function (str, id) {
        // init processedStructure
        /*processedStructure.value.push({
            structure: str, 
            id:id
        })*/
        //console.log(processedStructure.value)
        // init settings
        //projectData.value.defaultRepresentation
        const defR = projectData.value.defaultRepresentation
        settings.value.push({
            id: id,
            name: str.name,
            navigation: [
                /*curr_model: 0,
                visible: true,
                models: [],*/
                {
                    id: defR,
                    curr_model: 0,
                    visible: true,
                    models: [],
                }
            ],
            //representations: [],
            original: str
        })
        // init each model of each structure
        for(const model of str.models) {
            const chains = []
            for(const chs of model.chains) {
                chains.push({ name: 'Chain ' + chs.id, id: chs.id  })
            }
            settings.value.filter(item => item.id === id)[0].navigation[0].models.push({
                id: model.id,
                chains: chains,
                residues: [],
                heteroatoms: [],
                ions: [],
                waters: []
            })
        }
        //console.log(settings.value)
    }

    const updateStructure = function (str, id) {

        // ADD NEW LEVEL RESPRESENTATIONS IN settings.value.navigation

        // get list of representations except default
        const representations = projectData.value.representations.filter(item => item.id !== projectData.value.defaultRepresentation)
        const file_nav = []

        // do nothing if only default
        if(representations.length > 0) {
            
            for(const r of representations) {
                const s = r.settings.filter(item => item.id === id)[0]
                file_nav.push({
                    id: r.id,
                    curr_model: s.curr_model,
                    visible: s.visible,
                    models: s.models,
                })
                //console.log(s)
            }
        }

        //console.log(file_nav)

        //const settings_str = representations.filter(item => item.id === id)
        //console.log(representations)

        const setngs = projectData.value.settings
        //const settings_str = setngs.filter(item => item.id === id)[0]

        //console.log(setngs)

        // init settings
        settings.value.push({
            id: id,
            name: str.name,
            navigation: file_nav,
            original: str
        })

        // init settings
        /*settings.value.push({
            id: id,
            name: str.name,
            navigation: {
                curr_model: settings_str.curr_model,
                visible: settings_str.visible,
                models: settings_str.models,
            },
            original: str
        })
        // init each model of each structure
        for(const model of str.models) {
            const chains = []
            for(const chs of model.chains) {
                chains.push({ name: 'Chain ' + chs.id, id: chs.id  })
            }
            settings.value.filter(item => item.id === id)[0].navigation.models = settings_str.models
        }*/
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
                curr_model: item.navigation[0].curr_model,
                visible: item.navigation[0].visible,
                models: item.navigation[0].models
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

        console.log(data)

        return data
    }

    // TO ADD REPRESENTATIONS HERE???
    const setSettings = function () {

        const setngs = []
        for(const item of settings.value) {
            setngs.push({
                id: item.id,
                curr_model: item.navigation.curr_model,
                visible: item.navigation.visible,
                models: item.navigation.models
            })
        }

        const data = {
            settings: setngs
        }

        return data
    }

    return { 
        //processedStructure, 
        projectData,
        updateProject,
        updateStructureFirst, 
        updateStructure,
        resetStructure,
        getFirstProjectData,
        setSettings
    }

}