<template>
  <Button label="Upload new structure" icon="fas fa-upload" class="settings-button margin-top-5" @click="openModalStructure" :disabled="modals.dialog.structure"  />
</template>

<script>
/*import { ref, computed } from 'vue'
import { useStore } from 'vuex'*/
import { inject } from 'vue'
export default {
    setup() {

        let modals = inject('modals')

        const openModalStructure = () => {
            modals.openStructure()
        }

        return { modals, openModalStructure }
    }
}
</script>

<style>

</style>