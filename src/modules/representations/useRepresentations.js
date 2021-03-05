import { ref, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
const representations = ref({})
let currentRepresentation = ref(null)

export default function useRepresentations() {

    const { projectData, updateProject } = structureStorage()
    const { updateProjectData, createRepresentation, updateRepresentationData } = useAPI()
    const defaultRepresentation = projectData.value.defaultRepresentation

    const prjID = projectData.value._id

    // NAVIGATION

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

    const setCurrentRepresentation = function (value, update) {
        currentRepresentation.value = value
        //console.log(currentRepresentation.value)
        if(update) {
            updateProjectData(prjID, { currentRepresentation: currentRepresentation.value })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
    }

    const getCurrentRepresentationSettings = function () {
        return projectData.value.representations.filter(item => item.id === currentRepresentation.value)[0]
    }

    const updateRepresentationProperty= function (property, value) {
        //const settings = projectData.value.representations.filter(item => item.id === currentRepresentation.value)[0]
        projectData.value.representations.filter(item => item.id === currentRepresentation.value)[0][property] = value
    }

    // NGL / REST API

    const longTimeOut = 5000
    const shortTimeOut = 500

    const setVisibilityRepresentation = function (stage, status, re, update) {
        for(const item of stage.getRepresentationsByName(re).list){
            item.setVisibility( status )

            // EXAMPLES FOR OTHER SECTIONS!!!
            //item.setParameters( { color: 'chainindex'} )
            //item.setColor( '#f00' )
            //item.dispose()

            // TRICKY WAY TO CHANGE RESPRESENTATION TYPE????
            //item.parent.addRepresentation("ball+stick", { name: "ligand_1", sele: "*",  radius: .4, aspectRatio: 1.5 } )
            //item.parent.removeRepresentation(item)
            //item.setRepresentation( 'cartoon' )
            
            //OJU QUE AIXÒ NOMÉS SELECCIONA CADENA B
            //item.setSelection( ':B' )
            //item.setParameters( { opacity: 0.5} )
        }
        //console.log(status)
        if(update) {
            updateRepresentationData(prjID, currentRepresentation.value, { visible: status })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
    }

    const createNewRepresentation = function(value) {
        createRepresentation(prjID, { name: value } )
            .then((r) => {
                if(r.code != 404) {
                    // insert new representation to projectData
                    let dp = projectData.value
                    dp.representations.push(r.representation)
                    updateProject(dp)
                    setCurrentRepresentation(r.representation.id, true)
                    console.log(r.message)
                } else {
                    console.error(r.message)
                }
            })
    }

    let myTimeOutRadius = null
    const setRadiusRepresentation = function (stage, radius, re) {
        for(const item of stage.getRepresentationsByName(re).list) {
            item.setParameters( { radius: (radius / 100) } )
        }
        clearTimeout(myTimeOutRadius)
        myTimeOutRadius = setTimeout(() => {
            updateRepresentationData(prjID, currentRepresentation.value, { radius: (radius / 100) })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }, longTimeOut)
    }

    let myTimeOutColor = null
    const setColorRepresentation = function (stage, color, re) {
        for(const item of stage.getRepresentationsByName(re).list) {
            item.setColor( color )
        }
        clearTimeout(myTimeOutColor)
        myTimeOutColor = setTimeout(() => {
            updateRepresentationData(prjID, currentRepresentation.value, { color: color })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }, longTimeOut)
    }

    let myTimeOutOpacity = null
    const setOpacityRepresentation = function (stage, opacity, re, update) {
        for(const item of stage.getRepresentationsByName(re).list) {
            item.setParameters( { opacity: (opacity / 100) } )
        }
        if(update) {
            clearTimeout(myTimeOutOpacity)
            myTimeOutOpacity = setTimeout(() => {
                updateRepresentationData(prjID, currentRepresentation.value, { opacity: (opacity / 100) })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
            }, shortTimeOut)
        }
    }

    return { 
        representations, 
        currentRepresentation,
        defaultRepresentation,
        getRepresentationNames,
        setCurrentRepresentation,
        getCurrentRepresentationSettings,
        updateRepresentationProperty,
        setVisibilityRepresentation,
        setOpacityRepresentation,
        createNewRepresentation,
        setRadiusRepresentation,
        setColorRepresentation
    }

}