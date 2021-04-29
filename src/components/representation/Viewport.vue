<template>
  <div id="stage">
      <div id="viewport">
          <!--<ProgressSpinner v-if="!stageLoaded" strokeWidth="6" animationDuration=".8s"/>-->
      </div>
  </div>
</template>

<script>
import { /*inject,*/ computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import useFlags from '@/modules/common/useFlags'
import useStage from '@/modules/ngl/useStage'
import useModals from '@/modules/common/useModals'
//import useMessages from '@/modules/common/useMessages'
import useAPI from '@/modules/api/useAPI'
import useComponents from '@/modules/ngl/useComponents'
import structureStorage from '@/modules/structure/structureStorage'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useSelections from '@/modules/representations/useSelections'
import useProjectSettings from '@/modules/structure/useProjectSettings'
import mouseObserver from '@/modules/ngl/mouseObserver'
import useTrajectories from '@/modules/ngl/useTrajectories'
export default {
  props: ['project_id'],
  setup(props) {

    //const $router = inject('$router')
    const { flags, setFlagStatus } = useFlags()
    //const { setMessage } = useMessages()
    const stageLoaded = computed(() => flags.stageLoaded)
    const { dialog, openModal, closeModal, setBlockUI } = useModals()
    const { apiData, fetchProject, updateProjectData } = useAPI()
    const { loadFileToStage } = useComponents()
    const { setInitOrientation, checkMouseSignals, checkMouseSignalsShared, zoomToResidue, selectResidue } = mouseObserver()
    const { /*processedStructure,*/ projectData, updateStructureProject, resetStructure, getFirstProjectData } = structureStorage()
    const { /*settings,*/ setCurrentStructure } = structureSettings()
    const { /*defaultRepresentation,*/ currentRepresentation, setCurrentRepresentation/*, getCurrentRepresentationSettings*/ } = useRepresentations()
    const { setSelection, checkSelectionType } = useSelections()
    const { setProjectSettings, getProjectSettings } = useProjectSettings()
    const { checkPlayersLoaded } = useTrajectories()

    const project_id = props.project_id
    const currReprVal = computed(() => currentRepresentation.value)
    const prjSettings = computed(() => getProjectSettings())
    const toast = useToast()
    const isShared = computed(() => flags.isShared)
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
        //console.log(str.trajectory)
        array_promises
          .push(
            //loadFileToStage(stage, "https://files.rcsb.org/download/" + str.name + ".pdb", str.name, str.id)
            loadFileToStage(stage, process.env.VUE_APP_API_LOCATION + '/download/' + str.id, str.name, str.ext, str.id, str.trajectory)
          )
      }

      Promise.all(array_promises)
      .then(function (ol) {
          /*ol[ 0 ].superpose(ol[ 1 ], false)
          ol[ 0 ].autoView(":A")*/

          //console.log(ol)

          setBlockUI('update')

          //IN CASE IS FIRST TIME SEND ALL DATA TO API
          if(dataProject.value.structure.length === 0 && dataProject.value.settings.length === 0) {

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
          if(!isShared.value) checkMouseSignals(stage)
          else checkMouseSignalsShared(stage)

          // set current representation          
          setCurrentRepresentation(dataProject.value.currentRepresentation, false)

          // set current structure          
          setCurrentStructure(dataProject.value.currentStructure)
          //setCurrentStructure('4')

          // set all components to visible
          for(const c of stage.compList){
            c.setVisibility(true)
          }

          // disabling autocenter when clicking on an atom
          stage.mouseControls.remove('clickPick-left')
          // reset position on double click
          stage.mouseControls.add('doubleClick+left', function( stage, delta ){
              stage.autoView(300)
          } )
          // remove previous action of clickPick+left-ctrl
          stage.mouseControls.remove('clickPick+left-ctrl')
          // zoom to residue
          stage.mouseControls.add('clickPick+left-ctrl', function( stage, pickingProxy ){
            zoomToResidue(stage, pickingProxy)
          })
          // select residue
          stage.mouseControls.add('clickPick+left', function( stage, pickingProxy ){
            selectResidue(stage, pickingProxy)
          })

          // open settings automatically if current representation is not default
          if(currReprVal.value !== dataProject.value.defaultRepresentation && !isShared.value) {
            setFlagStatus('sidebarEnabled', true)
            // according to dataProject.value.currentStructure, set flags.customEnabled
            const sel_type = checkSelectionType(dataProject.value.currentRepresentation, dataProject.value.currentStructure)
            setFlagStatus('customEnabled', (sel_type === 'custom'))
          } else {
            setFlagStatus('sidebarEnabled', false)
          }

          // set stage flag, await until players are completely loaded
          //console.log('before')         
          checkPlayersLoaded().then((r) =>  {

            //console.log('after')

            setFlagStatus('stageLoaded', true)

            window.addEventListener("resize", () => stage.viewer.handleResize())

            // close BlockUI
            closeModal('block')

            // only show this toast if project status is 'w' (still not shared)
            if(prjSettings.value.status === 'w')
              toast.add({ 
                    severity:'warn', 
                    summary: 'Expiration date', 
                    detail:'Remember that this project will expire on ' + new Date(prjSettings.value.expiration.date).toLocaleDateString("en-GB") + ' unless you share it.', 
                    life: 10000
                })

            console.log(stage)
          })

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
          /*if(apiData.value.code === 404) {
            const msg = {
                severity: 'warn',
                content: 'You tried to access to an unexisting project, please check your project id or create a new one',
                show: true
            }
            setMessage('launch', msg)
            closeModal('block')
            $router.push({ name: 'Launch' }) 
            return false
          }*/

          // set background color
          document.querySelector("#viewport").style.background = apiData.value.background

          // save apiData to structureStorage.projectData
          // *************************************
          // DOES NOT WORK???
          updateStructureProject(apiData.value)
          // *************************************
          // *************************************

          setProjectSettings(apiData.value.projectSettings)

          // set selections global var
          setSelection(apiData.value.representations, apiData.value.defaultRepresentation)

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