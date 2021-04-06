<template>
    <div id="file-buttons" class="margin-top-5">
        <!--<Button 
        icon="far fa-trash-alt" 
        class="p-button-rounded p-button-text" 
        v-on:dblclick="removeFile"
        v-tooltip.top="page.ttprf" 
        v-if="numStructures > 1" />-->
        <Button 
        icon="fas fa-bullseye" 
        class="p-button-rounded p-button-text" 
        v-tooltip.top="page.ttpcf"
        @click="centerFile"  />
    </div>
</template>

<script>
import { computed } from 'vue'
//import structureStorage from '@/modules/structure/structureStorage'
import structureSettings from '@/modules/structure/structureSettings'
import useSettings from '@/modules/settings/useSettings'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage
        //const { projectData } = structureStorage()
        const { currentStructure, getNumStructures } = structureSettings()
        const { setPositionSettings } = useSettings()

        //const dataProject = computed(() => projectData.value)
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

        const centerFile = () => {
            const component = stage.compList.filter(item => item.parameters.name === currStr.value)[0]
            component.autoView(500)
            setPositionSettings(stage)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        return { 
            page,
            numStructures, removeFile,
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