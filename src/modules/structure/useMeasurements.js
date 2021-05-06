import { reactive, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'

const measurements = reactive({
    distances: [],
    angles: []
})

// projectSettings
export default function useMeasurements() {

    const { projectData } = structureStorage()
    const { updateProjectData } = useAPI()

    const dataProject = computed(() => projectData.value)
    let prjID = projectData.value._id
    //const shortTimeOut = 2000

    const setMeasurements = (distances, angles) => {
        measurements.distances = distances
        measurements.angles = angles
    }

    const getMeasurements = (k) => {
        return measurements[k]
    }

    const updateMeasurements = async (k, v, update = true) => {
        if(prjID === undefined) prjID = dataProject.value._id
        measurements[k] = v
        if(update) {
            return await updateProjectData(prjID, { [k]: measurements[k] })
        }
    }

    /*let myTimeOut = null
    const updateMeasurementsTimeout = async (k, v, update = true) => {
        if(update) {
            return await new Promise((resolve) => {
                clearTimeout(myTimeOut)
                myTimeOut = setTimeout(() => {
                    if(prjID === undefined) prjID = dataProject.value._id
                    projectSettings.value[k] = v
                    const response = updateProjectData(prjID, { projectSettings: projectSettings.value })
                    resolve(response)
                }, shortTimeOut)
            })
        }
    }*/

    return {
        setMeasurements,
        getMeasurements,
        updateMeasurements,
        //updateProjectSettingsTimeout
    }

}