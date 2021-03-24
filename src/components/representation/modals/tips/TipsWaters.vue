<template>
  <div>
    TODO: waters
    <ul>
      <li>Put mouse over a water to highlight it</li>
      <li>Click on water for single selection / unselection</li>
      <li>To select a set of waters, shift+click on first water and shift+click on last water</li>
      <li>To select / unselect all waters, click on select all waters button</li>
      <li>To zoom on a water, alt+click on water</li>
    </ul>  
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Waters')
    }

    changeModalTitle()
  }
}
</script>

<style>

</style>