<template>
  <Button icon="fas fa-expand" v-tooltip.right="ttp"  />
</template>

<script>
export default {
  setup() {
    const ttp = "Align all the structures in the representation"

    return { ttp }
  }
}
</script>

<style>

</style>