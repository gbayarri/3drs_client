<template>
    <div id="file-buttons" class="margin-top-5">
        <Button 
        icon="far fa-trash-alt" 
        class="p-button-rounded p-button-text" 
        v-on:dblclick="removeFile"
        v-tooltip.top="page.ttprf" 
        v-if="numStructures > 1" />
        <!-- NOT SURE ABOUT THIS BUTTON -->
        <!--<Button 
        icon="fas fa-eye" 
        class="p-button-rounded p-button-text" 
        v-tooltip.top="ttphf"
        @click="hideFile"  />-->
        <Button 
        icon="fas fa-bullseye" 
        class="p-button-rounded p-button-text" 
        v-tooltip.top="page.ttpcf"
        @click="centerFile"  />
    </div>
</template>

<script>
import { computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import structureSettings from '@/modules/structure/structureSettings'
import useAPI from '@/modules/api/useAPI'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage
        const { projectData } = structureStorage()
        const { currentStructure, getNumStructures } = structureSettings()
        const { updateProjectData } = useAPI()

        const dataProject = computed(() => projectData.value)
        const currStr = computed(() => currentStructure.value)

        const page = {
            ttprf: "Remove structure (double click)",
            ttpcf: "Center structure"
        }

        // REMOVE STRUCTURE 
        const numStructures = getNumStructures()

        const removeFile = () => {
            console.log("removing file " + currStr.value)
        }

        // HIDE STRUCTURE
        /*let ttphf = ref("Hide structure")
        const hideFile = () => {
            console.log("hiding file " + currStr.value)
        }*/

        // CENTER STRUCTURE
        const autoSaveOrientation = function(orientation) {
            updateProjectData(dataProject.value._id, { orientation: orientation })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        const centerFile = () => {
            const component = stage.compList.filter(item => item.parameters.name === currStr.value)[0]
            component.autoView(500)
            setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), 1000)
        }

        return { 
            page,
            numStructures, removeFile,
            //ttphf, hideFile,
            centerFile
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