import { /*ref, */computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
/*const representations = ref({})
let currentRepresentation = ref(null)*/

export default function useSettings() {

    const { projectData, setDataModel, setDataChains, setDataMolecules } = structureStorage()
    const { updateRepresentationData } = useAPI()

    const dataProject = computed(() => projectData.value)

    const prjID = dataProject.value._id

    const longTimeOut = 5000
    const shortTimeOut = 1000

    // MODELS

    let myTimeOutModels = null
    const setModelsSettings = async (model, structure, representation) => {
        return await new Promise((resolve) => {
            clearTimeout(myTimeOutModels)
            myTimeOutModels = setTimeout(() => {
                const data = setDataModel(model, structure, representation)
                const response = updateRepresentationData(prjID, representation, data)
                resolve(response)
            }, shortTimeOut)
        })
    }

    // CHAINS
    // TODO: CLEAN chains, model, structure
    const setChainsSettings = async (chains, model, structure, representation) => {
        const data = setDataChains(chains, model, structure, representation)
        return await updateRepresentationData(prjID, representation, data)
    }

    // RESIDUES
    // TODO: CLEAN residue, structure
    const setMoleculesSettings = async (residue, structure, representation) => {
        const data = setDataMolecules(residue, structure, representation)
        return await updateRepresentationData(prjID, representation, data)
    }

    return { 
        setModelsSettings,
        setChainsSettings,
        setMoleculesSettings
    }

}