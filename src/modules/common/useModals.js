import { reactive } from 'vue'

const dialog = reactive({
  trajectory: false,
  structure: false,
  share: false
})

export default function useModals() {

  const openModal = function (label) {
    dialog[label] = true
  }

  const closeModal = function (label) {
    dialog[label] = false
  }

  return { dialog, openModal, closeModal }

}