import { ref } from 'vue'

const navigation = ref([])
let currentStructure = ref(null)

export default function structureNavigation() {

    const setCurrentStructure = function (value) {
        currentStructure.value = value
        //console.log(currentStructure.value)
    }

    const updateNavigation = function (label, value) {
        navigation.value.filter(item => item.id === currentStructure.value)[0][label] = value
        //console.log(navigation)
    }

    const getCurrentModel = function () {
        return navigation.value.filter(item => item.id === currentStructure.value)[0].model
    }

    const getCurrentChains = function () {
        return navigation.value.filter(item => item.id === currentStructure.value)[0].chain
    }

    return { 
        navigation,
        currentStructure,
        setCurrentStructure,
        updateNavigation,
        getCurrentModel,
        getCurrentChains
    }

}