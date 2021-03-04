import { ref } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'

const representations = ref({})
let currentRepresentation = ref(null)

export default function useRepresentations() {

    const { projectData } = structureStorage()
    const defaultRepresentation = projectData.value.defaultRepresentation

    const getRepresentationNames = function () {
        const names = []
        for(const item of projectData.value.representations) {
            names.push({
                name: item.name,
                id: item.id
            })
        }
        return names
    }

    const setCurrentRepresentation = function (value) {
        currentRepresentation.value = value
        //console.log(currentRepresentation.value)
    }

    const getCurrentRepresentationSettings = function () {
        return projectData.value.representations.filter(item => item.id === currentRepresentation.value)[0]
    }

    return { 
        representations, 
        currentRepresentation,
        defaultRepresentation,
        getRepresentationNames,
        setCurrentRepresentation,
        getCurrentRepresentationSettings
    }

}