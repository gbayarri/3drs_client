import { ref } from 'vue'
import structureNavigation from '@/modules/structure/structureNavigation'

const project = ref([])

export default function structureStorage() {

    const { navigation, currentStructure } = structureNavigation()

    const resetStructure = function (str) {
        project.value = []
    }

    const updateStructure = function (str, id) {
        project.value.push({
            structure: str, 
            id:id
        })
        navigation.value.push({
            id:id,
            model: { name: 'Model 1', id: 0 },
            chain: [{ name: 'Chain A', id: 'A' }],
            residues: [],
            ions: [],
            water: []
        })
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
            models.push({
                name: "Model " + (parseInt(model.id) + 1),
                id: model.id
            })
        }
        return models
    }

    const getChains = function () {
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