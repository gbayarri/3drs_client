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

    const getModels = function (currReprVal) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const nav = settings.value.filter(item => item.id === currentStructure.value)[0].navigation
        //const allModels = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models
        console.log(settings.value, currReprVal)
        if(nav.filter(item => item.id === currReprVal)[0] === undefined) return []

        const allModels = nav.filter(item => item.id === currReprVal)[0].models
        const models = []

        for(const model of allModels) {
            models.push(model.id)
        }
        return models
    }

    const getChains = function (currReprVal) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const currStr = settings.value.filter(item => item.id === currentStructure.value)[0].original
        //const currMod = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model
        //const currMod = nav.filter(item => item.id === currReprVal)[0].curr_model
        const currMod =  getCurrentModel(currReprVal)
        if(currMod === null) return []
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

    const getChainContent = function (content, currReprVal) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const currStr = settings.value.filter(item => item.id === currentStructure.value)[0].original
        //const currMod = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model
        const currMod =  getCurrentModel(currReprVal)
        if(currMod === null) return []
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

    // **************
    // TODO
    // **************

    const addNewRepresentationSettings = function(value) {
        // add new representation -value- to all file.navigation
    }

    const removeRepresentationSettings = function(value) {
        // remove representation -value- from all file.navigation
    }

    // **************

    const setCurrentStructure = function (value) {
        currentStructure.value = value
        //console.log(currentStructure.value)
    }

    const updateCurrentModel = function (value, currReprVal) {
        const nav = settings.value.filter(item => item.id === currentStructure.value)[0].navigation
        nav.filter(item => item.id === currReprVal)[0].curr_model = value
        //settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model = value

        //console.log(settings.value)
    }

    const updateCurrentChains = function (value, currReprVal) {
        //settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model = value
        const cm = getCurrentModel(currReprVal)
        //let models = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models
        const nav = settings.value.filter(item => item.id === currentStructure.value)[0].navigation
        let models = nav.filter(item => item.id === currReprVal)[0].models
        models.filter(item => item.id === cm)[0].chains = value
        //settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models = models
        // ????????????????????????
        // PROBABLY NOT WORKING
        nav.filter(item => item.id === currReprVal)[0].models = models
        console.log(settings.value)
    }

    // TODO currReprVal
    const checkIfMoleculeExists = function (molecule, type, currReprVal) {
        const molecules = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models[molecule.model][type]
        const molExists = molecules.filter(item => (item.num === molecule.num && item.chain === molecule.chain)).length > 0

        return molExists
    }

    // TODO currReprVal
    const updateMolecules = function (molecule, type, currReprVal) {
        const molecules = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models[molecule.model][type]
        if(!checkIfMoleculeExists(molecule, type)) {
            // add
            molecules.push(molecule)
        } else {
            //remove
            settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models[molecule.model][type] = molecules.filter(item => !(item.chain === molecule.chain && item.num === molecule.num))
        }

        console.log(settings.value)
        
        return settings.value
    }

    const getCurrentModel = function (currReprVal) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        //console.log(settings.value.filter(item => item.id === currentStructure.value))
        const nav = settings.value.filter(item => item.id === currentStructure.value)[0].navigation
        //console.log(nav, currReprVal)
        //console.log(nav.filter(item => item.id === currReprVal)[0])
        //return settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model
        //console.log(nav.filter(item => item.id === currReprVal)[0])
        if(nav.filter(item => item.id === currReprVal)[0] !== undefined)
            return nav.filter(item => item.id === currReprVal)[0].curr_model
        else
            return null
    }

    const getCurrentChains = function (currReprVal) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const cm = getCurrentModel(currReprVal)
        if(cm === null) return []
        const nav = settings.value.filter(item => item.id === currentStructure.value)[0].navigation
        //const models = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models
        const models = nav.filter(item => item.id === currReprVal)[0].models
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
        checkIfMoleculeExists,
        updateMolecules,
        getCurrentModel,
        getCurrentChains,
        addNewRepresentationSettings,
        removeRepresentationSettings
    }

}