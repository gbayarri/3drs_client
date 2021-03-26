import { ref, computed } from 'vue'
import useLegend from '@/modules/viewport/useLegend'
import structureStorage from '@/modules/structure/structureStorage'
import useFlags from '@/modules/common/useFlags'
import useAPI from '@/modules/api/useAPI'
import structureSettings from '@/modules/structure/structureSettings'
const initialOrientation = ref([])

// Stage interactions
export default function mouseObserver() {

    const { updateLegend } = useLegend()
    const { setFlagStatus } = useFlags()
    const { projectData } = structureStorage()
    const { updateProjectData } = useAPI()
    const { getFileNames } = structureSettings()

    const filesList = computed(() => getFileNames())
    const dataProject = computed(() => projectData.value)
    const timeOut = 5000

    const setInitOrientation = function (orientation) {
        initialOrientation.value = orientation
    }
  
    const autoSaveOrientation = function(orientation) {
        updateProjectData(dataProject.value._id, { orientation: orientation })
            .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
            })
    }

    const cleanSequences = () => {
        const allResidues = document.querySelectorAll('.sequence-item, .water-item')
        for(const res of allResidues) {
            res.classList.remove('sequence-item-hover')
        }
    }

    const checkMouseSignals = (stage) => {

        // on hover actions: show atoms / bonds in legend
        stage.signals.hovered.add( function(pickingProxy){ 
            // update / show legend
            if (pickingProxy && pickingProxy.atom) {
                //console.log(pickingProxy.atom)
                const name = filesList.value.filter(item => item.id === pickingProxy.atom.structure.name)[0].name
                updateLegend({
                    name: name,
                    model: pickingProxy.atom.modelIndex,
                    chainname: pickingProxy.atom.chainname,
                    resname: pickingProxy.atom.resname,
                    resno: pickingProxy.atom.resno,
                    atomname: pickingProxy.atom.atomname
                })
                setFlagStatus('legendEnabled', true)
                // TODO BETTER:
                cleanSequences()
                const selResidues = document.querySelectorAll('[data-model="' + pickingProxy.atom.modelIndex + '"][data-chain="' + pickingProxy.atom.chainname + '"][data-resnum="' + pickingProxy.atom.resno + '"]')
                for(const res of selResidues) {
                    res.classList.add('sequence-item-hover')
                }
            }
            if (pickingProxy && pickingProxy.bond) {
                const name = filesList.value.filter(item => item.id === pickingProxy.bond.structure.name)[0].name
                updateLegend({
                    name: name,
                    model: pickingProxy.bond.atom1.modelIndex,
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
                cleanSequences()
            }
        })

        // TODO: CENTER ON CLICKED RESIDUE
        // stage.autoView DOESN'T WORK WITH MOLECULE AS A PARAMETER, IT SHOULD BE CALLED FROM COMPONENT 
        //stage.signals.clicked.add( function(pickingProxy){ 
    		//if (pickingProxy && pickingProxy.atom) {
    			/*if(typeof repr_res !== 'undefined') component.removeRepresentation(repr_res);
        		if(typeof repr_res_detail !== 'undefined') component.removeRepresentation(repr_res_detail);
        		chain = pickingProxy.atom.chainname;
	        	num = pickingProxy.atom.resno;
	        	name = pickingProxy.atom.resname;
	        	Widgets.showLegend(str, chain, name, num);
        		repr_res_detail = component.addRepresentation( "ball+stick", { sele: '(' + num + ':' + chain + ')', aspectRatio: 1 });*/
               // console.log('(' + pickingProxy.atom.resno + ':' + pickingProxy.atom.chainname + ')')
        		//stage.autoView('(' + pickingProxy.atom.resno + ':' + pickingProxy.atom.chainname + '/0)', 500);
        	//}
    	//})

        // on drag / scroll actions: save orientation after 5s
        let myTimeOut = null
        stage.mouseObserver.signals.dragged.add(function (delta) {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), timeOut)
        })

        stage.mouseObserver.signals.scrolled.add(function (scroll) {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), timeOut)
        })

        stage.mouseObserver.signals.doubleClicked.add(function (scroll) {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), timeOut)
        })

    }

  return { 
      initialOrientation,
      setInitOrientation,
      checkMouseSignals 
    }

}