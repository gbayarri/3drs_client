<template>
  <Button icon="fas fa-crosshairs" v-tooltip.right="ttp"  />
</template>

<script>
export default {
  setup() {
    const ttp = "Center representation"

    return { ttp }
  }
}
</script>

<style>

</style>