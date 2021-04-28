<template>
  <Button icon="fas fa-play-circle" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
export default {
  setup() {

    // ONLY IF PROJECT HAS TRAJECTORIESS!!!
    const ttp = "Play / pause trajectories"

    const handleClick = () => {
      window.open(process.env.VUE_APP_HELP_URL, '_blank')
    }

    return { ttp, handleClick }
    
  }
}
</script>

<style>

</style>