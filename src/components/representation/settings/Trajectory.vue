<template>
    <div v-if="!hasTrajectory" class="margin-bottom-20">
        <Button 
        :label="label" 
        icon="fas fa-film" 
        class="settings-button" 
        @click="openModalTrajectory" 
        :disabled="dialog.trajectory"  />
    </div>
    <div v-else class="margin-bottom-20">Trajectory</div>
</template>

<script>
import { ref, inject } from 'vue'
import useModals from '@/modules/common/useModals'
export default {
    setup() {

        const hasTrajectory = ref(false)
        const label = "Add Trajectory"
        const { dialog, openModal } = useModals()

        const openModalTrajectory = () => {
            openModal('trajectory')
        }

        return { label, dialog, hasTrajectory, openModalTrajectory }
    }
}
</script>

<style>

</style>