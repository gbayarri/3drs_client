import { ref, reactive } from 'vue'

const multipleResidues = reactive({
  status: false,
  firstRes: null,
  lastRes: null,
  error: false
})

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
    // TODO: RETURN VALUE IF SELECT / DESELECT

    return multipleResidues
  }

  // TODO: FUNCTION FOR CREATE A NGL SELECTION, AND RETURN IT
  const createSelection = function (settings) {
    
    // TO CREATE A NEW GLOBAL STRUCTURE (ARRAY OF OBJECTS / MOLECULES) WITH ALL THE MOLECULES 
    // WHEN SOME ACTION IS PERFORMED, THIS STRUCTURE IS UPDATED AND A NEW SELECTION FOR 
    // EACH OF THE STRUCTURES OF THE CURRENT REPRESENTATION IS CREATED

  }

  return { 
    multipleResidues,
    addMultipleResidues, 
    createSelection 
  }

}