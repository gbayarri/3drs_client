<template>
  <div>TODO: drag slider</div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Models')
    }

    changeModalTitle()
  }
}
</script>

<style>

</style>