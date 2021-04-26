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
import useRepresentations from '@/modules/representations/useRepresentations'
import useSelections from '@/modules/representations/useSelections'
import useAPI from '@/modules/api/useAPI'
import useFlags from '@/modules/common/useFlags'
import useTrajectories from '@/modules/ngl/useTrajectories'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage
        const placeholder = "Select a File"

        const { currentRepresentation } = useRepresentations()
        const { currentStructure, setCurrentStructure, getFileNames, getTrajectorySettings } = structureSettings()
        const { projectData } = structureStorage()
        const { updateProjectData } = useAPI()
        const { checkSelectionType } = useSelections()
        const { setFlagStatus } = useFlags()
        const { setCurrentFrame } = useTrajectories()
        
        const dataProject = computed(() => projectData.value)
        const filesList = computed(() => getFileNames())
        const currReprVal = computed(() => currentRepresentation.value)
        const currStr = computed(() => currentStructure.value)
        const currTraj = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0].trajList[0])
        const rangeSettings = computed(() => getTrajectorySettings().range[0])

        const doHover = ref(true)

        const selectedFile = computed({
            get: () => filesList.value.filter(item => item.id === currStr.value)[0],
            set: val => change(val)
        })

        const change = (value) => {
            doHover.value = false
            setCurrentStructure(value.id)
            // check if currStr has custom selection or not and modify flags.customEnabled
            const sel_type = checkSelectionType(currReprVal.value, currStr.value)
            setFlagStatus('customEnabled', (sel_type === 'custom'))
            updateProjectData(dataProject.value._id, { currentStructure: value.id })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
            const re = value + '-all'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }

            //********************************* */
            // ??????????????????????????????
            //console.log(currTraj.value, rangeSettings.value, currStr.value)
            //setCurrentFrame(currTraj.value, rangeSettings.value, currStr.value)
            // ??????????????????????????????
            //********************************* */
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