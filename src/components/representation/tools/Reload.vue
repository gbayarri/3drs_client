<template>
  <Button icon="fas fa-sync-alt" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
import { useStore } from 'vuex'
export default {
  props: ['stage'],
  setup(props) {
    
    const store = useStore()

    const initialOrientation = store.state.initialOrientation.elements

    const ttp = "Reload representation"

    let stage = props.stage

    const handleClick = () => {
      stage.animationControls.orient(initialOrientation, 500);
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>