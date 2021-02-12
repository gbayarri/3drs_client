import { reactive, readonly } from "vue";

let dialog = reactive({
  trajectory: false,
  structure: false
});

// TODO IN ONLY TWO FUNCTIONS AND TRY TO INTEGRATE BOTH MODALS IN ONE PASSING VARIABLES

const openTrajectory = function () {
    dialog.trajectory = true
}

const closeTrajectory = function () {
    dialog.trajectory = false
}

const openStructure = function () {
    dialog.structure = true
}

const closeStructure = function () {
    dialog.structure = false
}

export default { dialog, openTrajectory, closeTrajectory, openStructure, closeStructure };