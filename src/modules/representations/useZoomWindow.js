import { ref, reactive } from 'vue'

const windowType = ref('')
const allSelected = reactive({
  residues: false,
  waters: false
})

export default function useZoomWindow() {

  const setWindowType = function (type) {
    windowType.value = type
  }

  const toggleAllSelected = function (type) {
    allSelected[type] = !allSelected[type]
  }

  return { 
    windowType, 
    allSelected,
    setWindowType, 
    toggleAllSelected 
  }

}