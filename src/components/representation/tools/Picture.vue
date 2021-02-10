<template>
  <Button icon="fas fa-camera-retro" v-tooltip.right="ttp"  />
</template>

<script>
export default {
  setup() {
    const ttp = "Take a picture of the representation"

    return { ttp }
  }
}
</script>

<style>

</style>