<template>
  <Button icon="fas fa-sync-alt" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
import { computed } from 'vue'
import mouseObserver from '@/modules/ngl/mouseObserver'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
export default {
  props: ['stage'],
  setup(props) {
    //const initialOrientation = mouseObserver().initialOrientation.value
    const { initialOrientation } = mouseObserver()
    const { projectData } = structureStorage()
    const { updateProjectData } = useAPI()

    const initOr = computed(() => initialOrientation)
    const dataProject = computed(() => projectData.value)

    const ttp = "Reload representation"

    const stage = props.stage

    const autoSaveOrientation = function(orientation) {
        updateProjectData(dataProject.value._id, { orientation: orientation })
            .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
            })
    }

    const handleClick = () => {
      //console.log(initOr.value.value.elements)
      //stage.animationControls.orient(initOr.elements, 500);
      stage.animationControls.orient(initOr.value.value.elements, 500);
      setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), 1000)
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>