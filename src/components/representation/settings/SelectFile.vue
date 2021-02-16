<template>
    <Dropdown 
    v-model="selectedFile" 
    :options="files" 
    optionLabel="name" 
    placeholder="Select a File" 
    @change="onChange" />
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

        let selectedFile = ref({ name: 'File 3: pdbcode', code: 'pdbcode3' })
        const files = [
                { name: 'File 1: pdbcode', code: 'pdbcode1' },
                { name: 'File 2: pdbcode', code: 'pdbcode2' },
                { name: 'File 3: pdbcode', code: 'pdbcode3' },
                { name: 'File 4: pdbcode', code: 'pdbcode4' },
                { name: 'File 5: pdbcode', code: 'pdbcode5' }
            ]

        const onChange = (e) => {
            console.log(e.value)
        }

        return { selectedFile, files, onChange }
    }
}
</script>

<style>
    .p-dropdown { width:95%; margin:0 2.5%; }
</style>