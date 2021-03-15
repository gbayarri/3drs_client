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
                <div 
                @mouseover="onHover(slotProps.option.id)"
                @mouseleave="onLeave(slotProps.option.id)">{{slotProps.option.name}}</div>
        </template>
    </Dropdown>
</template>

<script>
import { computed, ref } from 'vue'
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

        const doHover = ref(true)

        const selectedFile = computed({
            get: () => filesList.value.filter(item => item.id === currStr.value)[0],
            set: val => change(val)
        })

        const change = (value) => {
            doHover.value = false
            setCurrentStructure(value.id)
            updateProjectData(dataProject.value._id, { currentStructure: value.id })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
            const re = value + '-all'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
        }

        const onShow = () => doHover.value = true

        const onHover = (value) => {
            if(doHover.value) {
                const comp = stage.getComponentsByName(value).list[0]
                const new_name = value + '-all'
                comp.addRepresentation( "spacefill", { 
                    name: new_name,
                    sele: '*', 
                    opacity:.15, 
                    radius:1,
                    color:'#5E738B'
                })
            }
        }

        const onLeave = (value) => {
            const re = value + '-all'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
        }

        return { placeholder, selectedFile, filesList, onShow, onHover, onLeave }
    }
}
</script>

<style>
    .p-dropdown { width:95%; margin:0 2.5%; }
</style>