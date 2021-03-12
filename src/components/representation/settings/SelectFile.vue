<template>
    <Dropdown 
    v-model="selectedFile" 
    :options="filesList" 
    optionLabel="name" 
    :placeholder="placeholder"
    :disabled="filesList.length <= 1"
    @show="onShow">
        <template #value="slotProps">
            <div v-if="slotProps.value">
                <div>{{slotProps.value.name}}</div>
            </div>
            <span v-else>
                {{slotProps.placeholder}}
            </span>
        </template>
        <template #option="slotProps">
            <div>
                <div 
                @mouseover="onHover(slotProps.option.id)"
                @mouseleave="onLeave(slotProps.option.id)">{{slotProps.option.name}}</div>
            </div>
        </template>
    </Dropdown>
</template>

<script>
import { computed } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage
        const placeholder = "Select a File"

        const { currentStructure, setCurrentStructure, getFileNames } = structureSettings()
        const { projectData } = structureStorage()
        const { updateProjectData } = useAPI()
        
        const dataProject = computed(() => projectData.value)
        const filesList = computed(() => getFileNames())
        const currStr = computed(() => currentStructure.value)
        
        let doHover = true

        const selectedFile = computed({
            get: () => filesList.value.filter(item => item.id === currStr.value)[0],
            set: val => change(val)
        })

        const change = (value) => {
            doHover = false
            setCurrentStructure(value.id)
            updateProjectData(dataProject.value._id, { currentStructure: value.id })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
            stage.getComponentsByName(value.id).list[0].annotationList[0].setVisibility(false)
        }

        const onShow = () => doHover = true

        const onHover = (value) => {
            if(doHover) {
                /*const comp = stage.getComponentsByName(value).list[0]
                const elm = document.createElement("div")
                elm.innerText = filesList.value.filter(item => item.id === comp.parameters.name)[0].name
                elm.style.fontSize = "25px"
                elm.style.color = "#fff"
                elm.style.background = "rgba(0, 0, 0, .8)"
                elm.style.padding = "15px 20px"
                const an = comp.addAnnotation(comp.structure.getAtomProxy(), elm)
                an.setVisibility(true)
                an.updateVisibility()
                console.log(an)*/

                // TRY TO CREATE AND REMOVE EVERY TIME???
                const comp = stage.getComponentsByName(value).list[0]
                const an = comp.annotationList[0]
                const elm = an.element
                // fill annotation here because of the issues with setVisibility 
                elm.innerText = filesList.value.filter(item => item.id === comp.parameters.name)[0].name
                elm.style.fontSize = "25px"
                elm.style.color = "#fff"
                elm.style.background = "rgba(0, 0, 0, .8)"
                elm.style.padding = "15px 20px"
                an.setVisibility(true)
            }
        }

        const onLeave = (value) => {
            //console.log(stage.getComponentsByName(value).list[0].annotationList[0])
            stage.getComponentsByName(value).list[0].annotationList[0].setVisibility(false)
            //stage.getComponentsByName(value).list[0].annotationList[0].dispose()
        }

        return { placeholder, selectedFile, filesList, onShow, onHover, onLeave }
    }
}
</script>

<style>
    .p-dropdown { width:95%; margin:0 2.5%; }
</style>