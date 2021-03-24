<template>
  <div>TODO: custom</div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Custom selection')
    }

    changeModalTitle()
  }
}
</script>

<style>

</style>