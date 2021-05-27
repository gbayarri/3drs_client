<template>
  <div>
    <p>List of <strong>features available</strong> in Ions:</p>
    <ul>
      <li>Put the mouse over an ion to <strong>highlight</strong> it on the stage.</li>
      <li>Click on an ion for <strong>single selection / unselection</strong>.</li>
      <li>To select / unselect all ions, click on <strong>select all ions button</strong>.</li>
      <li>To zoom on an ion, click on the <strong>right bullseye button</strong>.</li>
    </ul>  
    <p>More information in the <a href="https://3drs-documentation.readthedocs.io/en/latest/edit.html#ions" target="_blank">official documentation</a>.</p>
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