<template>
  <Button icon="fas fa-undo-alt" v-tooltip.right="ttp"  />
</template>

<script>
export default {
  setup() {
    const ttp = "Start spin rotation"

    return { ttp }
  }
}
</script>

<style>

</style>