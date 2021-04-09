<template>
  <Button icon="fas fa-cog" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
export default {
  setup() {
    const ttp = "Open project settings"

    const handleClick = () => {
      // TODO
      console.log('open modal with project settings: project name, author, disable toasts & allow "forkability"')
    }

    return { ttp, handleClick }
    
  }
}
</script>

<style>

</style>