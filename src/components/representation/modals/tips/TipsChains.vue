<template>
  <div>
    <p>Passing the mouse over the chain id will <strong>highlight</strong> it on the stage. <strong>Clicking on the chains</strong> will select / unselect them.</p>
    <p>Note that <strong>enabling or disabling chains will change the succeeding panels</strong> (i.e. the Sequence panel will show all the residues if all chains are selected, but only the ones belonging to the Chain B if this is the only one selected).</p>
    <p>More information in the <a v-bind:href="`${docsURL}edit.html#chains`" target="_blank">official documentation</a>.</p>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Chains')
    }

    changeModalTitle()

    const docsURL = process.env.VUE_APP_HELP_URL

    return { docsURL }

  }
}
</script>

<style>

</style>