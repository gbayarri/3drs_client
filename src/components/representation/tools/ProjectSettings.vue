<template>
  <Button icon="fas fa-cog" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
import useModals from '@/modules/common/useModals'
export default {
  setup() {

    const { openModal } = useModals()

    const ttp = "Open project settings"

    const handleClick = () => {
      openModal('settings')
    }

    return { ttp, handleClick }
    
  }
}
</script>

<style>

</style>