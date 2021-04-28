import { ref, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'

const projectSettings = ref([])

// projectSettings
export default function useProjectSettings() {

    const { projectData } = structureStorage()
    const { updateProjectData } = useAPI()

    const dataProject = computed(() => projectData.value)
    let prjID = projectData.value._id
    const shortTimeOut = 2000

    const setProjectSettings = (ps) => {
        projectSettings.value = ps
    }

    const getProjectSettings = () => {
        return projectSettings.value
    }

    const updateProjectSettings = async (k, v, update = true) => {
        if(prjID === undefined) prjID = dataProject.value._id
        projectSettings.value[k] = v
        if(update) {
            return await updateProjectData(prjID, { projectSettings: projectSettings.value })
        }
    }

    let myTimeOut = null
    const updateProjectSettingsTimeout = async (k, v, update = true) => {
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
    }

    return {
        setProjectSettings,
        getProjectSettings,
        updateProjectSettings,
        updateProjectSettingsTimeout
    }

}