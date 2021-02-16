<template>
  <div id="stage">
      <div id="viewport">
          <ProgressSpinner v-if="!stageLoaded" strokeWidth="6" animationDuration=".8s"/>
      </div>
  </div>
</template>

<script>
import { inject, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import globals from '@/globals'
export default {
  setup() {

    const store = useStore()

    let stageLoaded = computed(() => store.state.stageLoaded)

    const getModels = (structureView) => {
      let models = []
      structureView.eachModel(function (rp) {
        models.push(rp.index)
      });
      return models
    }

    const getChains = (structureView) => {
      let chains = []
      structureView.eachChain(function (rp) {
        chains.push(rp.chainname)
      });
      chains = Array.from(new Set(chains))
      return chains
    }

    const getHelixes = (structureView) => {
      let helixes = []
      // TODO!!!!!
      structureView.eachResidue(function (rp) {
        console.log(rp.isHelix())
        /*console.log(rp.entityIndex)
          let res = {
              'id': globals.aminoacids[rp.resname.toLowerCase()].id,
              'num': rp.resno,
              'name': rp.resname.toUpperCase(),
          }
          sequence.push(res)*/
      });
      //return sequence
    }

    const getResidues = (structureView) => {
      let sequence = []
      structureView.eachResidue(function (rp) {
          let res = {
              'id': globals.aminoacids[rp.resname.toLowerCase()].id,
              'num': rp.resno,
              'name': rp.resname.toUpperCase(),
          }
          sequence.push(res)
      });
      return sequence
    }

    const getHeteroatoms = (structureView) => {
      let heteros = []
      structureView.eachResidue(function (rp) {
          let res = {
              'num': rp.resno,
              'name': rp.resname.toUpperCase(),
          }
          heteros.push(res)
      });
      return heteros
    }

    const getMetals = (structureView) => {
      let ions = []
      structureView.eachResidue(function (rp) {
          let res = {
              'num': rp.resno,
              'name': rp.resname.toUpperCase(),
          }
          ions.push(res)
      });
      return ions
    }

    const getWaters = (structureView) => {
      let waters = []
      structureView.eachResidue(function (rp) {
          let res = {
              'num': rp.resno,
              'name': rp.resname.toUpperCase(),
          }
          waters.push(res)
      });
      return waters
    }

    const createViewport = () => {
      let ngl = inject('ngl')
      const stage = ngl.createStage("viewport")

      Promise.all([

        // 2vgb: TODO search structure with chains and models
        stage.loadFile("https://files.rcsb.org/download/1mbs.pdb", { defaultRepresentation: false, ext: 'pdb', name:'first_str' })
          .then(function (component) {

            component.addRepresentation( "cartoon", {  sele: "helix", color: "#000000"} )

              component.addRepresentation( "ribbon", {  color: "sstruc"} )
              component.addRepresentation( "base", { sele: "*", color: "resname" } )
              //component.addRepresentation( "ball+stick", { sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
              component.addRepresentation( "ball+stick", { sele: "hetero",  radius: .4, aspectRatio: 1.5 } )

              //console.log('structure 2vgb loaded')

              

              // TODO: FOR EACH FILE
              //console.log(stage.viewerControls.getOrientation())
              /*store.dispatch('initOrientation', stage.viewerControls.getOrientation())

              store.dispatch('stageIsLoaded', true)*/

              /* MODELS */
              const selection_models = ngl.createSelection('*') 
              const structureViewModels = component.structure.getView(selection_models)
              const models = getModels(structureViewModels)
              //console.log(models)

              /* CHAINS */
              const selection_chains = ngl.createSelection('/0') // change by model
              const structureViewChains = component.structure.getView(selection_chains)
              const chains = getChains(structureViewChains)
              //console.log(chains)

              /* HELIXES */
              const selection_helixes = ngl.createSelection('not ( water or ion or hetero )')
              const structureViewHelixes = component.structure.getView(selection_helixes)
              const helixes = getHelixes(structureViewHelixes)
              console.log(helixes)

              /* RESIDUES */
              const selection_residues = ngl.createSelection('not ( water or ion or hetero )')
              const structureViewResidues = component.structure.getView(selection_residues)
              const residues = getResidues(structureViewResidues)
              //console.log(residues)
              
              /* HETEROATOMS */
              const selection_heteroatoms = ngl.createSelection('hetero and not (water or ion)')
              const structureViewHeteroatoms = component.structure.getView(selection_heteroatoms)
              const heteroatoms = getHeteroatoms(structureViewHeteroatoms)
              //console.log(heteroatoms)

              /* METALS */
              const selection_metals = ngl.createSelection('ion')
              const structureViewMetals = component.structure.getView(selection_metals)
              const metals = getMetals(structureViewMetals)
              //console.log(metals)

              /* WATERS */
              const selection_waters = ngl.createSelection('water')
              const structureViewWaters = component.structure.getView(selection_waters)
              const waters = getWaters(structureViewWaters)
              //console.log(waters)

              return component

          }),

          /*stage.loadFile("https://files.rcsb.org/download/1aki.pdb", { defaultRepresentation: false, ext: 'pdb', name:'1aki' })
              .then(function (component) {
                //console.log(stage)
                  component.addRepresentation( "ribbon", {  color: '#000'} )
                  component.addRepresentation( "base", { sele: "*", color: "resname" } )
                  component.addRepresentation( "ball+stick", { sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
                  component.addRepresentation( "ball+stick", { sele: "ion",   radius: .4, aspectRatio: 1.5 })

                  //component.autoView()

                  //stage.autoView()

                  //console.log(stage.viewerControls.getOrientation())

                  return component

          }),

          stage.loadFile("https://files.rcsb.org/download/4i19.pdb", { defaultRepresentation: false, ext: 'pdb', name:'4i19' })
              .then(function (component) {
                //console.log(stage)
                  component.addRepresentation( "ribbon", {  color: '#ff0'} )
                  component.addRepresentation( "base", { sele: "*", color: "resname" } )
                  component.addRepresentation( "ball+stick", { sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
                  component.addRepresentation( "ball+stick", { sele: "ion",   radius: .4, aspectRatio: 1.5 })

                  //component.autoView()

                  //stage.autoView()

                  //console.log(stage.viewerControls.getOrientation())

                  return component

          })*/

        ]).then(function (ol) {
          /*ol[ 0 ].superpose(ol[ 1 ], false)
          ol[ 0 ].autoView(":A")*/

          //console.log(stage)

          stage.autoView()
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