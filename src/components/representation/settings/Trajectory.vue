<template>
    <div v-if="!hasTrajectory" class="margin-bottom-20">
        <Button :label="label" icon="fas fa-film" class="settings-button" @click="openModalTrajectory" :disabled="modals.dialog.trajectory"  />
    </div>
    <div v-else class="margin-bottom-20">Trajectory</div>
</template>

<script>
import { ref, inject } from 'vue'
export default {
    setup() {

        let hasTrajectory = ref(false)
        const label = "Add Trajectory"
        const modals = inject('modals')

        const openModalTrajectory = () => {
            modals.openModal('trajectory')
        }

        return { label, modals, hasTrajectory, openModalTrajectory }
    }
}
</script>

<style>

</style>