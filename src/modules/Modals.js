import { reactive } from "vue";

let dialog = reactive({
  trajectory: false,
  structure: false,
  share: false
});

const openModal = function (label) {
    dialog[label] = true
}

const closeModal = function (label) {
    dialog[label] = false
}


export default { dialog, openModal, closeModal }