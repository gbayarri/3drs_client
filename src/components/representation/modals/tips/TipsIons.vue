<template>
  <div>
    TODO: ions
    <ul>
      <li>Put mouse over a ion to highlight it</li>
      <li>Click on ion for single selection / unselection</li>
      <li>To select / unselect all ions, click on select all ions button</li>
      <li>To zoom on a ion, click on the right bullseye button</li>
    </ul>  
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Ions')
    }

    changeModalTitle()
  }
}
</script>

<style>

</style>