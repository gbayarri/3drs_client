<template>
    <Dropdown 
    v-model="selectedFile" 
    :options="filesList" 
    optionLabel="name" 
    :placeholder="placeholder"
    :disabled="filesList.length <= 1"
    @change="onChange" />
</template>

<script>
import { ref, computed } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
export default {
    setup() {

        const placeholder = "Select a File"

        const { currentStructure, setCurrentStructure, getFileNames } = structureSettings()
        
        const filesList = computed(() => getFileNames())

        let selectedFile = ref(filesList.value.filter(item => item.id === currentStructure.value)[0])

        const onChange = (e) => {
            setCurrentStructure(e.value.id)
        }

        return { placeholder, selectedFile, filesList, onChange }
    }
}
</script>

<style>
    .p-dropdown { width:95%; margin:0 2.5%; }
</style>