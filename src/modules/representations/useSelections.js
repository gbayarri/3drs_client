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
        console.log('multiple selection wit range: ', multipleResidues.firstRes, multipleResidues.lastRes)
    }
    // TODO: RETURN VALUE IF SELECT / DESELECT
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