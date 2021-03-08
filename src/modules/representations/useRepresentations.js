import { ref, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
const representations = ref({})
let currentRepresentation = ref(null)

export default function useRepresentations() {

    const { projectData, updateProject } = structureStorage()
    const { 
        updateProjectData, 
        createRepresentation, 
        updateRepresentationData, 
        eliminateRepresentation 
    } = useAPI()
    const defaultRepresentation = projectData.value.defaultRepresentation
    const prjID = projectData.value._id

    const dataProject = computed(() => projectData.value)

    // NAVIGATION

    const getRepresentationNames = () => {
        const names = []
        for(const item of dataProject.value.representations) {
            names.push({
                name: item.name,
                id: item.id
            })
        }
        return names
    }

    const setCurrentRepresentation = (value, update) => {
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

    const getCurrentRepresentationSettings = () => {
        return dataProject.value.representations.filter(item => item.id === currentRepresentation.value)[0]
    }

    const updateRepresentationProperty = (property, value) => {
        //const settings = dataProject.value.representations.filter(item => item.id === currentRepresentation.value)[0]
        dataProject.value.representations.filter(item => item.id === currentRepresentation.value)[0][property] = value
    }

    const removeRepresentationFromStructure = (value) => {
        projectData.value.representations = projectData.value.representations.filter(item => item.id !== value)
    }

    // NGL / REST API

    const longTimeOut = 5000
    const shortTimeOut = 500

    const setVisibilityRepresentation = async (stage, status, re, update) => {
        //console.log(re)
        for(const item of stage.getRepresentationsByName(re).list){
            //console.log(item)
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
            return await updateRepresentationData(prjID, currentRepresentation.value, { visible: status })
        }
    }

    const createNewRepresentation = async (value) => {
        return await createRepresentation(prjID, { name: value })
    }

    // TODO
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

    // TODO
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

    // TODO
    /*const later = (delay, value) => {
        let timer = 0;
        let reject = null;
        const promise = new Promise((resolve, _reject) => {
            reject = _reject;
            timer = setTimeout(resolve, delay, value);
        });
        return {
            get promise() { return promise; },
            cancel() {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                    reject();
                    reject = null;
                }
            }
        };
    };
    const l1 = later(2000, "l1");
        l1.promise
          .then(msg => { console.log(msg); })
          .catch(() => { console.log("l1 cancelled"); });*/
    
    let myTimeOutOpacity = null
    const setOpacityRepresentation = async (stage, opacity, re, update) => {
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

    const deleteRepresentation = async (value) => {
        return await eliminateRepresentation(prjID, value )
    }

    return { 
        representations, 
        currentRepresentation,
        defaultRepresentation,
        getRepresentationNames,
        setCurrentRepresentation,
        getCurrentRepresentationSettings,
        updateRepresentationProperty,
        removeRepresentationFromStructure,
        setVisibilityRepresentation,
        setOpacityRepresentation,
        createNewRepresentation,
        setRadiusRepresentation,
        setColorRepresentation,
        deleteRepresentation
    }

}