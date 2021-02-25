import { ref } from 'vue'

const windowType = ref('')

export default function useZoomWindow() {

  const setWindowType = function (type) {
    windowType.value = type
  }

  return { windowType, setWindowType }

}