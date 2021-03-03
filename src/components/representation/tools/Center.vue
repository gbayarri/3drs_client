<template>
  <Button icon="fas fa-bullseye" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
import { computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
export default {
  props: ['stage'],
  setup(props) {

    const { projectData } = structureStorage()
    const { updateOrientation } = useAPI()

    const dataProject = computed(() => projectData.value)

    const ttp = "Center representation"
    const stage = props.stage

    const autoSaveOrientation = function(orientation) {
        updateOrientation(dataProject.value._id, orientation)
            .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
            })
    }

    const handleClick = () => {
      stage.autoView(500)
      setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), 500)
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>