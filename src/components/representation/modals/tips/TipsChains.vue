<template>
  <div>TODO: select & unselect chains</div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Chains')
    }

    changeModalTitle()
  }
}
</script>

<style>

</style>