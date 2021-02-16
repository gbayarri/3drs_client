import { reactive } from "vue";

let dialog = reactive({
  trajectory: false,
  structure: false
});

const openModal = function (label) {
    dialog[label] = true
}

const closeModal = function (label) {
    dialog[label] = false
}


export default { dialog, openModal, closeModal }