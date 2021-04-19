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
        //console.log(settings.value/*, representation*/)
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

        const chains = settings.value
        .filter(item => item.id === currentStructure.value)[0].navigation
        .filter(item => item.id === currReprVal)[0].models
        .filter(item => item.id === cm)[0].chains

        let results, msg
        if(chains > value) {
            // remove
            results = chains.filter(({ id: id1 }) => !value.some(({ id: id2 }) => id2 === id1))
            //console.log('removing')
            msg = {
                status: 'warn',
                tit: results.length === 1 ? 'Chain removed' : 'Chains removed',
                txt1: results.length === 1 ? 'The chain ' : 'The chains ',
                txt2: results.length === 1 ? 'has been removed from ' : 'have been removed from ',
                chains: results.map(e => e.id).join(', '),
            }
        } else {
            // add
            results = value.filter(({ id: id1 }) => !chains.some(({ id: id2 }) => id2 === id1))
            //console.log('adding')
            msg = {
                status: 'info',
                tit: results.length === 1 ? 'Added new chain' : 'Added new chains',
                txt1: results.length === 1 ? 'The chain ' : 'The chains ',
                txt2: results.length === 1 ? 'has been added from ' : 'have been added to ',
                chains: results.map(e => e.id).join(', ')
            }
        }
        //console.log(msg)


        settings.value
            .filter(item => item.id === currentStructure.value)[0].navigation
            .filter(item => item.id === currReprVal)[0].models
            .filter(item => item.id === cm)[0].chains = value
        
        return msg

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

    const updateMolecule = function (molecule, type, currReprVal) {
        
        const molecules = settings.value
                            .filter(item => item.id === currentStructure.value)[0].navigation
                            .filter(item => item.id === currReprVal)[0].models
                            .filter(item => item.id === molecule.model)[0][type]

        let msg = null
        let status = null
        if(!checkIfMoleculeExists(molecule, type, currReprVal)) {
            // add
            molecules.push(molecule)
            msg = {
                status: 'info',
                tit: 'Added new molecule ',
                txt: 'added to '
            }
            status = 'add'
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
            status = 'remove'
        }

        return [[molecule], msg, status]

    }

    const checkIfSetOfMoleculeExists = function (setOfMolecules, type, currReprVal, model, search) {
        // get currently selected molecules
        const molecules = settings.value
                            .filter(item => item.id === currentStructure.value)[0].navigation
                            .filter(item => item.id === currReprVal)[0].models
                            .filter(item => item.id === model)[0][type]

        // reformat molecules only in case search by helix / sheet (less properties)
        const selected_molecules = []
        if(search === 'multiple') {
            for(const m of molecules) {
                selected_molecules.push(m)
            }
        } else {
            for(const m of molecules) {
                selected_molecules.push({
                    num: m.num,
                    label: m.label,
                    chain: m.chain,
                    model: m.model
                })
            }
        }

        //const { ['id', 'last_sheet', 'longname', 'helix', 'sheet']: remove, ...new_molecules } = molecules
        // this clean is not working????
        /*const clean = ['id', 'last_sheet', 'longname','helix', 'sheet']
        const new_molecules = Object.keys(molecules).reduce((object, key) => {
            console.log(key)
            if (clean.indexOf(key) === -1) {
              object[key] = molecules[key]
            }
            return object
          }, {})

        console.log(new_molecules)*/

        //console.log(new_molecules)

        // clean molecules and leave only label / num / chain / model
        /*new_molecules.forEach((v) => { 
            delete v.id 
            delete v.last_sheet
            delete v.longname
            delete v.helix
            delete v.sheet  
        })*/


        //console.log(settings.value)

        // check if all items of setOfMolecules are in selected_molecules
        let molExists = true
        for(const m of setOfMolecules) {
            if(!selected_molecules.some(elem => JSON.stringify(elem) == JSON.stringify(m))) {
                molExists = false
                break
            }
            /*new_molecules.some((elem) => {
                console.log(JSON.stringify(elem), JSON.stringify(m))
                return JSON.stringify(elem) == JSON.stringify(m)
            })*/
        }

        return molExists
    }

    const updateSetOfMolecules = function (type, currReprVal, setOfMolecules, chain, search) {

        const cm = getCurrentModel(currReprVal)
        if(cm === null) return []

        // get currently selected molecules
        const molecules = settings.value
                            .filter(item => item.id === currentStructure.value)[0].navigation
                            .filter(item => item.id === currReprVal)[0].models
                            .filter(item => item.id === cm)[0][type]
        
        // get all molecules of the current representation / model / chain
        const all_molecules = getChainContent(type, currReprVal)
                                .filter(item => item.id === chain)[0][type]
        // set setOfMolecules to the correct residue format
        let selected_molecules = []
        for(const m of all_molecules) {
            if(setOfMolecules.some(item => (item.num === m.num && item.chain === m.chain))) selected_molecules.push(m)
        }

        let msg = null
        let status = null
        // check if adding or removing
        if(!checkIfSetOfMoleculeExists(setOfMolecules, type, currReprVal, cm, search)) {
            // push new molecules
            molecules.push(...selected_molecules)
            // set array unique removing repeated items
            /*const array_output = Array.from(new Set(molecules.map(a => a.num)))
                                    .map((num) => {
                                        return molecules.find(a => a.num === num)
                                    })*/
            const unique = (arr, props = []) => [...new Map(arr.map(entry => [props.map(k => entry[k]).join('|'), entry])).values()]
            const array_output = unique(molecules, ['num', 'chain', 'model'])
            // update settings.value with new molecules
            settings.value
            .filter(item => item.id === currentStructure.value)[0].navigation
            .filter(item => item.id === currReprVal)[0].models
            .filter(item => item.id === cm)[0][type] = array_output

            msg = {
                status: 'info',
                tit: 'Added set of molecules',
                range: setOfMolecules[0].num + ' - ' + setOfMolecules[setOfMolecules.length - 1].num,
                txt: 'added to '
            }
            status = 'add'
        } else {
            // update settings.value removing selected molecules
            settings.value
                .filter(item => item.id === currentStructure.value)[0].navigation
                .filter(item => item.id === currReprVal)[0].models
                .filter(item => item.id === cm)[0][type] = molecules.filter(item => !selected_molecules.some(elem => (elem.num === item.num && elem.chain === item.chain && elem.model === item.model)))

            msg = {
                status: 'warn',
                tit: 'Removed set of molecules',
                range: setOfMolecules[0].num + ' - ' + setOfMolecules[setOfMolecules.length - 1].num,
                txt: 'removed from '
            }
            status = 'remove'
        }

        //return [settings.value, msg]
        return [status, msg]

    }

    const updateAllMolecules = function (type, currReprVal, operation, allMolecules = null) {

        const cm = getCurrentModel(currReprVal)
        if(cm === null) return []

        let molecules = null
        let msg = null
        if(operation === 'add') {
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

        return msg

    }

    const getSetOfMolecules = function (type, currReprVal, chain, first, last) {

        const all_molecules = getChainContent(type, currReprVal)
                                .filter(item => item.id === chain)[0][type]

        let range = []
        for(const m of all_molecules) {
            if(m.num >= first.num && m.num <= last.num && m.chain === first.chain) range.push(m)
        }

        return range

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

    const getMolecule = function (currReprVal, type, model, chain, resnum) {
        // avoid check settings before its creation
        if(settings.value.length === 0) return false
        const cm = getCurrentModel(currReprVal)
        if(cm === null) return []

        return settings.value
                .filter(item => item.id === currentStructure.value)[0].original.models
                .filter(item => item.id === cm)[0].chains
                .filter(item => item.id === chain)[0][type]
                .filter(item => item.model === model && item.chain === chain && item.num === resnum)[0]
    }

    const checkIfTrajectory = function() {
        return settings.value
            .filter(item => item.id === currentStructure.value)[0].trajectory !== null
    }

    const getTrajectorySettings = function() {
        return settings.value
            .filter(item => item.id === currentStructure.value)[0].trajectory.settings
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
        getMolecule,
        setCurrentStructure,
        updateCurrentModel,
        updateCurrentChains,
        checkIfMoleculeExists,
        updateMolecule,
        updateSetOfMolecules,
        updateAllMolecules,
        getSetOfMolecules,
        getCurrentModel,
        getCurrentChains,
        addNewRepresentationSettings,
        removeRepresentationSettings,
        checkIfTrajectory,
        getTrajectorySettings
    }

}