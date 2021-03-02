<template>
  <div id="stage">
      <div id="viewport">
          <!--<ProgressSpinner v-if="!stageLoaded" strokeWidth="6" animationDuration=".8s"/>-->
      </div>
  </div>
</template>

<script>
import { inject, computed, onMounted } from 'vue'
import useFlags from '@/modules/common/useFlags'
import useStage from '@/modules/ngl/useStage'
import useTools from '@/modules/ngl/useTools'
import useModals from '@/modules/common/useModals'
import useMessages from '@/modules/common/useMessages'
import useAPI from '@/modules/api/useAPI'
import loadStructure from '@/modules/ngl/loadStructure'
import structureStorage from '@/modules/structure/structureStorage'
import structureSettings from '@/modules/structure/structureSettings'
export default {
  props: ['project_id'],
  setup(props) {

    const $router = inject('$router')
    const { flags, setFlagStatus } = useFlags()
    const { setMessage } = useMessages()
    const stageLoaded = computed(() => flags.stageLoaded)
    const { updateOrientation } = useTools()
    const { dialog, openModal, closeModal, setBlockUI } = useModals()
    const { apiData, fetchProject } = useAPI()
    const { loadFileToStage, checkSignals } = loadStructure()
    const { processedStructure, projectData, initProject, resetStructure } = structureStorage()
    const { setCurrentStructure } = structureSettings()
    const project_id = props.project_id

    const createViewport = () => {
      const { createStage } = useStage()
      const stage = createStage("viewport")
      const dataProject = computed(() => projectData.value)

      resetStructure()
      setFlagStatus('stageLoaded', false)

      // 2vgb: pyruvate
      // 1mbs: web3DMol
      // 2rgp: water, ions, hetero, helixes and sheets
      // 2kod: multimodel + multichain
      // 1pik: multimodel + multichain DNA (no structure)
      // 4gxy: RNA

      //const structures = [{ name:"1pik", id: "1" }, { name:"2kod", id: "3" }, { name:"2rgp", id: "4" }/*{ name:"6ACC", id: "4" }, { name:"2rgp", id: "1" }, /*{ name:"1mbs", id: "2" }, { name:"1pik", id: "3" }, { name:"2kod", id: "4" }, { name:"2vgb", id: "5" },*/  ]
      const structures = dataProject.value.files
      const array_promises = []
      for(const str of structures) {
        array_promises
          .push(
            //loadFileToStage(stage, "https://files.rcsb.org/download/" + str.name + ".pdb", str.name, str.id)
            loadFileToStage(stage, process.env.VUE_APP_API_LOCATION + '/download/' + str.id, str.name, str.id)
          )
      }

      Promise.all(array_promises)
      .then(function (ol) {
          /*ol[ 0 ].superpose(ol[ 1 ], false)
          ol[ 0 ].autoView(":A")*/

          //console.log(ol)

          // TODO: ONCE ALL STRUCTURES LOADED, IN CASE IS FIRST TIME (dataProject.value.structure empty) SEND 
          // ALL STRUCTURE DATA TO API AS WELL AS files.type AND ORIENTATION
          if(dataProject.value.structure.length === 0) {
            // ADD processedStructure.value TO project.structure
            // TYPE IS INSIDE
            console.log(processedStructure.value)
            // https://nglviewer.org/ngl/api/manual/usage/interaction-controls.html
            const pos = stage.viewerControls.getOrientation()//.toArray()
            // TO CHECK loadStructure.js
            console.log(pos.elements)
          }

          // set all components to visible
          for(const c of stage.compList){
            c.setVisibility(true)
          }

          stage.autoView()
          //store.dispatch('initOrientation', stage.viewerControls.getOrientation())
          updateOrientation(stage.viewerControls.getOrientation())

          setFlagStatus('stageLoaded', true)

          checkSignals(stage)

          // set current structure          
          setCurrentStructure(dataProject.value.currentStructure)
          //setCurrentStructure('4')

          // CLOSE LOAD MODAL
          closeModal('block')



          //console.log(structure)

          //stage.getRepresentationsByName('ligand_1').setVisibility(false)

          //stage.getComponentsByName('first_str')[0].setVisibility(false)

          //console.log(stage.getComponentsByName('first_str').list[0].structureView.getStructure())

          /*stage.getComponentsByName('first_str').list[0].structure.eachResidue(function (rp) {
            console.log(rp)
          });*/

          /*setTimeout( () => {
            stage.getComponentsByName('first_str').list[0].reprList.forEach( function( repre ){
              //repre.setVisibility( false );
              //repre.setParameters( { color: '#555'} );603e1a99f7aa6046c8103204
              //repre.setParameters( { opacity: 0.6} );
              //console.log(repre)
              //repre.dispose()
              
            } )
            //stage.getComponentsByName('first_str').list[0].dispose()
            //console.log(stage.getComponentsByName('first_str'))
            //stage.getComponentsByName('first_str').list[0].setVisibility( false )
          }, 2000)*/

          /*stage.getRepresentationsByName( "licorice" ).list.forEach( function( repre ){
            repre.setVisibility( !repre.visible );
          } );*/

          //console.log(stage)

        })
    }

    onMounted(() => {
      // if entering representation directly, show BlockUI
      if(!dialog.block) {
        setBlockUI('load')
        openModal('block')
      }

      fetchProject(project_id)
        .then(() => {
          // save project.value to structureStorage
          //console.log(projectData.value)

          //  project doesn't exist, redirect to launch
          if(apiData.value.code === 404) {
            const msg = {
                severity: 'warn',
                content: 'You tried to access to an unexisting project, please check your project id or create a new one',
                show: true
            }
            setMessage('launch', msg)
            closeModal('block')
            $router.push({ name: 'Launch' }) 
            return false
          }

          initProject(apiData.value)

          createViewport()
        })

        //******************
        //createViewport()

    })
    
    return { stageLoaded }
  }
}
</script>

<style>
    #stage { position:absolute; left:0; top:0; width:100%; height: 100%; z-index: 1; background: #f1f1f1; }
    #viewport { width:100%; height:100%; background: #f1f1f1; }
    #viewport div canvas { background: transparent!important; }
    #viewport .p-progress-spinner { 
      width:100px;height:100px; position: absolute;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, -50%) 
    }
</style>