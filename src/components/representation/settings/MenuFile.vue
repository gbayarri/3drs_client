<template>
    <div id="file-buttons" class="margin-top-5">
        <Button 
        icon="far fa-trash-alt" 
        class="p-button-rounded p-button-text" 
        v-on:dblclick="removeFile"
        v-tooltip.top="ttprf" 
        v-if="numStructures > 1" />
        <Button 
        icon="fas fa-eye" 
        class="p-button-rounded p-button-text" 
        v-tooltip.top="ttphf"
        @click="hideFile"  />
        <Button 
        icon="fas fa-bullseye" 
        class="p-button-rounded p-button-text" 
        v-tooltip.top="ttpcf"
        @click="centerFile"  />
    </div>
</template>

<script>
import { ref } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
export default {
    setup() {

        const { currentStructure, getNumStructures } = structureSettings()

        // REMOVE STRUCTURE 
        const ttprf = "Remove structure (double click)"
        const numStructures = getNumStructures()

        const removeFile = () => {
            console.log("removing file " + currentStructure.value)
        }

        // HIDE STRUCTURE
        let ttphf = ref("Hide structure")
        const hideFile = () => {
            console.log("hiding file " + currentStructure.value)
        }

        // CENTER STRUCTURE
        let ttpcf = ref("Center structure")
        const centerFile = () => {
            console.log("centering file " + currentStructure.value)
        }

        return { 
            ttprf, numStructures, removeFile,
            ttphf, hideFile,
            ttpcf, centerFile
        }
    }
}
</script>

<style>
    #file-buttons { margin-left: 2.5%; width: 95%; margin-bottom:0px; }
    #file-buttons button { height: 1.8rem; width: 1.8rem; font-size: 13px; color:#fff; }

    #file-buttons button {
        height: 1.5rem;
        width: 1.5rem;
        font-size: 13px;
        margin: .3rem 0 0 .1rem;
        background:transparent;
        border:none;
    }
    #file-buttons button:hover { background: #546974;}
</style>