import { reactive } from 'vue'
import { Stage, Selection/*, DatasourceRegistry, MdsrvDatasource*/ } from 'ngl'

let stage = reactive({})
let selection = reactive({})

export default function useStage() {

    const createStage = function (layer) {

        /*DatasourceRegistry.add("file", new MdsrvDatasource( window.location.origin + "/tool-mdsrv/" ))
        DatasourceRegistry.listing = DatasourceRegistry.get( "file" )
        DatasourceRegistry.trajectory = DatasourceRegistry.get( "file" )*/

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
  
    return { stage, selection, createStage, getStage, createSelection }
  
  }