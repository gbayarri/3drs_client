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
        v-tooltip.top="ttpcf"
        @click="centerFile"  />

        <Button 
        :icon="customEnabled ? 'fas fa-user-edit' : 'fas fa-user-cog'" 
        id="btn-custom"
        class="p-button-rounded p-button-text"
        v-tooltip.left="ttpcs"
        @click="customSelection" />
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
//import structureStorage from '@/modules/structure/structureStorage'
import structureSettings from '@/modules/structure/structureSettings'
import useSettings from '@/modules/settings/useSettings'
import useSelections from '@/modules/representations/useSelections'
import useRepresentations from '@/modules/representations/useRepresentations'
import useFlags from '@/modules/common/useFlags'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage
        //const { projectData } = structureStorage()
        const { currentStructure/*, getNumStructures*/ } = structureSettings()
        const { setPositionSettings } = useSettings()
        const { flags, setFlagStatus } = useFlags()
        const { checkSelectionType, getCurrentSelection } = useSelections()
        const { currentRepresentation } = useRepresentations()

        const customEnabled = computed(() => flags.customEnabled)
        //const dataProject = computed(() => projectData.value)
        const currReprVal = computed(() => currentRepresentation.value)
        const currStr = computed(() => currentStructure.value)

        const page = reactive({
            //ttprf: "Remove structure (double click)",
            ttpcf: "Center structure",
            ttpcs: computed(() => flags.customEnabled ? 'Switch to manual selection' : 'Switch to custom selection' )
        })

        // REMOVE STRUCTURE 
        /*const numStructures = getNumStructures()

        const removeFile = () => {
            console.log("removing file " + currStr.value)
        }*/

        // CENTER STRUCTURE
        const centerFile = () => {
            const component = stage.compList.filter(item => item.parameters.name === currStr.value)[0]
            const sel_type = (checkSelectionType(currReprVal.value, currStr.value) === 'custom') ? 'custom' : 'string'
            let sele = getCurrentSelection(currReprVal.value, currStr.value, sel_type)
            if(sele === 'not(*)') sele = '*'
            component.autoView(sele, 500)
            setPositionSettings(stage)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        // CUSTOM
        const customSelection = () => {
            setFlagStatus('customEnabled', !customEnabled.value)
            // TODO????
            //if(!flags.customEnabled) console.log('redraw!!!')
        }

        return { 
            ...toRefs(page),
            /*numStructures, removeFile,*/
            customEnabled,
            centerFile,
            customSelection
        }
    }
}
</script>

<style>
    #file-buttons { margin-left: 2.5%; width: 95%; margin-bottom:0px; }
    #file-buttons button { height: 1.8rem; width: 1.8rem; font-size: 13px; color:#fff; }

    #file-buttons button {
        height: 1.6rem;
        width: 1.6rem;
        font-size: 12px;
        padding:0; 
        margin: .3rem 0 0 .1rem;
        background:transparent;
        border-color: #fff; 
    }
    #file-buttons button:hover { background: #546974;}

    #btn-custom { 
        position:absolute; 
        right:.5rem; 
    }
</style>