<template>
  <Button icon="fas fa-clone" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick"  />
</template>

<script>
import useModals from '@/modules/common/useModals'
export default {
  setup() {

    const { openModal } = useModals()

    const ttp = "Superpose structures"

    const handleClick = () => {
      openModal('align')
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>