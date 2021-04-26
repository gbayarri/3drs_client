<template>
  <Button icon="fas fa-bullseye" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
import { computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
import useFlags from '@/modules/common/useFlags'
export default {
  props: ['stage'],
  setup(props) {

    const { projectData } = structureStorage()
    const { updateProjectData } = useAPI()
    const { flags } = useFlags()

    const dataProject = computed(() => projectData.value)
    const isShared = computed(() => flags.isShared)

    const ttp = "Center representation"
    const stage = props.stage

    const autoSaveOrientation = function(orientation) {
        updateProjectData(dataProject.value._id, { orientation: orientation })
            .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
            })
    }

    const handleClick = () => {
      stage.autoView(500)
      if(!isShared.value) setTimeout(() => autoSaveOrientation(stage.viewerControls.getOrientation().elements), 1000)
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>