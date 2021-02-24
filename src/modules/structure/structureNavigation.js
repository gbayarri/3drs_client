import { ref } from 'vue'

const navigation = ref([])
let currentStructure = ref(null)

export default function structureNavigation() {

    const setCurrentStructure = function (value) {
        currentStructure.value = value
        //console.log(currentStructure.value)
    }

    const updateCurrentModel = function (value) {
        navigation.value.filter(item => item.id === currentStructure.value)[0].curr_model = value
    }

    const updateCurrentChains= function (value) {
        //navigation.value.filter(item => item.id === currentStructure.value)[0].curr_model = value
        const cm = getCurrentModel()
        let models = navigation.value.filter(item => item.id === currentStructure.value)[0].models
        models.filter(item => item.id === cm)[0].chains = value
        navigation.value.filter(item => item.id === currentStructure.value)[0].models = models
        //console.log(navigation.value)
    }

    const getCurrentModel = function () {
        //console.log(navigation.value.filter(item => item.id === currentStructure.value)[0].curr_model)
        return navigation.value.filter(item => item.id === currentStructure.value)[0].curr_model
    }

    const getCurrentChains = function () {
        const cm = getCurrentModel()
        //console.log(cm)
        const models = navigation.value.filter(item => item.id === currentStructure.value)[0].models
        //console.log(models.filter(item => item.id === cm)[0].chains)
        return models.filter(item => item.id === cm)[0].chains
    }

    return { 
        navigation,
        currentStructure,
        setCurrentStructure,
        updateCurrentModel,
        updateCurrentChains,
        getCurrentModel,
        getCurrentChains
    }

}