import { ref } from 'vue'
import structureNavigation from '@/modules/structure/structureNavigation'

const project = ref([])

// stores data to project value
// CHACK IF ALL THIS STRUCTURE FITS WITH MONGO STRUCTURE
export default function structureStorage() {

    const { navigation, currentStructure/*, getCurrentChains*/ } = structureNavigation()

    const resetStructure = function (str) {
        // reset project & navigation
        project.value = []
        navigation.value = []
    }

    const updateStructure = function (str, id) {
        // init project
        project.value.push({
            structure: str, 
            id:id
        })
        // init navigation
        navigation.value.push({
            id:id,
            curr_model: 0,
            models: []
        })
        // init each model of each structure
        for(const model of str.models) {
            const chains = []
            for(const chs of model.chains) {
                chains.push({ name: 'Chain ' + chs.id, id: chs.id  })
            }
            navigation.value.filter(item => item.id === id)[0].models.push({
                id: model.id,
                chains: chains,
                residues: [],
                ions: [],
                waters: []
            })
        }
        //console.log(navigation.value)
    }

    const getFileNames = function () {
        const names = []
        for(const item of project.value) {
            names.push({
                name: item.structure.name,
                id: item.id
            })
        }
        return names
    }

    const getNumStructures = function () {
        return project.value.length
    }

    const getModels = function () {
        const allModels = project.value.filter(item => item.id === currentStructure.value)[0].structure.models
        const models = []

        for(const model of allModels) {
            models.push(model.id)
        }
        return models
    }

    const getChains = function () {
        const currStr = project.value.filter(item => item.id === currentStructure.value)[0].structure
        const currMod = navigation.value.filter(item => item.id === currentStructure.value)[0].curr_model
        const allChains = currStr.models.filter(item => item.id === currMod)[0].chains
        const chains = []

        for(const chain of allChains) {
            chains.push({
                name: "Chain " + chain.id,
                id: chain.id
            })
        }
        return chains
    }

    const getChainContent = function (content) {
        const currStr = project.value.filter(item => item.id === currentStructure.value)[0].structure
        const currMod = navigation.value.filter(item => item.id === currentStructure.value)[0].curr_model
        const allChains = currStr.models.filter(item => item.id === currMod)[0].chains
        const chains = []

        for(const chain of allChains) {
            if(chain[content].length > 0) {
                chains.push({
                    id: chain.id,
                    [content]: chain[content]
                })
            }
        }
        return chains
    }

    return { 
        project, 
        updateStructure, 
        resetStructure,
        getFileNames,
        getNumStructures,
        getModels,
        getChains,
        getChainContent
    }

}