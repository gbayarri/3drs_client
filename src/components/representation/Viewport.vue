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
        //console.log(rp.isNucleic(), rp.isProtein())
        console.log(rp.isDna())
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

        // to create array with pdb addresses and load them programmatically in this Promise
        // move all component function (getModels and so on) to the NGL module
        stage.loadFile("https://files.rcsb.org/download/2rgp.pdb", { defaultRepresentation: false, ext: 'pdb', name:'first_str' })
          .then(function (component) {

              // DON'T REMOVE
              //component.addRepresentation( "cartoon", {  sele: "helix", color: "#f00", opacity:.4, aspectRatio:10 } )
              //component.addRepresentation( "cartoon", {  sele: "sheet", color: "#0f0", opacity:.4, aspectRatio:10 } )
              // DON'T REMOVE

              component.addRepresentation( "cartoon", { name: "struc_1", sele: "*", color: "sstruc"} )
              component.addRepresentation( "base", { name: "base_1", sele: "*", color: "resname" } )
              component.addRepresentation( "ball+stick", { name: "ligand_1", sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
              component.addRepresentation( "ball+stick", { name: "water_1", sele: "water",  radius: .4, aspectRatio: 1.5 } )
              component.addRepresentation( "ball+stick", { name: "ion_1", sele: "ion",  radius: .4, aspectRatio: 1.5 } )

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
              //console.log(residues)
              
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

          checkSignals(stage)

          //stage.getRepresentationsByName('ligand_1').setVisibility(false)

          //stage.getComponentsByName('first_str')[0].setVisibility(false)

          //console.log(stage.getComponentsByName('first_str').list[0].structureView.getStructure())

          /*stage.getComponentsByName('first_str').list[0].structure.eachResidue(function (rp) {
            console.log(rp)
          });*/

          /*setTimeout( () => {
            stage.getComponentsByName('first_str').list[0].reprList.forEach( function( repre ){
              //repre.setVisibility( false );
              repre.setParameters( { color: '#ff0000'} );
              repre.setParameters( { opacity: 0.6} );
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

    const checkSignals = (stage) => {

      stage.signals.hovered.add( function(pickingProxy){ 
        // update / show legend
        if (pickingProxy && pickingProxy.atom) {
          store.dispatch('updateLegend', {
            name: pickingProxy.atom.structure.name,
            chainname: pickingProxy.atom.chainname,
            resname: pickingProxy.atom.resname,
            resno: pickingProxy.atom.resno,
            atomname: pickingProxy.atom.atomname
          })
          store.dispatch('legendStatus', true)
        }
        // hide legend
        if (!pickingProxy) {
          store.dispatch('legendStatus', false)
        }
      })

      /*stage.signals.hovered.add( function(pickingProxy){ 
    		if (pickingProxy && pickingProxy.atom) {
    			if(typeof repr_res !== 'undefined') component.removeRepresentation(repr_res);
    			chain = pickingProxy.atom.chainname;
	        	num = pickingProxy.atom.resno;
	        	name = pickingProxy.atom.resname;
	        	Widgets.showLegend(str, chain, name, num);
	        	repr_res = component.addRepresentation( "backbone", { sele: '(' + num + ':' + chain + ')', aspectRatio: 10, opacity:.5, color:'#5E738B' });

                //var s = sequence.find(e => e.num === num);
                if(chain == current_chain) {
                    cleanSequence();
                    var seq_item = $('.sequence-item[data-chain="' + current_chain + '"][data-resnum="' + num + '"]');
                    seq_item.css('background', '#5E738B');
                    seq_item.css('color', '#fff');
                }
    		}
    		if (!pickingProxy) {
    			Widgets.hideLegend();
    			if(typeof repr_res !== 'undefined') component.removeRepresentation(repr_res);
                cleanSequence();
    		}
    	});

    	stage.signals.clicked.add( function(pickingProxy){ 
    		if (pickingProxy && pickingProxy.atom) {
    			if(typeof repr_res !== 'undefined') component.removeRepresentation(repr_res);
        		if(typeof repr_res_detail !== 'undefined') component.removeRepresentation(repr_res_detail);
        		chain = pickingProxy.atom.chainname;
	        	num = pickingProxy.atom.resno;
	        	name = pickingProxy.atom.resname;
	        	Widgets.showLegend(str, chain, name, num);
        		repr_res_detail = component.addRepresentation( "ball+stick", { sele: '(' + num + ':' + chain + ')', aspectRatio: 1 });
        		component.autoView('(' + num + ':' + chain + ')', 500);
        	*/
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