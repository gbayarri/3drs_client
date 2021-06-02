<template>
  <div>
    <p>List of <strong>features available</strong> in Waters:</p>
    <ul>
      <li>Put the mouse over a water to <strong>highlight</strong> it on the stage.</li>
      <li>Click on a water for <strong>single selection / unselection</strong>.</li>
      <li>To zoom on a water, press <strong>Alt key and click left mouse</strong> on water.</li>
      <li>To select / unselect a set of waters, press <strong>Shift key and click left mouse</strong> on the first water and then press <strong>Shift key and click left mouse</strong> on last water.</li>
      <li>To select / unselect <strong>all waters</strong>, click on <strong>select all waters</strong> button</li>
    </ul>
    <p>More information in the <a v-bind:href="`${docsURL}edit.html#waters`" target="_blank">official documentation</a>.</p>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Waters')
    }

    changeModalTitle()

    const docsURL = process.env.VUE_APP_HELP_URL

    return { docsURL }

  }
}
</script>

<style>

</style>