<template>
  <div>
    <p>List of <strong>features available</strong> in Heteroatoms:</p>
    <ul>
      <li>Put the mouse over an heteroatom to <strong>highlight</strong> it on the stage.</li>
      <li>Click on an heteroatom for <strong>single selection / unselection</strong>.</li>
      <li>To select / unselect all heteroatoms, click on <strong>select all heteroatoms button</strong>.</li>
      <li>To zoom on an heteroatom, click on the <strong>right bullseye button</strong>.</li>
    </ul>  
    <p>More information in the <a v-bind:href="`${docsURL}edit.html#heteroatoms`" target="_blank">official documentation</a>.</p>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Heteroatoms')
    }

    changeModalTitle()

    const docsURL = process.env.VUE_APP_HELP_URL

    return { docsURL }

  }
}
</script>

<style>

</style>