import { ref } from 'vue'
import structureNavigation from '@/modules/structure/structureNavigation'

const project = ref([])

export default function structureStorage() {

    const { navigation, currentStructure } = structureNavigation()

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
        for(const model of str.models){
            navigation.value.filter(item => item.id === id)[0].models.push({
                id: model.id,
                chains: [{ name: 'Chain A', id: 'A' }],
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

    const getResidues = function () {
        const currStr = project.value.filter(item => item.id === currentStructure.value)[0].structure
        const currMod = navigation.value.filter(item => item.id === currentStructure.value)[0].model.id
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

    return { 
        project, 
        updateStructure, 
        resetStructure,
        getFileNames,
        getNumStructures,
        getModels,
        getChains
    }

}