<template>
  <Button icon="fas fa-question-circle" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
export default {
  setup() {
    const ttp = "Open help documentation"

    const handleClick = () => {
      window.open('https://github.com/gbayarri/3drs', '_blank')
    }

    return { ttp, handleClick }
    
  }
}
</script>

<style>

</style>