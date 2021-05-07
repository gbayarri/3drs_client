<template>
  <Button icon="fas fa-ruler" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
import useModals from '@/modules/common/useModals'
export default {
  setup() {

    const { openModal } = useModals()

    const ttp = "Open measurements"

    const handleClick = () => {
      openModal('measurements')
    }

    return { ttp, handleClick }
    
  }
}
</script>

<style>

</style>