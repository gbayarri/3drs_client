import { ref, computed } from 'vue'
//import globals from '@/globals'
import useStage from '@/modules/ngl/useStage'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
import drawRepresentation from '@/modules/ngl/drawRepresentation'
//const representations = ref({})
let currentRepresentation = ref(null)

export default function useRepresentations() {

    const { arrayToVector3 } = useStage()
    const { projectData/*, updateStructureProject*/ } = structureStorage()
    const { 
        updateProjectData, 
        createRepresentation, 
        cloneRepresentation,
        updateRepresentationData, 
        eliminateRepresentation 
    } = useAPI()
    const { addRepresentationToComponent } = drawRepresentation()
    //const defaultRepresentation = computed(() => projectData.value.defaultRepresentation)
    const defaultRepresentation = projectData.value.defaultRepresentation
    let prjID = projectData.value._id

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
        //console.log(property, value)
        if(typeof property === 'object' && property.length === 3)
            dataProject.value.representations.filter(item => item.id === currentRepresentation.value)[0][property[0]][property[1]][property[2]] = value
        else
            dataProject.value.representations.filter(item => item.id === currentRepresentation.value)[0][property] = value
    }

    const setNameRepresentation = async (stage, name, update) => {
        //if(getCurrentRepresentationSettings().label) updateAnnotationText(stage, name)
        if(update) {
            return await updateRepresentationData(prjID, currentRepresentation.value, { name: name })
        }
    }

    // NGL / REST API

    const longTimeOut = 5000
    const shortTimeOut = 500

    // NOT UPDATING PROPERLY??????
    const setSelectionRepresentation = async (stage, sele, structures, re, update) => {
        //console.log(stage.getRepresentationsByName(re))
        /*for(const item of stage.getRepresentationsByName(re).list){
            item.setSelection( sele )
            console.log(sele, item.parameters)
        }*/
        //console.log(stage)
        stage.getRepresentationsByName(re).list.forEach(function( item ){
            item.setSelection( sele )
            //console.log(sele, item)
        })
        if(update) {
            if(prjID === undefined) prjID = dataProject.value._id
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

    const cloneNewRepresentation = async (value) => {
        return await cloneRepresentation(prjID, { id: value })
    }

    const setMolecularRepresentation = async (stage, representation, mol_repr, re, strSel, update) => {
        //console.log(strSel)
        //return await createRepresentation(prjID, { name: value })
        for(const item of stage.getRepresentationsByName(re).list){
            // only create one when coming from cartoon + base
            if(item.repr.type !== 'base') {
                // get current selection
                const strName = item.parameters.name.split("-")[1]
                //const sele = strSel.filter(item => item.id === strName)[0].selection.string
                const sele = 
                            strSel.filter(item => item.id === strName)[0].selection.custom === "" ? 
                            strSel.filter(item => item.id === strName)[0].selection.string :
                            strSel.filter(item => item.id === strName)[0].selection.custom
                // create new
                const name_new = representation.id + "-" + item.parameters.name.split('-')[1]
                const generatedRepresentations = addRepresentationToComponent(representation, item.parent, name_new, sele)
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

    const updateAnnotationProperty = (stage, representation) => {
        
        /*const color = representation.color_scheme === 'uniform' ? 
                        representation.color : 
                        globals.colorScheme.filter(item => item.id === representation.color_scheme)[0].color*/
        stage.eachComponent( ( component ) => {
            component.eachAnnotation( (annotation) => {
                if(annotation.id === currentRepresentation.value) {
                    annotation.position = arrayToVector3(representation.label.position)
                    annotation.element.innerHTML = `<div style="color: rgb(255, 255, 255); 
                    background-color: ${hex2rgba(representation.label.color, .5)}; 
                    padding: 15px; font-size: ${representation.label.size}px; 
                    text-shadow: rgb(0, 0, 0) -1px 1px 0px, rgb(0, 0, 0) 1px 1px 0px, rgb(0, 0, 0) 1px -1px 0px, rgb(0, 0, 0) -1px -1px 0px;">
                        ${representation.label.name}
                    </div>`
                }
            })
            /*const re = new RegExp('(' + currentRepresentation.value + '\-' + component.parameters.name + '\-[a-z]*)', 'g')
            for(const item of stage.getRepresentationsByName(re).list) {
                if(item.parameters.sele !== 'not(*)') createAnnotation(component, item.parameters.sele, representation, component.structure.id)
            }*/
        })
    }

    /*const updateAnnotationText = (stage, text) => {
        stage.eachComponent( ( component ) => {
            component.eachAnnotation( (annotation) => {
                if(annotation.id === currentRepresentation.value) {
                    console.log(annotation)
                    annotation.element.innerHTML = `<div style="color: rgb(255, 255, 255); 
                    background-color: rgba(117, 117, 117, .5); 
                    padding: 15px; font-size: 25px; 
                    text-shadow: rgb(0, 0, 0) -1px 1px 0px, rgb(0, 0, 0) 1px 1px 0px, rgb(0, 0, 0) 1px -1px 0px, rgb(0, 0, 0) -1px -1px 0px;">
                        ${annotation.element.innerText.split('-')[0]} - ${text}
                    </div>`
                }
            })
        })
    }*/

    const setColorSchemeRepresentation = async (stage, color_scheme, color, re, representation, update) => {
        for(const item of stage.getRepresentationsByName(re).list) {
            //console.log(color_scheme)
            if(color_scheme === 'uniform') item.setColor( color )
            else item.setColor( color_scheme )
        }
        //if(representation.label) updateAnnotationColor(stage, representation)
        if(update) {
            return await updateRepresentationData(prjID, currentRepresentation.value, { color_scheme: color_scheme })
        }
    }

    let myTimeOutColor = null
    const setColorRepresentation = async (stage, color, re, representation, update) => {
        for(const item of stage.getRepresentationsByName(re).list) {
            item.setColor( color )
        }
        if(update) {
            return await new Promise((resolve) => {
                clearTimeout(myTimeOutColor)
                myTimeOutColor = setTimeout(() => {
                    //if(representation.label) updateAnnotationColor(stage, representation)
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

    const hex2rgba = (hex, alpha) => {
        const validHEXInput = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        if (!validHEXInput) return false
        const  output = {
            r: parseInt(validHEXInput[1], 16),
            g: parseInt(validHEXInput[2], 16),
            b: parseInt(validHEXInput[3], 16),
            a: alpha
        }
        return `rgba(${output.r}, ${output.g}, ${output.b}, ${output.a})`;
    }

    const createAnnotation = (component, selection, representation) => {

        const ap = representation.label.position === null ? component.getCenterUntransformed(selection) : arrayToVector3(representation.label.position)

        const elm = document.createElement("div")
            elm.innerText = representation.label.name
            elm.style.color = "#fff"
            elm.style.backgroundColor = hex2rgba(representation.label.color, .5)
            elm.style.padding = "15px"
            elm.style.fontSize = representation.label.size + "px"
            elm.style.textShadow =  '-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000'

        const ann = component.addAnnotation(ap, elm)
        ann.id = representation.id

        return ap.toArray()

    }

    let myTimeOutLabel = null
    const setLabelProperty = async (stage, representation, update) => {
        updateAnnotationProperty(stage, representation)
        if(update) {
            return await new Promise((resolve) => {
                clearTimeout(myTimeOutLabel)
                myTimeOutLabel = setTimeout(() => {
                    const response = updateRepresentationData(prjID, currentRepresentation.value, { label: representation.label })
                    resolve(response)
                }, shortTimeOut)
            })
            
        }
    }

    const setLabelPosition = async (stage, representation, update) => {
        stage.eachComponent( ( component ) => {

            component.eachAnnotation( (annotation) => {
                if(annotation.id === currentRepresentation.value) {
                    component.removeAnnotation(annotation)
                }
            })

            const re = new RegExp('(' + currentRepresentation.value + '\-' + component.parameters.name + '\-[a-z]*)', 'g')
            let c = 0
            for(const item of stage.getRepresentationsByName(re).list) {
                if(item.parameters.sele !== 'not(*)' && c === 0) {
                    representation.label.position = createAnnotation(component, item.parameters.sele, representation)
                    c ++
                }
            }

        })
        if(update) {
            if(prjID === undefined) prjID = dataProject.value._id
            return await updateRepresentationData(prjID, currentRepresentation.value, { label: representation.label })
        }
    }

    const setLabelRepresentation = async (stage, representation, update) => {

        if(representation.label.visible) {
            stage.eachComponent( ( component ) => {
                const re = new RegExp('(' + currentRepresentation.value + '\-' + component.parameters.name + '\-[a-z]*)', 'g')
                let c = 0
                for(const item of stage.getRepresentationsByName(re).list) {
                    if(item.parameters.sele !== 'not(*)' && c === 0) {
                        representation.label.position = createAnnotation(component, item.parameters.sele, representation)
                        c ++
                    }
                }
            })
        } else {
            stage.eachComponent( ( component ) => {
                component.eachAnnotation( (annotation) => {
                    if(annotation.id === currentRepresentation.value) {
                        component.removeAnnotation(annotation)
                    }
                })
            })
        }
        if(update) {
            return await updateRepresentationData(prjID, currentRepresentation.value, { label: representation.label })
        }

    }

    const removeAnnotation = (stage) => {
        stage.eachComponent( ( component ) => {
            component.eachAnnotation( (annotation) => {
                if(annotation.id === currentRepresentation.value) {
                    component.removeAnnotation(annotation)
                }
            })
        })
    }

    const deleteRepresentation = async (stage, value) => {

        if(getCurrentRepresentationSettings().label) removeAnnotation(stage)

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

                    //console.log(allMolecules)

                    for(const mol of allMolecules) {
                        const name = mol.name === undefined ? mol.chain + ': ' + mol.num : mol.name
                        var level3 = {
                            key: repr.id + '-' + str.id + '-' + mol.num + ':' + mol.chain + '/' + (mol.model + 1),
                            // TO FIX
                            label: 'Model ' + (mol.model + 1) + ' - Chain ' + name,
                            data: 'Model ' + (mol.model + 1) + ' - Chain ' + name,
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
        setNameRepresentation,
        setSelectionRepresentation,
        setVisibilityRepresentation,
        setMolecularRepresentation,
        setOpacityRepresentation,
        setLabelProperty,
        setLabelPosition,
        setLabelRepresentation,
        createNewRepresentation,
        cloneNewRepresentation,
        setRadiusRepresentation,
        setColorSchemeRepresentation,
        setColorRepresentation,
        deleteRepresentation,
        getHierarchy,
        createAnnotation
    }

}