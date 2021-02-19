<template>
  <Button 
  :label="label" 
  icon="fas fa-upload" 
  class="settings-button margin-top-5" 
  @click="openModalStructure" 
  :disabled="dialog.structure"  />
</template>

<script>
import useModals from '@/modules/common/useModals'
export default {
    setup() {

        const label = "Upload new structure(s)"
        const { dialog, openModal } = useModals()

        const openModalStructure = () => {
            openModal('structure')
        }

        return { label, dialog, openModalStructure }
    }
}
</script>

<style>

</style>