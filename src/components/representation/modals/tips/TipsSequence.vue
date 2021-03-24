<template>
  <div>
    TODO: residues
    <ul>
      <li>Put mouse over a residue to highlight it</li>
      <li>Click on residue for single selection / unselection</li>
      <li>Click on window > helix for selection / unselection</li>
      <li>Click on window > sheet for selection / unselection</li>
      <li>To select / unselect a set of residues, shift+click on first residue and shift+click on last residue</li>
      <li>To select / unselect all residues, click on select all residues button</li>
      <li>To zoom on a residue, alt+click on residue</li>
    </ul>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Sequence')
    }

    changeModalTitle()
  }
}
</script>

<style>

</style>