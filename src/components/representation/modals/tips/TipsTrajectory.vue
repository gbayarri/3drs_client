<template>
  <div>TODO: traectories</div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Trajectories')
    }

    changeModalTitle()
  }
}
</script>

<style>

</style>