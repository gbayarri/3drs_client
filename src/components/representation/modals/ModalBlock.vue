<template>
    <Dialog v-model:visible="dialog.block" 
            :closable="false"
            :closeOnEscape="false" 
            :dismissableMask="false" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '40vw' }">
        <template #header>
            <i class="fas fa-sync fa-spin"></i> <h3>{{ blockUI.header }}</h3>
        </template>

        {{ blockUI.message }}

    </Dialog>
</template>

<script>
import useModals from '@/modules/common/useModals'
export default {
    setup() {

        const { dialog, blockUI } = useModals()

        return { dialog, blockUI }
    }
}
</script>

<style>

</style>