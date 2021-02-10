<template>
    <div v-if="!hasTrajectory">
        <Button label="Add Trajectory" icon="fas fa-film" class="settings-button-trajectory" @click="openModalTrajectory" :disabled="modalTrajectory"  />
    </div>
    <div v-else>Trajectory</div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
export default {
    setup() {

        const store = useStore()
        let modalTrajectory = computed(() => store.state.modalTrajectory)

        let hasTrajectory = ref(false)

        const openModalTrajectory = () => {
            store.dispatch('displayModalTrajectory', true)
        }

        return { hasTrajectory, modalTrajectory, openModalTrajectory }
    }
}
</script>

<style>

</style>