<template>
  <Button icon="fas fa-video" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
import { computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
export default {
  props: ['stage'],
  setup(props) {

    const { projectData } = structureStorage()
    const { updateProjectData } = useAPI()

    const ttp = computed(() => "Switch camera mode to " + (cameraType.value === 'perspective' ? 'orthographic' : 'perspective'))
    const stage = props.stage
    const cameraType = computed(() => projectData.value.camera)

    const autoSaveCamera = function() {
        updateProjectData(projectData.value._id, { camera: cameraType.value })
            .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
            })
    }

    const handleClick = () => {
      projectData.value.camera = cameraType.value === 'perspective' ? 'orthographic' : 'perspective' 
      stage.setParameters({ cameraType: cameraType.value })
      setTimeout(() => autoSaveCamera(), 1000)
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>