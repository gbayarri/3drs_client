import { reactive } from 'vue'
import { Stage, Selection/*, Representation*/ } from 'ngl'

let stage = reactive({})
let selection = reactive({})

export default function useStage() {

    //type, object, viewer, params)
    //const new_repr = new Representation()
    //console.log(new_repr)

    const createStage = function (layer) {
        stage = new Stage(layer, { tooltip:false })
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

    /*const createRepresentation = function (v, p) {
        console.log(new Representation())
        //var representation = new Representation(v, p)
        //return representation 
    }*/
  
    return { stage, selection, createStage, getStage, createSelection/*, createRepresentation*/ }
  
  }