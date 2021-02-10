<template>
  <Button icon="fas fa-clone" v-tooltip.right="ttp"  />
</template>

<script>
export default {
  // see component/structure-superpose from gallery
  setup() {
    const ttp = "Align all the structures in the representation"

    return { ttp }
  }
}
</script>

<style>

</style>