import { reactive } from "vue";
import { Stage, Selection } from 'ngl'

let stage = reactive({});
let selection = reactive({});

const createStage = function (layer) {
    stage = new Stage(layer, { tooltip:true })
    //console.log('stage created')
    return stage 
}

const getStage = function () {
    //console.log('return stage')
    return stage
}

const createSelection = function (sel) {
    selection = new Selection(sel)
    //console.log('stage created')
    return selection 
}

//export default ngl

export default { createStage, getStage, createSelection }
