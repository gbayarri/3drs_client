<template>
    <!--<Dropdown 
    v-model="selectedFile" 
    :options="filesList" 
    optionLabel="name" 
    :placeholder="placeholder"
    :disabled="filesList.length <= 1"
    @change="onChange" />-->

    <Dropdown 
    v-model="selectedFile" 
    :options="filesList" 
    optionLabel="name" 
    :placeholder="placeholder"
    :disabled="filesList.length <= 1">
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
import { ref, computed } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
export default {
    setup() {

        const placeholder = "Select a File"

        const { currentStructure, setCurrentStructure, getFileNames } = structureSettings()
        
        const filesList = computed(() => getFileNames())
        //console.log(filesList.value)

        //let selectedFile = ref(filesList.value.filter(item => item.id === currentStructure.value)[0])
        const selectedFile = computed({
            get: () => filesList.value.filter(item => item.id === currentStructure.value)[0],
            set: val => setCurrentStructure(val.id)
        })

        /*const change = (e) => {
            console.log(e.value.id)
            setCurrentStructure(e.value.id)
        }*/

        const onHover = (value) => {
            console.log('hover', value)
        }

        const onLeave = (value) => {
            console.log('leave', value)
        }

        return { placeholder, selectedFile, filesList, /*onChange,*/ onHover, onLeave }
    }
}
</script>

<style>
    .p-dropdown { width:95%; margin:0 2.5%; }
</style>