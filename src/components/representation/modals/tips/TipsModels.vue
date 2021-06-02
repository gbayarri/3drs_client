<template>
  <div>
    <p><strong>Drag model slider</strong> and then select chains and / or molecules from this model.</p>
    <p>Note that <strong>switching between models will change the succeeding panels</strong> (i.e. if the Model 1 has two chains A and B and the Model 2 has three chains A, B and C, the Chains block will change).</p>
    <p>More information in the <a v-bind:href="`${docsURL}edit.html#models`" target="_blank">official documentation</a>.</p>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Models')
    }

    changeModalTitle()

    const docsURL = process.env.VUE_APP_HELP_URL

    return { docsURL }

  }
}
</script>

<style>

</style>