<template>
  <Button :label="label" icon="fas fa-upload" class="settings-button margin-top-5" @click="openModalStructure" :disabled="modals.dialog.structure"  />
</template>

<script>
import { inject } from 'vue'
export default {
    setup() {

        const label = "Upload new structure(s)"
        const modals = inject('modals')

        const openModalStructure = () => {
            modals.openModal('structure')
        }

        return { label, modals, openModalStructure }
    }
}
</script>

<style>

</style>