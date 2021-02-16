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
      let prev = null
      let arraux = []
      structureView.eachResidue(function (rp) {
        if(rp.isHelix()) {
          arraux.push(rp.resno)
        }
        if(!rp.isHelix() && prev) {
          helixes.push(arraux)
          arraux = []
        }
        prev = rp.isHelix()
      });
      return helixes
    }

    const getSheets = (structureView) => {
      let sheets = []
      let prev = null
      let arraux = []
      structureView.eachResidue(function (rp) {
        if(rp.isSheet()) {
          arraux.push(rp.resno)
        }
        if(!rp.isSheet() && prev) {
          sheets.push(arraux)
          arraux = []
        }
        prev = rp.isSheet()
      });
      return sheets
    }

    const getResidues = (structureView) => {
      let sequence = []
      structureView.eachResidue(function (rp) {
          let res = {
              'id': globals.aminoacids[rp.resname.toLowerCase()].id,
              'num': rp.resno,
              'label': rp.resname.toUpperCase(),
              'longname': globals.aminoacids[rp.resname.toLowerCase()].name
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
              'description': rp.entity.description
          }
          heteros.push(res)
      });
      return heteros
    }

    const getIons = (structureView) => {
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

        // 2vgb: pyruvate
        // 1mbs: web3DMol
        // 2rgp: water, ions, hetero, helixes and sheets
        // 2kod: multimodel + multichain
        // 1pik: multimodel + multichain DNA (no structure)
        // 4gxy: RNA
        stage.loadFile("https://files.rcsb.org/download/2rgp.pdb", { defaultRepresentation: false, ext: 'pdb', name:'first_str' })
          .then(function (component) {

              // DON'T REMOVE
              //component.addRepresentation( "cartoon", {  sele: "helix", color: "#f00", opacity:.4, aspectRatio:10 } )
              //component.addRepresentation( "cartoon", {  sele: "sheet", color: "#0f0", opacity:.4, aspectRatio:10 } )
              // DON'T REMOVE

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
              //console.log(structureViewModels)
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
              //console.log(helixes)

              /* SHEETS */
              const selection_sheets = ngl.createSelection('not ( water or ion or hetero )')
              const structureViewSheets = component.structure.getView(selection_sheets)
              const sheets = getSheets(structureViewSheets)
              //console.log(sheets)

              /* RESIDUES */
              const selection_residues = ngl.createSelection('not ( water or ion or hetero )')
              const structureViewResidues = component.structure.getView(selection_residues)
              const residues = getResidues(structureViewResidues)
              console.log(residues)
              
              /* HETEROATOMS */
              const selection_heteroatoms = ngl.createSelection('hetero and not (water or ion)')
              const structureViewHeteroatoms = component.structure.getView(selection_heteroatoms)
              const heteroatoms = getHeteroatoms(structureViewHeteroatoms)
              //console.log(heteroatoms)

              /* IONS */
              const selection_ions = ngl.createSelection('ion')
              const structureViewIons = component.structure.getView(selection_ions)
              const ions = getIons(structureViewIons)
              //console.log(ions)

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