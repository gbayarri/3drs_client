import { ref, reactive } from 'vue'

const multipleResidues = reactive({
  status: false,
  firstRes: null,
  lastRes: null
})

export default function useSelections() {

  const addMultipleResidues = function (residue) {
    multipleResidues.status = !multipleResidues.status
    if(multipleResidues.status) {
        multipleResidues.lastRes = null
        multipleResidues.firstRes = residue
    } else {
        multipleResidues.lastRes = residue
        if(multipleResidues.firstRes.model === multipleResidues.lastRes.model && multipleResidues.firstRes.chain === multipleResidues.lastRes.chain) {
          //console.log('multiple selection wit range: ', multipleResidues.firstRes, multipleResidues.lastRes)
        } else {
          console.warn('You can\'t do a multiple selection with different model / chain')
          multipleResidues.status = false
          multipleResidues.firstRes = null
          multipleResidues.lastRes = null
        }        
    }
    // TODO: RETURN VALUE IF SELECT / DESELECT

    return multipleResidues
  }

  // TODO: FUNCTION FOR CREATE A NGL SELECTION, AND RETURN IT
  const createSelection = function (settings) {
    
  }

  return { 
    multipleResidues,
    addMultipleResidues, 
    createSelection 
  }

}