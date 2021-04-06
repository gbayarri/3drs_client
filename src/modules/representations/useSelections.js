import { ref, reactive } from 'vue'

const multipleResidues = reactive({
  status: false,
  firstRes: null,
  lastRes: null,
  error: false
})

const selection = ref([])

export default function useSelections() {

  const addMultipleResidues = function (residue) {
    multipleResidues.status = !multipleResidues.status
    if(multipleResidues.status) {
        multipleResidues.lastRes = null
        multipleResidues.firstRes = residue,
        multipleResidues.error = false
    } else {
        multipleResidues.lastRes = residue
        if(multipleResidues.firstRes.model === multipleResidues.lastRes.model && multipleResidues.firstRes.chain === multipleResidues.lastRes.chain) {
          //console.log('multiple selection wit range: ', multipleResidues.firstRes, multipleResidues.lastRes)
          multipleResidues.error = false
        } else {
          console.error('You can\'t do a multiple selection with different model / chain')
          multipleResidues.status = false
          multipleResidues.firstRes = null
          multipleResidues.lastRes = null,
          multipleResidues.error = true
        }        
    }

    return multipleResidues
  }

  const generateNGLSelection = function (molecules) {

    if(!molecules.length) return  'not(*)'

    return molecules.map(e => e.num + ':' + e.chain + '/' + e.model).join(', ')

  }

  // updates selection object and returns selection string
  const getSelection = function (molecules, status, currReprVal, currStr) {
    // use only chain, num, model, name
    const m = molecules.map(({ chain, num, model, name }) => ({ chain, num, model, name }))
    // selection according to currReprVal and currStr
    const sel = selection.value
      .filter(item => item.id === currReprVal)[0].structures
      .filter(item => item.id === currStr)[0].selection

    let string_sel = null
    if (status === 'add') { 
      // add new molecules to selection
      sel.molecules.push(...m)
      // set array unique removing repeated items
      const unique = (arr, props = []) => [...new Map(arr.map(entry => [props.map(k => entry[k]).join('|'), entry])).values()]
      sel.molecules = unique(sel.molecules, ['num', 'chain', 'model'])
      // generate NGL string
      string_sel = generateNGLSelection(sel.molecules)
      sel.string = string_sel
      //console.log('Add', currReprVal, currStr, molecules)
    } else {
      // update selection removing molecules
      selection.value
      .filter(item => item.id === currReprVal)[0].structures
      .filter(item => item.id === currStr)[0].selection.molecules = sel.molecules.filter(item => !m.some(elem => (elem.num === item.num && elem.chain === item.chain && elem.model === item.model)))
      // get selection again
      const n_sel = selection.value
      .filter(item => item.id === currReprVal)[0].structures
      .filter(item => item.id === currStr)[0].selection
      // generate NGL string
      string_sel = generateNGLSelection(n_sel.molecules)
      n_sel.string = string_sel
      //console.log('Remove', currReprVal, currStr, molecules)
    }

    //console.log(selection.value)

    return [string_sel, selection.value.filter(item => item.id === currReprVal)[0].structures]

  }

  // updates selection object and returns selection string in case we are updating chains
  const getSelectionChains = function (chains, currReprVal, currStr) {

    //console.log(chains, currReprVal, currStr)
    //console.log(chains)

    /*console.log(selection.value
      .filter(item => item.id === currReprVal)[0].structures
      .filter(item => item.id === currStr)[0].selection.molecules.filter(item => chains.some(elem => (elem.id === item.chain))).length)*/

    // filter only molecules with selected chains
    // HOW TO CHECK IF ADD OR REMOVE?????????
    // THIS CODE IS FOR REMOVE CHAINS:
    const mols = selection.value
      .filter(item => item.id === currReprVal)[0].structures
      .filter(item => item.id === currStr)[0].selection.molecules.filter(item => chains.some(elem => (elem.id === item.chain)))

    //console.log(mols)

    const string_sel = generateNGLSelection(mols)

    selection.value
      .filter(item => item.id === currReprVal)[0].structures
      .filter(item => item.id === currStr)[0].selection.string = string_sel

    //console.log(selection.value)

    return [string_sel, selection.value.filter(item => item.id === currReprVal)[0].structures]

  }

  const getStructureSelection = function (currReprVal) {
    const strs = selection.value
                  .filter(item => item.id === currReprVal)[0].structures

    //const m = molecules.map(({ chain, num, model, name }) => ({ chain, num, model, name }))
                  
    return strs
  }

  // set selection with DB data
  const setSelection = function (representations, defaultRepresentation) {
    
    for(const r of representations) {
      if(r.id !== defaultRepresentation) {
        selection.value.push({
          id: r.id,
          structures: r.structures
        })
      }
    }

    //console.log(selection.value)

  }

  // update selection structure
  const updateSelection = function (representation, structures, type) {

    if(type === 'add') {

      let new_str = []
      structures.forEach((v) => { 
        new_str.push({
          id: v.id, 
          selection: {
            string: 'not(*)',
            molecules: []
          }
        })
      })

      selection.value.push({
        id: representation,
        structures: new_str
      })

    } else {

      selection.value = selection.value.filter(item => item.id !== representation)

    }

    //console.log(selection.value)

  }

  return { 
    selection, 
    multipleResidues,
    addMultipleResidues, 
    getSelection,
    getSelectionChains,
    setSelection,
    updateSelection,
    getStructureSelection
  }

}