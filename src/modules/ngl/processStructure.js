import useStage from '@/modules/ngl/useStage'
import globals from '@/globals'

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
        return { isNucleic, isProtein }
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
          chains.push(rp.chainname)
        })
        chains = Array.from(new Set(chains))
        return chains
    }

    const getHelixes = (component, model, chain) => {

        const selection_helixes = createSelection('/' + model + ' and :' + chain + ' and not ( water or ion or hetero )')
        const structureView = component.structure.getView(selection_helixes)

        let helixes = []
        let prev = null
        let arraux = []
        structureView.eachResidue(function (rp) {
          if(rp.isHelix()) {
            arraux.push({
                'label': rp.resname.toUpperCase(),
                'num': rp.resno,
                'chain': rp.chainname
            })
          }
          if(!rp.isHelix() && prev) {
            helixes.push(arraux)
            arraux = []
          }
          prev = rp.isHelix()
        })
        return helixes
    }

    const getSheets = (component, model, chain) => {

        const selection_sheets = createSelection('/' + model + ' and :' + chain + ' and not ( water or ion or hetero )')
        const structureView = component.structure.getView(selection_sheets)

        let sheets = []
        let prev = null
        let arraux = []
        structureView.eachResidue(function (rp) {
          if(rp.isSheet()) {
            arraux.push({
                'label': rp.resname.toUpperCase(),
                'num': rp.resno,
                'chain': rp.chainname
            })
          }
          if(!rp.isSheet() && prev) {
            sheets.push(arraux)
            arraux = []
          }
          prev = rp.isSheet()
        })
        //console.log(sheets)
        return sheets
    }

    const getResidues = (component, model, chain) => {

        const selection_residues = createSelection('/' + model + ' and :' + chain + ' and not ( water or ion or hetero )')
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
            let res = {
                id: globals.aminoacids[rp.resname.toLowerCase()].id,
                num: rp.resno,
                label: rp.resname.toUpperCase(),
                chain: rp.chainname,
                last_sheet: false,
                sheet: sheet,
                helix: helix,
                fsheet: Math.random(),
                lsheet: Math.random(),
                longname: globals.aminoacids[rp.resname.toLowerCase()].name
            }
            sequence.push(res)
            prev_res = rp.resno
        })
        //console.log(sequence)
        return sequence
    }

    const getHeteroatoms = (component, model, chain) => {

        const selection_heteroatoms = createSelection('/' + model + ' and :' + chain + ' and hetero and not (water or ion)')
        const structureView = component.structure.getView(selection_heteroatoms)

        let heteros = []
        structureView.eachResidue(function (rp) {
            let res = {
                'num': rp.resno,
                'name': rp.resname.toUpperCase(),
                'chain': rp.chainname,
                'description': rp.entity.description
            }
            heteros.push(res)
        })
        return heteros
    }

    const getIons = (component, model, chain) => {

        const selection_ions = createSelection('/' + model + ' and :' + chain + ' and ion')
        const structureView = component.structure.getView(selection_ions)

        let ions = []
        structureView.eachResidue(function (rp) {
            let res = {
                'num': rp.resno,
                'name': rp.resname.toUpperCase(),
                'chain': rp.chainname
            }
            ions.push(res)
        })
        return ions
    }

    const getWaters = (component, model, chain) => {

        const selection_waters = createSelection('/' + model + ' and :' + chain + ' and water')
        const structureView = component.structure.getView(selection_waters)

        const wat_numbers = []
        structureView.eachResidue(function (rp) {
            wat_numbers.push(rp.resno)
        })

        let waters = []
        let prev_wat = wat_numbers[0]
        structureView.eachResidue(function (rp) {
            // check sequence "holes"
            if(rp.resno > (prev_wat + 1)) {
                for (var i = (prev_wat + 1); i < rp.resno; i ++) {
                    waters.push({ 'name': null, 'num': i })
                }
            }
            // push water
            let res = {
                'num': rp.resno,
                'name': rp.resname.toUpperCase(),
                'chain': rp.chainname
            }
            waters.push(res)
            prev_wat = rp.resno
        })
        return waters
    }

    const getStructure = (component, name) => {

        const structure = { 
            'name': name,
            'type': getType(component),
            'models': [] 
        }

        for(const model of getModels(component)) {
            structure.models.push({
                id: model,
                chains: []
            })
            for(const chain of getChains(component, model)) {
                structure.models[model].chains.push({
                    id: chain,
                    helixes: getHelixes(component, model, chain),
                    sheets:  getSheets(component, model, chain),
                    residues: getResidues(component, model, chain),
                    heteroatoms: getHeteroatoms(component, model, chain),
                    ions: getIons(component, model, chain),
                    waters: getWaters(component, model, chain)
                })
            }
        }

        return structure

    }

    return { 
        getType, 
        getStructure
    }

}