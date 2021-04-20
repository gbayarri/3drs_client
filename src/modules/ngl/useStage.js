import { reactive } from 'vue'
import { Stage, Selection, DatasourceRegistry, MdsrvDatasource, setListingDatasource, setTrajectoryDatasource, TrajectoryPlayer } from 'ngl'

let stage = reactive({})
let selection = reactive({})

export default function useStage() {

    const createStage = function (layer) {

        /*DatasourceRegistry.add("file", new MdsrvDatasource( window.location.origin + "/tool-mdsrv/" ))
        DatasourceRegistry.listing = DatasourceRegistry.get( "file" )
        DatasourceRegistry.trajectory = DatasourceRegistry.get( "file" )*/

        // Load MDSRV API as Datasource
        const mdsrvDatasource = new MdsrvDatasource( process.env.VUE_APP_MDSRV )
        DatasourceRegistry.add("file", mdsrvDatasource)
        //setListingDatasource(mdsrvDatasource)
        setTrajectoryDatasource(mdsrvDatasource)
        //console.log(DatasourceRegistry)
        /*NGL.setListingDatasource(mdsrvDatasource)
        NGL.setTrajectoryDatasource(mdsrvDatasource)*/

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

    const createTrajectoryPlayer = function (traj, settings) {
        
        return new TrajectoryPlayer( traj, {
            step: settings.step,
            timeout: 100,
            // interpolateStep: 5, ??
            start: settings.range[0],
            end: settings.range[1],
            interpolateType: settings.interpolation,
            mode: settings.loop ? "loop": "once"
        } ) 
    }
  
    return { stage, selection, createStage, getStage, createSelection, createTrajectoryPlayer }
  
  }