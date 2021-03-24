<template>
  <div>
    TODO: heteroos
    <ul>
      <li>Put mouse over a heteroatom to highlight it</li>
      <li>Click on heteroatom for single selection / unselection</li>
      <li>To select / unselect all heteroatoms, click on select all heteroatoms button</li>
      <li>To zoom on a heteroatom, click on the right bullseye button</li>
    </ul>  
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Heteroatoms')
    }

    changeModalTitle()
  }
}
</script>

<style>

</style>