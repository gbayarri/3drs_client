<template>
  <Button icon="fas fa-sync-alt" v-tooltip.right="ttp" />
</template>

<script>
export default {
  setup() {
    const ttp = "Reload representation"

    return { ttp }
  }
}
</script>

<style>

</style>