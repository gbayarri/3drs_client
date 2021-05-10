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
    const shortTimeOut = 2000

    const setMeasurements = (m) => {
        measurements.distances = m.distances
        measurements.angles = m.angles
    }

    const getMeasurements = (k) => {
        return measurements[k]
    }

    const updateMeasurements = async (k, v, update = true) => {
        if(prjID === undefined) prjID = dataProject.value._id
        measurements[k] = v
        if(update) {
            return await updateProjectData(prjID, { measurements: measurements })
        }
    }

    let myTimeOut = null
    const updateMeasurementsTimeout = async (k, v, update = true) => {
        if(update) {
            return await new Promise((resolve) => {
                clearTimeout(myTimeOut)
                myTimeOut = setTimeout(() => {
                    if(prjID === undefined) prjID = dataProject.value._id
                    measurements[k] = v
                    const response = updateProjectData(prjID, { measurements: measurements })
                    resolve(response)
                }, shortTimeOut)
            })
        }
    }

    const createDistance = (ap, component, structure) => {
        //const size = (ap.dist <= 4) ? 4 : (ap.dist / 5)
        component.addRepresentation("distance", {
            name: ap.id + '-' + structure + '-dist',
            atomPair: [ [ ap.sele[0], ap.sele[1] ] ],
            //labelSize: size,
            labelSize: ap.size,
            labelColor: 0xffffff, 
            color: ap.color,
            labelBorder: true,
            labelBorderColor: ap.color,
            labelBorderWidth: .3,
            labelBackground: true,
            labelBackgroundColor: ap.color,
            labelBackgroundMargin: 2,
            labelBackgroundOpacity: .5,
            labelUnit: 'angstrom',
            labelAttachment: 'middle-right',
            linewidth: 10
        })
    }

    const createAngle = (ap, component, structure) => {
        const a = component.addRepresentation("angle", {
            name: ap.id + '-' + structure + '-ang',
            atomTriple: [ [ ap.sele[0], ap.sele[1], ap.sele[2] ] ],
            labelSize: ap.size,
            labelColor: 0xffffff, 
            color: ap.color,
            labelBorder: true,
            labelBorderColor: ap.color,
            labelBorderWidth: .3,
            labelBackground: true,
            labelBackgroundColor: ap.color,
            labelBackgroundMargin: 2,
            labelBackgroundOpacity: .5,
            labelAttachment: 'middle-right',
            arcVisible: true,
            linewidth: 10
            //sdf: false
        })
    }

    return {
        setMeasurements,
        getMeasurements,
        updateMeasurements,
        updateMeasurementsTimeout,
        createDistance,
        createAngle
    }

}