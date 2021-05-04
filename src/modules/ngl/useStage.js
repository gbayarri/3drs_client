import { reactive } from 'vue'
//import { Stage, Selection, DatasourceRegistry, MdsrvDatasource, /*setListingDatasource,*/ setTrajectoryDatasource, TrajectoryPlayer } from 'ngl'
import * as NGL from 'ngl'

let stage = reactive({})
let selection = reactive({})

export default function useStage() {

    const createStage = function (layer) {

        /*DatasourceRegistry.add("file", new MdsrvDatasource( window.location.origin + "/tool-mdsrv/" ))
        DatasourceRegistry.listing = DatasourceRegistry.get( "file" )
        DatasourceRegistry.trajectory = DatasourceRegistry.get( "file" )*/

        // Load MDSRV API as Datasource
        const mdsrvDatasource = new NGL.MdsrvDatasource( process.env.VUE_APP_MDSRV )
        NGL.DatasourceRegistry.add("file", mdsrvDatasource)
        //setListingDatasource(mdsrvDatasource)
        NGL.setTrajectoryDatasource(mdsrvDatasource)
        //console.log(DatasourceRegistry)
        /*NGL.setListingDatasource(mdsrvDatasource)
        NGL.setTrajectoryDatasource(mdsrvDatasource)*/

        stage = new NGL.Stage(layer, { tooltip:false })
        //console.log('stage created')
        return stage 
    }
    
    const getStage = function () {
        //console.log('return stage')
        return stage
    }
    
    const createSelection = function (sel) {
        selection = new NGL.Selection(sel)
        //console.log('stage created')
        return selection 
    }

    const createTrajectoryPlayer = function (traj, settings) {
        return new NGL.TrajectoryPlayer( traj, {
            step: settings.step,
            timeout: 100,
            // interpolateStep: 5, ??
            start: settings.range[0],
            end: settings.range[1],
            interpolateType: settings.interpolation,
            mode: settings.loop ? "loop": "once"
        } ) 
    }

    const createSuperposition = function (str1, str2, sele1, sele2) {
        const c1 = stage.getComponentsByName(str1).list[0]
        const c2 = stage.getComponentsByName(str2).list[0]

        const s1 = c1.structure
        const s2 = c2.structure

        NGL.superpose(s1, s2, true, sele1, sele2)
        c1.updateRepresentations({ position: true })
        c1.autoView()
    }
  
    return { stage, selection, createStage, getStage, createSelection, createTrajectoryPlayer, createSuperposition }
  
  }