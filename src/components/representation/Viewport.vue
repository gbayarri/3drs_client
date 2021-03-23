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
import useModals from '@/modules/common/useModals'
import useMessages from '@/modules/common/useMessages'
import useAPI from '@/modules/api/useAPI'
import useComponents from '@/modules/ngl/useComponents'
import structureStorage from '@/modules/structure/structureStorage'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useSelections from '@/modules/representations/useSelections'
import mouseObserver from '@/modules/ngl/mouseObserver'
export default {
  props: ['project_id'],
  setup(props) {

    const $router = inject('$router')
    const { flags, setFlagStatus } = useFlags()
    const { setMessage } = useMessages()
    const stageLoaded = computed(() => flags.stageLoaded)
    const { dialog, openModal, closeModal, setBlockUI } = useModals()
    const { apiData, fetchProject, updateProjectData } = useAPI()
    const { loadFileToStage } = useComponents()
    const { setInitOrientation, checkMouseSignals } = mouseObserver()
    const { /*processedStructure,*/ projectData, updateStructureProject, resetStructure, getFirstProjectData } = structureStorage()
    const { settings, setCurrentStructure } = structureSettings()
    const { defaultRepresentation, setCurrentRepresentation/*, getCurrentRepresentationSettings*/ } = useRepresentations()
    const { setSelection } = useSelections()
    const project_id = props.project_id
    //const currReprSettings = computed(() => getCurrentRepresentationSettings())

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
      // 6acc: spike

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

          //IN CASE IS FIRST TIME SEND ALL DATA TO API
          if(dataProject.value.structure.length === 0 && dataProject.value.settings.length === 0) {

            setBlockUI('update')

            stage.autoView()
            // set initial orientation for reload button
            setInitOrientation(stage.viewerControls.getOrientation())

            const orientation = stage.viewerControls.getOrientation().elements
            const data = getFirstProjectData(orientation)

            updateProjectData(project_id, data)
              .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
              })
            
          } else {
            // update current orientation for reload component
            stage.animationControls.orient(dataProject.value.orientation)
            const orientation = {
              elements: dataProject.value.orientation
            }
            setInitOrientation(orientation)
          }

          // init mouse observer
          checkMouseSignals(stage)

          // set current representation          
          setCurrentRepresentation(dataProject.value.currentRepresentation, false)

          // set current structure          
          setCurrentStructure(dataProject.value.currentStructure)
          //setCurrentStructure('4')

          // set all components to visible
          for(const c of stage.compList){
            c.setVisibility(true)
          }

          // set stage flag
          setFlagStatus('stageLoaded', true)

          // close BlockUI
          closeModal('block')


          console.log(stage)
          

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

      // get project_id from API
      fetchProject(project_id)
        .then(() => {
          //  project doesn't exist, redirect to launch and show warning
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

          // set background color
          document.querySelector("#viewport").style.background = apiData.value.background

          // save apiData to structureStorage.projectData
          updateStructureProject(apiData.value)

          // set selections global var
          setSelection(apiData.value.representations, defaultRepresentation)

          // create viewport
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