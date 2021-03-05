<template>
  <Button icon="fas fa-undo-alt fa-flip-horizontal" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
export default {
  props: ['stage'],
  setup(props) {
    const ttp = "Toggle spin rotation"
    const stage = props.stage

    const handleClick = () => stage.toggleSpin()

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>