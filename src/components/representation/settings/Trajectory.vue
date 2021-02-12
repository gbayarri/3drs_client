<template>
    <div v-if="!hasTrajectory">
        <Button label="Add Trajectory" icon="fas fa-film" class="settings-button" @click="openModalTrajectory" :disabled="modals.dialog.trajectory"  />
    </div>
    <div v-else>Trajectory</div>
</template>

<script>
//import modals from "@/modules/Modals"
import { ref, /*computed,*/ inject } from 'vue'
//import { useStore } from 'vuex'
export default {
    setup() {

        //const store = useStore()
        //let modalTrajectory = computed(() => store.state.modalTrajectory)

        let hasTrajectory = ref(false)

        let modals = inject('modals')

        const openModalTrajectory = () => {
            //let mtr1 = modals.getModalTrajectory().modal.trajectory
            //console.log(mtr1)

            modals.openTrajectory()

            //modals.setModalTrajectory(true)
            
            //let mtr2 = modals.getModalTrajectory().modal.trajectory
            //console.log(mtr2)

            //store.dispatch('displayModalTrajectory', true)
        }

        return { modals, hasTrajectory, /*modalTrajectory, */openModalTrajectory }
    }
}
</script>

<style>

</style>