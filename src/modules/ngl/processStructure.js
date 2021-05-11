import useStage from '@/modules/ngl/useStage'
import globals from '@/globals'

// get object structure from NGL
export default function processStructure() {

    const { createSelection } = useStage()

    const getType = (component) => {

        const selection_type = createSelection('not ( water or ion or hetero )')
        const structureView = component.structure.getView(selection_type)

        let isNucleic = false
        let isProtein = false
        structureView.eachResidue(function (rp) {
            if(rp.isNucleic()) isNucleic = true
            if(rp.isProtein()) isProtein = true
        })
        //return { isNucleic, isProtein }
        return isProtein ? 'protein' : 'nucleic'
    }

    const getModels = (component) => {

        const selection_models = createSelection('*') 
        const structureView = component.structure.getView(selection_models)

        let models = []
        structureView.eachModel(function (rp) {
            models.push(rp.index)
        })
        return models
    }

    const getChains = (component, model) => {

        const selection_chains = createSelection('/' + model) // change by model
        const structureView = component.structure.getView(selection_chains)

        let chains = []
        structureView.eachChain(function (rp) {
            //if(rp.chainname !== '') {
                chains.push(rp.chainname)
            //} else {
                // ****************************************
                // ****************************************
                // ****************************************
                // FIX AND ONLY DO THAT WHEN MIX OF CHAINS AND NOT CHAINS
                // IF ALL STRUCTURE WITH NO CHAINS, PUT 'A'
                // TRY WITH ligSAS.dry.pdb
                // ****************************************
                // ****************************************
                // ****************************************
                //chains.push('@')
            //}
        })

        // array chains unique
        chains = Array.from(new Set(chains))
        
        // trick for fix empty chains
        // if only one empty chain, convert to 'A'
        if(chains.length === 1 && chains[0] === "") chains[0] = 'A'
        // if part of structure is empty, convert to '@'
        const emptyChain = chains.indexOf("")
        if(emptyChain !== -1) chains[emptyChain] = '@'

        return chains
    }

    const getHelixes = (component, model, chain, chain_sele) => {

        let selection_helixes
        /*if(chain)
            selection_helixes = createSelection('/' + model + ' and :' + chain + ' and not ( water or ion or hetero )')
        else
            selection_helixes = createSelection('/' + model + ' and not ( water or ion or hetero )')*/
    
        selection_helixes = createSelection('/' + model + ' and ' + chain_sele + ' and not ( water or ion or hetero )')

        const structureView = component.structure.getView(selection_helixes)

        let helixes = []
        let prev = null
        let arraux = []
        structureView.eachResidue(function (rp) {
            //if(rp.resname.toUpperCase() !== 'SOL') {
                if(rp.isHelix()) {
                    arraux.push({
                        num: rp.resno,
                        label: rp.resname.toUpperCase(),
                        chain: (chain) ? rp.chainname : '@',
                        model: rp.modelIndex
                    })
                }
                if(!rp.isHelix() && prev) {
                    helixes.push(arraux)
                    arraux = []
                }
                prev = rp.isHelix()
            //} else console.log(rp.resname)
        })
        return helixes
    }

    const getSheets = (component, model, chain, chain_sele) => {

        let selection_sheets
        /*if(chain)
            selection_sheets = createSelection('/' + model + ' and :' + chain + ' and not ( water or ion or hetero )')
        else
            selection_sheets = createSelection('/' + model + ' and not ( water or ion or hetero )')*/
        
        selection_sheets = createSelection('/' + model + ' and ' + chain_sele + ' and not ( water or ion or hetero )')
        
        const structureView = component.structure.getView(selection_sheets)

        let sheets = []
        let prev = null
        let arraux = []
        structureView.eachResidue(function (rp) {
            //if(rp.resname.toUpperCase() !== 'SOL') {
                if(rp.isSheet()) {
                    arraux.push({
                        num: rp.resno,
                        label: rp.resname.toUpperCase(),
                        chain: (chain) ? rp.chainname : '@',
                        model: rp.modelIndex
                    })
                }
                if(!rp.isSheet() && prev) {
                    sheets.push(arraux)
                    arraux = []
                }
                prev = rp.isSheet()
            //} else console.log(rp.resname)
        })
        //console.log(sheets)
        return sheets
    }

    const getResidues = (component, model, chain, chain_sele) => {

        let selection_residues
        /*if(chain)
            selection_residues = createSelection('/' + model + ' and :' + chain + ' and not ( water or ion or hetero )')
        else
            selection_residues = createSelection('/' + model + ' and not ( water or ion or hetero )')*/

        selection_residues = createSelection('/' + model + ' and ' + chain_sele + ' and not ( water or ion or hetero )')

        const structureView = component.structure.getView(selection_residues)

        const res_numbers = []
        structureView.eachResidue(function (rp) {
            res_numbers.push(rp.resno)
        })

        let sequence = []
        //let prev_res = structureView.structure.residueStore.resno[0]
        let prev_res = res_numbers[0]
        let prev_hx = null
        let curr_helix = 0
        let helix = null
        let prev_sh = null
        let curr_sheet = 0
        let sheet = null
        structureView.eachResidue(function (rp) {
            //if(rp.resname.toUpperCase() !== 'SOL') {
                // check sequence "holes"
                if(rp.resno > (prev_res + 1)) {
                    for (var i = (prev_res + 1); i < rp.resno; i ++) {
                        sequence.push({ 'id': null, 'num': i, sheet: null, helix: null })
                    }
                }
                // helixes
                if(rp.isHelix()) helix = curr_helix
                if(!rp.isHelix() && prev_hx) {
                    helix = null
                    curr_helix ++
                }
                prev_hx = rp.isHelix()
                // sheets
                if(rp.isSheet()) sheet = curr_sheet
                if(!rp.isSheet() && prev_sh) {
                    // update last to "arrow" sheet
                    sequence.filter(item => item.num === prev_res)[0].last_sheet = true
                    sheet = null
                    curr_sheet ++
                }
                prev_sh = rp.isSheet()
                // push residue
                //console.log(rp.resname.toLowerCase())
                let res_id = null
                let res_longname = null
                if(globals.aminoacids[rp.resname.toLowerCase()] === undefined) {
                    // *********** ????
                    // *********** ????
                    res_id = 'X'
                    // *********** ????
                    // *********** ????
                    res_longname = 'modified residue'
                } else {
                    res_id = globals.aminoacids[rp.resname.toLowerCase()].id
                    res_longname = globals.aminoacids[rp.resname.toLowerCase()].name
                }
                let res = {
                    id: res_id,
                    num: rp.resno,
                    label: rp.resname.toUpperCase(),
                    name: (chain) ? rp.chainname + ': ' + rp.resname.toUpperCase() + ' ' + rp.resno : rp.resname.toUpperCase() + ' ' + rp.resno,
                    chain: (chain) ? rp.chainname : '@',
                    model: rp.modelIndex,
                    last_sheet: false,
                    sheet: sheet,
                    helix: helix,
                    longname: res_longname
                }
                sequence.push(res)
                prev_res = rp.resno
            //} else console.log(rp.resname)
        })
        //console.log(sequence)
        return sequence
    }

    const getHeteroatoms = (component, model, chain, chain_sele) => {

        let selection_heteroatoms
        /*if(chain)
            selection_heteroatoms = createSelection('/' + model + ' and :' + chain + ' and hetero and not (water or ion)')
        else
        selection_heteroatoms = createSelection('/' + model + ' and hetero and not (water or ion)')*/

        selection_heteroatoms = createSelection('/' + model + ' and ' + chain_sele + ' and hetero and not (water or ion)')

        const structureView = component.structure.getView(selection_heteroatoms)

        let heteros = []
        structureView.eachResidue(function (rp) {
            //if(rp.resname.toUpperCase() !== 'SOL') {
                const desc = (rp.entity !== undefined) ? rp.entity.description : null
                let res = {
                    num: rp.resno,
                    name: rp.resname.toUpperCase(),
                    chain: (chain) ? rp.chainname : '@',
                    model: rp.modelIndex,
                    description: desc
                }
                heteros.push(res)
            //} else console.log(rp.resname)
        })
        return heteros
    }

    const getIons = (component, model, chain, chain_sele) => {

        let selection_ions
        /*if(chain)
            selection_ions = createSelection('/' + model + ' and :' + chain + ' and ion')
        else
            selection_ions = createSelection('/' + model + ' and ion')*/

        selection_ions = createSelection('/' + model + ' and ' + chain_sele + ' and ion')
        //console.log(selection_ions)

        const structureView = component.structure.getView(selection_ions)

        let ions = []
        structureView.eachResidue(function (rp) {
            //if(rp.resname.toUpperCase() !== 'SOL') {
                let res = {
                    num: rp.resno,
                    name: rp.resname.toUpperCase(),
                    chain: (chain) ? rp.chainname : '@',
                    model: rp.modelIndex
                }
                ions.push(res)
            //} else console.log(rp.resname)
        })
        return ions
    }

    const getWaters = (component, model, chain, chain_sele) => {

        let selection_waters
        /*if(chain)
            selection_waters = createSelection('/' + model + ' and :' + chain + ' and (water)')
        else 
            selection_waters = createSelection('/' + model + ' and (water)')*/
        
        selection_waters = createSelection('/' + model + ' and ' + chain_sele + ' and water')
        //console.log(selection_waters)

        const structureView = component.structure.getView(selection_waters)

        const wat_numbers = []
        structureView.eachResidue(function (rp) {
            wat_numbers.push(rp.resno)
        })

        let waters = []
        let prev_wat = wat_numbers[0]
        structureView.eachResidue(function (rp) {
            //if(rp.resname.toUpperCase() !== 'SOL') {
                // check sequence "holes"
                if(rp.resno > (prev_wat + 1)) {
                    for (var i = (prev_wat + 1); i < rp.resno; i ++) {
                        waters.push({ 'name': null, 'num': i })
                    }
                }
                // push water
                let res = {
                    num: rp.resno,
                    //name: rp.resname.toUpperCase(),
                    name: (chain) ? rp.chainname + ': ' + rp.resname.toUpperCase() + ' ' + rp.resno : rp.resname.toUpperCase() + ' ' + rp.resno,
                    chain: (chain) ? rp.chainname : '@',
                    model: rp.modelIndex
                }
                waters.push(res)
                prev_wat = rp.resno
            //} else console.log(rp.resname)
        })
        return waters
    }

    const getOtherChains = (chains, impostor) => {
        let sele = `not (`
        for(const chain of chains) { 
            if(chain !== impostor) sele += `:${chain} or `
        }
        sele = sele.slice(0, -4)
        sele += `)`

        return sele
    }

    const getStructure = (component, name, extension) => {

        const structure = { 
            name: name,
            ext: extension,
            type: getType(component),
            models: [] 
        }

        for(const model of getModels(component)) {
            structure.models.push({
                id: model,
                chains: []
            })
            const arrayChains = getChains(component, model)
            for(const chain of arrayChains) {
                let ch = null
                let ch_sele = null
                if(chain === '@') {
                    ch = ''
                    ch_sele = getOtherChains(arrayChains, '@')
                } else {
                    ch = chain
                    ch_sele = `:${chain}`
                }
                structure.models[model].chains.push({
                    id: chain,
                    helixes: getHelixes(component, model, ch, ch_sele),
                    sheets:  getSheets(component, model, ch, ch_sele),
                    residues: getResidues(component, model, ch, ch_sele),
                    heteroatoms: getHeteroatoms(component, model, ch, ch_sele),
                    ions: getIons(component, model, ch, ch_sele),
                    waters: getWaters(component, model, ch, ch_sele)
                })
                // ****************************************
                // ****************************************
                // ****************************************
                // if chain === '@', get not (all others) and pass it to 
                //console.log(getWaters(component, model, ch, ch_sele))
                // ****************************************
                // ****************************************
                // ****************************************

            }
        }

        //return []
        // *******************
        // *******************
        return structure
        // *******************
        // *******************

    }

    return { 
        getType, 
        getStructure
    }

}