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

    const createTrajectoryPlayer = function (traj, step, start, end) {
        
        return new TrajectoryPlayer( traj, {
            /*step: step,
            //timeout: 100,
            start: start,
            end: end,
            interpolateType: "linear",
            mode: "loop"*/
            // END NOT WORKING!!!!!!
            // LOOK PROMISES FOR LOADING THE PLAYER ONCE THE addTrajectory HAS FINISHED!!!!
            start:1, end: 140, /*timeout: 100,*/ mode: "loop", interpolateType: "spline",step: 1, interpolateStep: 5
        } ) 
    }
  
    return { stage, selection, createStage, getStage, createSelection, createTrajectoryPlayer }
  
  }