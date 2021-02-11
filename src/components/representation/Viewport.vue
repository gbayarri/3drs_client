<template>
  <div id="stage">
      <div id="viewport">
          <ProgressSpinner v-if="!stageLoaded" strokeWidth="6" animationDuration=".8s"/>
      </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
//import globals from '@/globals'
//console.log(globals.aminoacids)

import ngl from "@/modules/NGLStage"

export default {
  setup() {

    const store = useStore()

    let stageLoaded = computed(() => store.state.stageLoaded)

    const createViewport = () => {
      const stage = ngl.createStage("viewport").stage

      stage.loadFile("https://mmb.irbbarcelona.org/api/pdb/2vgb", { defaultRepresentation: false, ext: 'pdb', name:'2vgb' })
        .then(function (component) {

            component.addRepresentation( "ribbon", {  color: "sstruc"} )
            component.addRepresentation( "ball+stick", { sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )

            console.log('structure 2vgb loaded')

            stage.autoView()

            // TODO: FOR EACH FILE
            //console.log(stage.viewerControls.getOrientation())
            store.dispatch('initOrientation', stage.viewerControls.getOrientation())

            store.dispatch('stageIsLoaded', true)

           

        })
    }

    onMounted(() => {
      createViewport()
    })













    //console.log(stage2)

    /*const createViewport = () => {
        // save stage to store
        //const stage = new Stage("viewport", { backgroundColor:"#f1f1f1", tooltip:false })

        

        //createStage(10)
        //createStage(stage)

        // get pdb(s) from API (how to load multiple pdbs?)
        // add names to stage.compList items
        // make all the loadFile functions callable as composables???
        stage.loadFile("https://mmb.irbbarcelona.org/api/pdb/2vgb", { defaultRepresentation: false, ext: 'pdb' })
            .then(function (component) {
              console.log(stage)
                component.addRepresentation( "ribbon", {  color: "sstruc"} )
                component.addRepresentation( "base", { sele: "*", color: "resname" } )
                component.addRepresentation( "ball+stick", { sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
                component.addRepresentation( "ball+stick", { sele: "ion",   radius: .4, aspectRatio: 1.5 })

                component.autoView()

                console.log(stage.viewerControls.getOrientation())

                // connect with button
                //stage.toggleSpin()

                var cartoon = component.addRepresentation( "ribbon", {  color: "sstruc"} )
                //var cartoon = component.addRepresentation( "ribbon", {  color: "resname"} )

                component.addRepresentation( "base", { sele: "*", color: "resname" } )
                component.addRepresentation( "ball+stick", { sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
                component.addRepresentation( "ball+stick", { sele: "ion",   radius: .4, aspectRatio: 1.5 })
                //component.addRepresentation( "ball+stick", { sele: "(57:A)", radius: .6})
                //component.addRepresentation( "licorice", {  sele: ":A and ( 57-59 )", color: "resname"} )
                component.autoView()

                $("#stage").css("background","#f1f1f1")

                // disabling autocenter when clicking on an atom
                stage.mouseControls.remove('clickPick-left')
                // reset position on double click
                stage.mouseControls.add('doubleClick+left', function( stage, delta ){
                    component.autoView(300)
                } )
                
                initOrientation = stage.viewerControls.getOrientation()

                // get structure
                GetStructure.init(component)

                // init widgets
                Widgets.init(component)

            return component
        })//,

        stage.loadFile("https://mmb.irbbarcelona.org/api/pdb/1aki", { defaultRepresentation: false, ext: 'pdb' })
            .then(function (component) {
              console.log(stage)
                component.addRepresentation( "ribbon", {  color: '#000'} )
                component.addRepresentation( "base", { sele: "*", color: "resname" } )
                component.addRepresentation( "ball+stick", { sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
                component.addRepresentation( "ball+stick", { sele: "ion",   radius: .4, aspectRatio: 1.5 })

                //component.autoView()

                console.log(stage.viewerControls.getOrientation())

                return component

        })



    }*/
    
    
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