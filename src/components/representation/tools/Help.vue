<template>
  <Button icon="fas fa-question-circle" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
export default {
  props: ['isShared'],
  setup(props) {
    const ttp = "Open help documentation"

    const handleClick = () => {
      const url = process.env.VUE_APP_HELP_URL + (props.isShared ? 'share.html' : 'edit.html')
      window.open(url, '_blank')
    }

    return { ttp, handleClick }
    
  }
}
</script>

<style>

</style>