<template>
  <Button icon="fas fa-sync-alt" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
import useTools from '@/modules/ngl/useTools'
export default {
  props: ['stage'],
  setup(props) {
    const initialOrientation = useTools().initialOrientation.value

    const ttp = "Reload representation"

    const stage = props.stage

    const handleClick = () => {
      stage.animationControls.orient(initialOrientation.elements, 500);
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>