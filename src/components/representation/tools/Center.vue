<template>
  <Button icon="fas fa-bullseye" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick" />
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