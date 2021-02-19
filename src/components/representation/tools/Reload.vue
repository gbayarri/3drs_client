<template>
  <Button icon="fas fa-sync-alt" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
//import { useStore } from 'vuex'
import useTools from '@/modules/ngl/useTools'
export default {
  props: ['stage'],
  setup(props) {
    
    //const store = useStore()

    // TO MODIFY WITH COMPOSITION API?
    //const initialOrientation = store.state.initialOrientation.elements
    //const { initialOrientation } = useTools()
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