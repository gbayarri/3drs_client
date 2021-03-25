import { ref, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
import drawRepresentation from '@/modules/ngl/drawRepresentation'
//const representations = ref({})
let currentRepresentation = ref(null)

export default function useRepresentations() {

    const { projectData/*, updateStructureProject*/ } = structureStorage()
    const { 
        updateProjectData, 
        createRepresentation, 
        updateRepresentationData, 
        eliminateRepresentation 
    } = useAPI()
    const { addRepresentationToComponent } = drawRepresentation()
    //const defaultRepresentation = computed(() => projectData.value.defaultRepresentation)
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

    const setCurrentRepresentation = async (value, update) => {
        currentRepresentation.value = value
        //console.log(currentRepresentation.value)
        if(update) {
            return await updateProjectData(prjID, { currentRepresentation: currentRepresentation.value })
        }
    }

    const getCurrentRepresentationSettings = () => {
        //console.log(currentRepresentation.value, dataProject.value.representations)
        return dataProject.value.representations.filter(item => item.id === currentRepresentation.value)[0]
    }

    const updateRepresentationProperty = (property, value) => {
        //const settings = dataProject.value.representations.filter(item => item.id === currentRepresentation.value)[0]
        if(typeof property === 'object' && property.length === 3)
            dataProject.value.representations.filter(item => item.id === currentRepresentation.value)[0][property[0]][property[1]][property[2]] = value
        else
            dataProject.value.representations.filter(item => item.id === currentRepresentation.value)[0][property] = value
    }

    // NGL / REST API

    const longTimeOut = 5000
    const shortTimeOut = 500

    const setSelectionRepresentation = async (stage, sele, structures, re, update) => {
        for(const item of stage.getRepresentationsByName(re).list){
            item.setSelection( sele )
        }
        if(update) {
            return await updateRepresentationData(prjID, currentRepresentation.value, { structures: structures })
        }
    }
        

    const setVisibilityRepresentation = async (stage, status, re, update) => {
        //console.log(re)
        for(const item of stage.getRepresentationsByName(re).list){
            //console.log(item.parameters.name)
            item.setVisibility( status )

            // EXAMPLES FOR OTHER SECTIONS!!!
            //item.setParameters( { color: 'chainindex'} )
            //item.setColor( '#f00' )
            //item.dispose()
            
            //OJU QUE AIXÒ NOMÉS SELECCIONA CADENA B
            //item.setSelection( ':B' )
        }
        //console.log(status)
        if(update) {
            return await updateRepresentationData(prjID, currentRepresentation.value, { visible: status })
        }
    }

    const createNewRepresentation = async (value) => {
        return await createRepresentation(prjID, { name: value })
    }

    const setMolecularRepresentation = async (stage, representation, mol_repr, re, update) => {
        //return await createRepresentation(prjID, { name: value })
        for(const item of stage.getRepresentationsByName(re).list){
            // only create one when coming from cartoon + base
            if(item.repr.type !== 'base') {
                // create new
                const name_new = representation.id + "-" + item.parameters.name.split('-')[1]
                const generatedRepresentations = addRepresentationToComponent(representation, item.parent, name_new, item.parameters.sele)
            }
            // remove current representation
            item.parent.removeRepresentation(item)
        }
        //console.log(stage)
        if(update) {
            return await updateRepresentationData(prjID, currentRepresentation.value, { mol_repr: mol_repr })
        }
    }

    let myTimeOutRadius = null
    const setRadiusRepresentation = async (stage, mol_repr, radius, re, update) => {
        for(const item of stage.getRepresentationsByName(re).list) {
            item.setParameters( { radius: radius / 10 } )
        }
        if(update) {
            return await new Promise((resolve) => {
                clearTimeout(myTimeOutRadius)
                myTimeOutRadius = setTimeout(() => {
                    const path = 'radius.' + mol_repr + '.value'
                    const response = updateRepresentationData(prjID, currentRepresentation.value, { [path]: (radius / 10) })
                    resolve(response)
                }, shortTimeOut)
            })
        }
    }

    const setColorSchemeRepresentation = async (stage, color_scheme, color, re, update) => {
        for(const item of stage.getRepresentationsByName(re).list) {
            console.log(color_scheme)
            if(color_scheme === 'uniform') item.setColor( color )
            else item.setColor( color_scheme )
        }
        if(update) {
            return await updateRepresentationData(prjID, currentRepresentation.value, { color_scheme: color_scheme })
        }
    }

    let myTimeOutColor = null
    const setColorRepresentation = async (stage, color, re, update) => {
        for(const item of stage.getRepresentationsByName(re).list) {
            item.setColor( color )
        }
        if(update) {
            return await new Promise((resolve) => {
                clearTimeout(myTimeOutColor)
                myTimeOutColor = setTimeout(() => {
                    const response = updateRepresentationData(prjID, currentRepresentation.value, { color: color })
                    resolve(response)
                }, shortTimeOut)
            })
        }
    }
    
    let myTimeOutOpacity = null
    const setOpacityRepresentation = async (stage, opacity, re, update) => {
        for(const item of stage.getRepresentationsByName(re).list) {
            //console.log(opacity/100)
            item.setParameters( { opacity: (opacity / 100) } )
        }
        if(update) {
            return await new Promise((resolve) => {
                clearTimeout(myTimeOutOpacity)
                myTimeOutOpacity = setTimeout(() => {
                    const response = updateRepresentationData(prjID, currentRepresentation.value, { opacity: (opacity / 100) })
                    resolve(response)
                }, shortTimeOut)
            })
        }
    }

    const deleteRepresentation = async (value) => {
        return await eliminateRepresentation(prjID, value )
    }

    // HIERARCHY

    // TODO!!!!
    const getHierarchy = (selections, filesList) => {
        const sel = selections.value
        const defRepr = dataProject.value.defaultRepresentation
        const allRepresentations = dataProject.value.representations
        const hierarchy = []
        for(const repr of allRepresentations) {

            var level1 = {
                key: repr.id,
                label: repr.name + ' [ '+ repr.mol_repr + ' / ' + repr.color_scheme + ' ]',
                data: repr.id,
                icon: 'fas fa-paint-brush',
                styleClass: '',
                children: []
            }

            if(repr.id === defRepr) {
                level1.label = repr.name
                level1.styleClass = 'default-class'
            } else {

                const allStructures = sel.filter(item => (item.id === repr.id))[0].structures

                for(const str of allStructures) {

                    var level2 = {
                        key: repr.id + '-' + str.id,
                        label: filesList.value.filter(item => item.id === str.id)[0].name,
                        data: str.id,
                        icon: 'fas fa-dna',
                        styleClass: '',
                        children: []
                    }

                    const allMolecules = str.selection.molecules

                    for(const mol of allMolecules) {
                        
                        var level3 = {
                            key: repr.id + '-' + str.id + '-' + mol.num + ':' + mol.chain + '/' + (mol.model + 1),
                            // TO FIX
                            label: 'Model ' + (mol.model + 1) + ' - Chain ' + mol.name,
                            data: 'Model ' + (mol.model + 1) + ' - Chain ' + mol.name,
                            icon: 'fas fa-share-alt',
                            styleClass: '',
                        }

                        level2.children.push(level3)

                    }

                    if(!level2.children.length) level2.styleClass = 'default-class'

                    level1.children.push(level2)
                }
            }

            hierarchy.push(level1)
        }

        //console.log(selections.value)

        return hierarchy
    }

    return { 
        //representations, 
        currentRepresentation,
        defaultRepresentation,
        getRepresentationNames,
        setCurrentRepresentation,
        getCurrentRepresentationSettings,
        updateRepresentationProperty,
        setSelectionRepresentation,
        setVisibilityRepresentation,
        setMolecularRepresentation,
        setOpacityRepresentation,
        createNewRepresentation,
        setRadiusRepresentation,
        setColorSchemeRepresentation,
        setColorRepresentation,
        deleteRepresentation,
        getHierarchy
    }

}