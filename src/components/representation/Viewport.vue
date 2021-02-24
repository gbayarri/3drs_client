<template>
  <div id="stage">
      <div id="viewport">
          <ProgressSpinner v-if="!stageLoaded" strokeWidth="6" animationDuration=".8s"/>
      </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import useFlags from '@/modules/common/useFlags'
import useStage from '@/modules/ngl/useStage'
import useTools from '@/modules/ngl/useTools'
import loadStructure from '@/modules/ngl/loadStructure'
import structureStorage from '@/modules/structure/structureStorage'
import structureNavigation from '@/modules/structure/structureNavigation'
export default {
  setup() {

    const { flags, setFlagStatus } = useFlags()
    const stageLoaded = computed(() => flags.stageLoaded)
    const { updateOrientation } = useTools()
    const { loadFileToStage, checkSignals } = loadStructure()
    const { /*structure, */resetStructure } = structureStorage()
    const { setCurrentStructure } = structureNavigation()
    
    const createViewport = () => {
      const { createStage } = useStage()
      const stage = createStage("viewport")

      resetStructure()
      setFlagStatus('stageLoaded', false)

      // 2vgb: pyruvate
      // 1mbs: web3DMol
      // 2rgp: water, ions, hetero, helixes and sheets
      // 2kod: multimodel + multichain
      // 1pik: multimodel + multichain DNA (no structure)
      // 4gxy: RNA

      // see https://youtu.be/KsNXsxKoXlY (async fetch composable function)

      const structures = [/*{ name:"1pik", id: "4" }, { name:"2kod", id: "3" }, */{ name:"2rgp", id: "4" }/*{ name:"6ACC", id: "4" }, { name:"2rgp", id: "1" }, /*{ name:"1mbs", id: "2" }, { name:"1pik", id: "3" }, { name:"2kod", id: "4" }, { name:"2vgb", id: "5" },*/  ]
      const array_promises = []
      for(const str of structures) {
        array_promises
          .push(
            loadFileToStage(stage, "https://files.rcsb.org/download/" + str.name + ".pdb", str.name, str.id)
          )
      }

      Promise.all(array_promises)
      .then(function (ol) {
          /*ol[ 0 ].superpose(ol[ 1 ], false)
          ol[ 0 ].autoView(":A")*/

          //console.log(ol)

          // set all components to visible
          for(const c of stage.compList){
            c.setVisibility(true)
          }

          stage.autoView()
          //store.dispatch('initOrientation', stage.viewerControls.getOrientation())
          updateOrientation(stage.viewerControls.getOrientation())

          setFlagStatus('stageLoaded', true)
          //store.dispatch('stageIsLoaded', true)

          checkSignals(stage)

          // ************************
          // TO CHECK!!!!!
          setCurrentStructure('4')
          // ************************
          // ************************

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
              //repre.setParameters( { color: '#555'} );
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
      createViewport()
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