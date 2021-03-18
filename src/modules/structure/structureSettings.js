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
        //console.log(settings.value, currReprVal)
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
        const currMod =  getCurrentModel(currReprVal)
        if(currMod === null) return []
        const allChains = settings.value
                            .filter(item => item.id === currentStructure.value)[0].original.models
                            .filter(item => item.id === currMod)[0].chains

        const chains = []

        for(const chain of allChains) {
            chains.push({
                name: "Chain " + chain.id,
                id: chain.id
            })
        }

        /*const currStr = settings.value.filter(item => item.id === currentStructure.value)[0].original
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
        }*/

        
        return chains
    }

    const getChainContent = function (content, currReprVal) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const currMod =  getCurrentModel(currReprVal)
        if(currMod === null) return []
        const allChains = settings.value
                            .filter(item => item.id === currentStructure.value)[0].original.models
                            .filter(item => item.id === currMod)[0].chains

        const chains = []

        for(const chain of allChains) {
            if(chain[content].length > 0) {
                chains.push({
                    id: chain.id,
                    [content]: chain[content]
                })
            }
        }
        
        
        /*const currStr = settings.value.filter(item => item.id === currentStructure.value)[0].original
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
        }*/

        return chains
    }

    // NAVIGATION SETTINGS DATA

    const addNewRepresentationSettings = function(representation) {
        // add new representation -representation- to all file.navigation
        for(const structure of settings.value) {
            structure.navigation.push({
                id: representation.id,
                curr_model: 0,
                visible: true,
                models: representation.settings.filter(item => item.id === structure.id)[0].models,
            })
        }
       // console.log(settings.value/*, representation*/)
    }

    const removeRepresentationSettings = function(representation) {
        // remove representation -value- from all file.navigation
        for(const structure of settings.value) {
            structure.navigation = structure.navigation.filter(item => item.id !== representation)
        }
        console.log(settings.value/*, representation*/)
    }

    const setCurrentStructure = function (value) {
        currentStructure.value = value
        //console.log(currentStructure.value)
    }

    const updateCurrentModel = function (value, currReprVal) {
        settings.value
            .filter(item => item.id === currentStructure.value)[0].navigation
            .filter(item => item.id === currReprVal)[0].curr_model = value
        
        
        /*const nav = settings.value.filter(item => item.id === currentStructure.value)[0].navigation
        nav.filter(item => item.id === currReprVal)[0].curr_model = value*/
        //settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model = value

        //console.log(settings.value)
    }

    const updateCurrentChains = function (value, currReprVal) {
        const cm = getCurrentModel(currReprVal)
        const models = settings.value
                            .filter(item => item.id === currentStructure.value)[0].navigation
                            .filter(item => item.id === currReprVal)[0].models
        
        settings.value
            .filter(item => item.id === currentStructure.value)[0].navigation
            .filter(item => item.id === currReprVal)[0].models
            .filter(item => item.id === cm)[0].chains = value
        
        /*
        ????????????????????????
        Not sure why I did that
        settings.value
            .filter(item => item.id === currentStructure.value)[0].navigation
            .filter(item => item.id === currReprVal)[0].models = models*/


        //settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model = value
        /*const cm = getCurrentModel(currReprVal)
        //let models = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models
        const nav = settings.value.filter(item => item.id === currentStructure.value)[0].navigation
        let models = nav.filter(item => item.id === currReprVal)[0].models
        models.filter(item => item.id === cm)[0].chains = value
        //settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models = models
        // ????????????????????????
        // PROBABLY NOT WORKING
        nav.filter(item => item.id === currReprVal)[0].models = models*/
        //console.log(settings.value)
    }

    const checkIfMoleculeExists = function (molecule, type, currReprVal) {
        const molExists = settings.value
                            .filter(item => item.id === currentStructure.value)[0].navigation
                            .filter(item => item.id === currReprVal)[0].models
                            .filter(item => item.id === molecule.model)[0][type]
                            .filter(item => (item.num === molecule.num && item.chain === molecule.chain)).length > 0

        return molExists

        /*const molecules = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models[molecule.model][type]
        const molExists = molecules.filter(item => (item.num === molecule.num && item.chain === molecule.chain)).length > 0

        return molExists*/
    }

    const updateMolecules = function (molecule, type, currReprVal) {

        const molecules = settings.value
                            .filter(item => item.id === currentStructure.value)[0].navigation
                            .filter(item => item.id === currReprVal)[0].models
                            .filter(item => item.id === molecule.model)[0][type]

        let msg = null
        if(!checkIfMoleculeExists(molecule, type, currReprVal)) {
            // add
            molecules.push(molecule)
            msg = {
                status: 'info',
                tit: 'Added new molecule ',
                txt: 'added to '
            }
        } else {
            //remove
            settings.value
                .filter(item => item.id === currentStructure.value)[0].navigation
                .filter(item => item.id === currReprVal)[0].models
                .filter(item => item.id === molecule.model)[0][type] = molecules.filter(item => !(item.chain === molecule.chain && item.num === molecule.num))
            msg = {
                status: 'warn',
                tit: 'Molecule removed',
                txt: 'removed from '
            }
        }

        return [settings.value, msg]

    }

    const updateAllMolecules = function (type, currReprVal, operation, allMolecules = null) {

        const cm = getCurrentModel(currReprVal)
        if(cm === null) return []

        let molecules = null
        let msg = null
        if(operation == 'select') {
            molecules = allMolecules
            msg = {
                status: 'info',
                tit: 'Select all',
                txt: 'added to '
            }
        } else {
            molecules = []
            msg = {
                status: 'warn',
                tit: 'Unselect all',
                txt: 'removed from '
            }
        }

        settings.value
            .filter(item => item.id === currentStructure.value)[0].navigation
            .filter(item => item.id === currReprVal)[0].models
            .filter(item => item.id === cm)[0][type] = molecules

        return [settings.value, msg]

    }

    const getCurrentModel = function (currReprVal) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const repr = settings.value
                        .filter(item => item.id === currentStructure.value)[0].navigation
                        .filter(item => item.id === currReprVal)[0]

        if(repr !== undefined)
            return repr.curr_model
        else
            return null

        //const nav = settings.value.filter(item => item.id === currentStructure.value)[0].navigation
        /*if(nav.filter(item => item.id === currReprVal)[0] !== undefined)
            return nav.filter(item => item.id === currReprVal)[0].curr_model
        else
            return null*/

        //console.log(settings.value.filter(item => item.id === currentStructure.value))
        //console.log(nav, currReprVal)
        //console.log(nav.filter(item => item.id === currReprVal)[0])
        //return settings.value.filter(item => item.id === currentStructure.value)[0].navigation.curr_model
        //console.log(nav.filter(item => item.id === currReprVal)[0])
        
    }

    const getCurrentChains = function (currReprVal) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const cm = getCurrentModel(currReprVal)
        if(cm === null) return []
        
        return settings.value
            .filter(item => item.id === currentStructure.value)[0].navigation
            .filter(item => item.id === currReprVal)[0].models
            .filter(item => item.id === cm)[0].chains
        
        /*const nav = settings.value.filter(item => item.id === currentStructure.value)[0].navigation
        //const models = settings.value.filter(item => item.id === currentStructure.value)[0].navigation.models
        const models = nav.filter(item => item.id === currReprVal)[0].models
        //console.log(models.filter(item => item.id === cm)[0].chains)
        return models.filter(item => item.id === cm)[0].chains*/
    }

    const getCurrentMolecules = function (currReprVal, type) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const cm = getCurrentModel(currReprVal)
        if(cm === null) return []

        return settings.value
            .filter(item => item.id === currentStructure.value)[0].navigation
            .filter(item => item.id === currReprVal)[0].models
            .filter(item => item.id === cm)[0][type]
    }

    return { 
        settings,
        currentStructure,
        getFileNames,
        getNumStructures,
        getModels,
        getChains,
        getChainContent,
        getCurrentMolecules,    
        setCurrentStructure,
        updateCurrentModel,
        updateCurrentChains,
        checkIfMoleculeExists,
        updateMolecules,
        updateAllMolecules,
        getCurrentModel,
        getCurrentChains,
        addNewRepresentationSettings,
        removeRepresentationSettings
    }

}