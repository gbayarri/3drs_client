import { ref } from 'vue'

const settings = ref([])
let currentStructure = ref(null)

// navigation for settings module
export default function structureSettings() {

    // GLOBAL SETTINGS DATA

    const getFileNames = function () {
        const names = []
        for(const item of settings.value) {
            names.push({
                name: item.name,
                id: item.id
            })
        }
        return names
    }

    const getNumStructures = function () {
        return settings.value.length
    }

    const getModels = function () {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const allModels = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models
        const models = []

        for(const model of allModels) {
            models.push(model.id)
        }
        return models
    }

    const getChains = function () {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const currStr = settings.value.filter(item => item.id === currentStructure.value)[0].original
        const currMod = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model
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
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const currStr = settings.value.filter(item => item.id === currentStructure.value)[0].original
        const currMod = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model
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

    // NAVIGATION SETTINGS DATA

    const setCurrentStructure = function (value) {
        currentStructure.value = value
        //console.log(currentStructure.value)
    }

    const updateCurrentModel = function (value) {
        settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model = value
    }

    const updateCurrentChains = function (value) {
        //settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model = value
        const cm = getCurrentModel()
        let models = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models
        models.filter(item => item.id === cm)[0].chains = value
        settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models = models
        //console.log(settings.value)
    }

    const updateResidues = function (value) {
        // TODO
    }

    const getCurrentModel = function () {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        //console.log(settings.value.filter(item => item.id === currentStructure.value))
        //console.log(settings)
        return settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model
    }

    const getCurrentChains = function () {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const cm = getCurrentModel()
        //console.log(cm)
        const models = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models
        //console.log(models.filter(item => item.id === cm)[0].chains)
        return models.filter(item => item.id === cm)[0].chains
    }

    return { 
        settings,
        currentStructure,
        getFileNames,
        getNumStructures,
        getModels,
        getChains,
        getChainContent,    
        setCurrentStructure,
        updateCurrentModel,
        updateCurrentChains,
        getCurrentModel,
        getCurrentChains
    }

}