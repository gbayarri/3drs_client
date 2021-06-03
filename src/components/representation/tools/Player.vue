<template>
  <Button v-if="isVisible" :icon="playing ? 'fas fa-pause-circle': 'fas fa-play-circle'" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
import { computed, ref, onUpdated } from '@vue/runtime-core'
import structureSettings from '@/modules/structure/structureSettings'
import useFlags from '@/modules/common/useFlags'
import useTrajectories from '@/modules/ngl/useTrajectories'
export default {
  setup() {

    const { currentStructure } = structureSettings()
    const { getNumberOfPlayers, togglePlayAll, checkAutoplay, getTrajectoryPlayer } = useTrajectories()
    const { flags } = useFlags()

    const currStr = computed(() => currentStructure.value)
    const player = computed(() => getTrajectoryPlayer(currStr.value))

    const isVisible = computed(() => {
      if(getNumberOfPlayers() > 1) return true
      else if(getNumberOfPlayers() === 1 && flags.responsive768) return true
      else return false
      //return true
    })

    onUpdated(() => {
        // update isRunningValue once the player has been created
        playing.value = computed(() => player.value.isRunning).value
    })

    
    const playing = ref(player.value.isRunning)
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