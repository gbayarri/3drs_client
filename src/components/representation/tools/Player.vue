<template>
  <Button  v-if="isVisible" :icon="playing ? 'fas fa-pause-circle': 'fas fa-play-circle'" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
import useTrajectories from '@/modules/ngl/useTrajectories'
export default {
  setup() {

    const { getNumberOfPlayers, togglePlayAll, checkAutoplay } = useTrajectories()

    const isVisible = computed(() => getNumberOfPlayers() > 0)
    
    const playing = ref(false)
    const ttp = computed(() => playing.value ? "Pause trajectories" : "Play trajectories")
    const autoplay = computed(() => checkAutoplay())
    if(autoplay.value) {
      //togglePlayAll(true)
      playing.value = true
    }
    //autoPlayAll()

    const handleClick = () => {
      playing.value = !playing.value
      togglePlayAll(playing.value)
      //window.open(process.env.VUE_APP_HELP_URL, '_blank')

    }

    return { ttp, isVisible, handleClick, playing }
    
  }
}
</script>

<style>

</style>