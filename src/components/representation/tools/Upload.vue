<template>
  <Button icon="fas fa-upload" v-tooltip.right="ttp"  />
</template>

<script>
export default {
  setup() {
    const ttp = "Upload more files"

    return { ttp }
  }
}
</script>

<style>

</style>