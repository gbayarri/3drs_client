<template>
  <div>
    <p>List of <strong>features available</strong> in Sequence:</p>
    <ul>
      <li>Put the mouse over a residue to <strong>highlight</strong> it on the stage.</li>
      <li>Click on a residue for <strong>single selection / unselection</strong>.</li>
      <li>To zoom on a residue, press <strong>Alt key and click left mouse</strong> on residue.</li>
      <li>To select / unselect a set of residues, press <strong>Shift key and click left mouse</strong> on the first residue and then press <strong>Shift key and click left mouse</strong> on last residue.</li>
      <li>To select / unselect <strong>all residues</strong>, click on <strong>select all residues</strong> button</li>
      <li>For highlighting <strong>α-helix / β-sheet</strong>, open the <strong>zoom window</strong> and put the mouse over an α-helix or a β-sheet.</li>
      <li>To select / unselect <strong>α-helix / β-sheet</strong>, open the <strong>zoom window</strong> and click on an α-helix or a β-sheet.</li>
      <li>To zoom on an <strong>α-helix / β-sheet</strong>, open the <strong>zoom window</strong> and put the mouse over an α-helix or a β-sheet with the mouse <strong>left button while pressing the Alt key</strong>.</li>   
    </ul>
    <p>More information in the <a v-bind:href="`${docsURL}edit.html#sequence`" target="_blank">official documentation</a>.</p>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Sequence')
    }

    changeModalTitle()

    const docsURL = process.env.VUE_APP_HELP_URL

    return { docsURL }

  }
}
</script>

<style>

</style>