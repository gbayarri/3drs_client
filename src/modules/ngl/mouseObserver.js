import { ref, computed } from 'vue'
import useLegend from '@/modules/viewport/useLegend'
import structureStorage from '@/modules/structure/structureStorage'
import useFlags from '@/modules/common/useFlags'
import useAPI from '@/modules/api/useAPI'

const initialOrientation = ref([])

// Stage interactions
export default function mouseObserver() {

    const { updateLegend } = useLegend()
    const { setFlagStatus } = useFlags()
    const { projectData } = structureStorage()
    const { updateOrientation } = useAPI()

    const dataProject = computed(() => projectData.value)
    const timeOutOrientation = 5000

    const setInitOrientation = function (orientation) {
        initialOrientation.value = orientation
    }
  
    const autoSaveOrientation = function(orientation) {
        updateOrientation(dataProject.value._id, orientation)
            .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
            })
    }

    const checkMouseSignals = (stage) => {

        // on hover actions: show atoms / bonds in legend
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
            if (pickingProxy && pickingProxy.bond) {
                updateLegend({
                    name: pickingProxy.bond.structure.name,
                    chainname: pickingProxy.bond.atom1.chainname,
                    resname: pickingProxy.bond.atom1.resname,
                    resno: pickingProxy.bond.atom1.resno,
                    atomname: pickingProxy.bond.atom1.atomname + '-' + pickingProxy.bond.atom2.atomname
                })
                setFlagStatus('legendEnabled', true)
            }
            // hide legend
            if (!pickingProxy) {
                setFlagStatus('legendEnabled', false)
            }
        })

        // on drag / scroll actions: save orientation after 5s
        let myTimeOut = null
        stage.mouseObserver.signals.dragged.add(function (delta) {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), timeOutOrientation)
        })

        stage.mouseObserver.signals.scrolled.add(function (scroll) {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), timeOutOrientation)
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

  return { 
      initialOrientation,
      setInitOrientation,
      checkMouseSignals 
    }

}