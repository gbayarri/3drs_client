import useLegend from '@/modules/viewport/useLegend'
import processStructure from '@/modules/ngl/processStructure'
import structureStorage from '@/modules/structure/structureStorage'
import useFlags from '@/modules/common/useFlags'

// Stage interactions
export default function loadStructure() {

    const { updateLegend } = useLegend()
    const { getType, getStructure } = processStructure()
    const { setFlagStatus } = useFlags()
    const { updateStructure } = structureStorage()

    const loadFileToStage = (stage, url, name, id) => {
        return stage.loadFile(url, { defaultRepresentation: false, ext: 'pdb', name:name })
            .then(function (component) {

            // set visibility to false until all structures are loaded
            component.setVisibility(false)
  
            // DON'T REMOVE
            //component.addRepresentation( "cartoon", {  sele: "helix", color: "#f00", opacity:.4, aspectRatio:10 } )
            //component.addRepresentation( "cartoon", {  sele: "sheet", color: "#0f0", opacity:.4, aspectRatio:10 } )
            // DON'T REMOVE

            //console.log('structure ' + name + ' loaded')

            // get structure
            // ONLY IF FIRST TIME AND project.structure IS EMPTY
            const structure = getStructure(component, name)
            //console.log(structure)
            updateStructure(structure, id)

            // add default representations
            component.addRepresentation( "cartoon", { name: "struc_1", sele: "*", color: "sstruc"} )
            if(structure.type.isNucleic) component.addRepresentation( "base", { name: "base_1", sele: "*", color: "resname" } )
            component.addRepresentation( "ball+stick", { name: "ligand_1", sele: "hetero and not(water or ion)",  radius: .4, aspectRatio: 1.5 } )
            component.addRepresentation( "ball+stick", { name: "water_1", sele: "water",  radius: .4, aspectRatio: 1.5 } )
            component.addRepresentation( "ball+stick", { name: "ion_1", sele: "ion",  radius: .4, aspectRatio: 1.5 } )

            return component
  
        })
    }
  
    const checkSignals = (stage) => {

        stage.signals.hovered.add( function(pickingProxy){ 
            // update / show legend
            if (pickingProxy && pickingProxy.atom) {
                updateLegend({
                    name: pickingProxy.atom.structure.name,
                    chainname: pickingProxy.atom.chainname,
                    resname: pickingProxy.atom.resname,
                    resno: pickingProxy.atom.resno,
                    atomname: pickingProxy.atom.atomname
                })
                setFlagStatus('legendEnabled', true)
            }
            // hide legend
            if (!pickingProxy) {
                setFlagStatus('legendEnabled', false)
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

  return { loadFileToStage, checkSignals }

}