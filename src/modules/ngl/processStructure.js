import { ref } from 'vue'
import useStage from '@/modules/ngl/useStage'
//const legend = ref({})

export default function processStructure() {

    const { createSelection } = useStage()

    const getModels = (component) => {

        const selection_models = createSelection('*') 
        const structureView = component.structure.getView(selection_models)

        let models = []
        structureView.eachModel(function (rp) {
            models.push(rp.index)
        });
        return models
    }

    const getChains = (component, model) => {

        const selection_chains = createSelection('/' + model) // change by model
        const structureView = component.structure.getView(selection_chains)

        let chains = []
        structureView.eachChain(function (rp) {
          chains.push(rp.chainname)
        });
        chains = Array.from(new Set(chains))
        return chains
    }

  return { 
      getModels,
      getChains
     }

}