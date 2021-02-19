<template>
  <Button icon="fas fa-crosshairs" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
export default {
  props: ['stage'],
  setup(props) {
    const ttp = "Center representation"
    const stage = props.stage

    const handleClick = () => {
      stage.autoView(500);
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>