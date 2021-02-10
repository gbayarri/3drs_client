<template>
  <div id="stage">
      <div id="viewport"></div>
  </div>
</template>

<script>
import { Stage } from 'ngl'
import { ref, onMounted } from 'vue'
export default {
  setup() {

    const createViewport = () => {
        // save stage to store
        const stage = new Stage("viewport", { backgroundColor:"#f1f1f1", tooltip:false })
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

                /*var cartoon = component.addRepresentation( "ribbon", {  color: "sstruc"} )
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
                Widgets.init(component)*/

            return component
        }),

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



    }
    
    onMounted(() => {
      createViewport()
    })
    return {  }
  }
}
</script>

<style>
    #stage { position:absolute; left:0; top:0; width:100%; height: 100%; z-index: 1; background: #f1f1f1; }
    #viewport { width:100%; height:100%; }
    #viewport div canvas { background: transparent!important; }
</style>