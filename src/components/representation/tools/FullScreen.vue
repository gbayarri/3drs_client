<template>
  <Button :icon="isFullScreen ? 'fas fa-compress' : 'fas fa-expand'" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
import { ref } from 'vue'
export default {
  props: ['stage'],
  setup(props) {

    const ttp = ref("Toggle full screen mode")

    const isFullScreen = ref(false)
    const stage = props.stage

    const exitHandler = () => {
        //isFullScreen = (!isFullScreen ? true : false)
        isFullScreen.value = !isFullScreen.value

        if(isFullScreen.value) ttp.value = "Click to exit full screen mode"
        else ttp.value = "View in full screen mode"

        stage.handleResize();

    }

    const handleClick = (e) => {

      //isFullScreen.value = !isFullScreen.value

      //console.log(e)
      stage.toggleFullscreen( document.getElementsByTagName("body")[0] )
      stage.handleResize();

      if (document.addEventListener) {
          document.addEventListener('webkitfullscreenchange', exitHandler, false)
          document.addEventListener('mozfullscreenchange', exitHandler, false)
          document.addEventListener('fullscreenchange', exitHandler, false)
          document.addEventListener('MSFullscreenChange', exitHandler, false)
      }

    }

    return { ttp, handleClick, isFullScreen }
  }
}
</script>

<style>

</style>