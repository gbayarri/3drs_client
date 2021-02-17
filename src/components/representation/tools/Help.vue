<template>
  <Button icon="fas fa-question-circle" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
export default {
  setup() {
    const ttp = "Open help documentation"

    const handleClick = () => {
      window.open(process.env.VUE_APP_HELP_URL, '_blank')
    }

    return { ttp, handleClick }
    
  }
}
</script>

<style>

</style>