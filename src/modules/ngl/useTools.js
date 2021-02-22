import { ref } from 'vue'

const initialOrientation = ref({})

export default function useTools() {

  const updateOrientation = function (orientation) {
    initialOrientation.value = orientation
  }

  return { initialOrientation, updateOrientation }

}