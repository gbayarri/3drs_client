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

        // measurements
        /*NGL.setMeasurementDefaultParams({ 
            color: '#ff0000',
            labelColor: 0xFF0000, 
            labelSize: 6,
            arcVisible: true,
            labelBorder: true, 
            labelBorderColor: 0xf00, 
            labelAttachment: 'bottom-center', 
            labelSize: 0.7, 
            labelZOffset: 0.5, 
            labelYOffset: 0.1, 
            labelBorder: true, 
            labelBorderColor: 0xd3d3d3, 
            labelBorderWidth: 0.25, 
            lineOpacity: 0.8, 
            linewidth: 5.0, 
            opacity: 0.6, 
           
            labelUnit: 'angstrom', 
            arcVisible: true, 
            planeVisible: false 
          })*/

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

    const calculateDistance = function (atom1, atom2) {
        const outer = new NGL.Vector3(atom1.x, atom1.y, atom1.z)
        const inner = new NGL.Vector3(atom2.x, atom2.y, atom2.z)
        return outer.distanceTo(inner)
    }
  
    return { stage, selection, createStage, getStage, createSelection, createTrajectoryPlayer, createSuperposition, calculateDistance }
  
  }