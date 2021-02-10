<template>
    <Dialog v-model:visible="modalTrajectory" 
            @hide="hideModal" 
            @show="showModal" 
            :closable="false"
            :closeOnEscape="false" 
            :dismissableMask="false" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '50vw' }">
        <template #header>
            <i class="fas fa-film"></i> <h3>{{ header }}</h3>
        </template>

        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore veniam distinctio reprehenderit facilis corrupti laboriosam voluptate debitis consequuntur delectus perspiciatis! Debitis similique quis deserunt perspiciatis. Doloribus placeat assumenda laborum distinctio est corrupti dolorum, dolores, reiciendis odit nostrum deleniti eum eligendi debitis architecto saepe eius voluptatem, ipsa facilis vitae aut. Molestias assumenda nisi dicta a, reprehenderit cum modi quis? Sint rem dolorem laboriosam, odit eligendi ipsam iste officia aperiam iusto commodi dolore vitae ut! Exercitationem saepe minima officia expedita illo a eius voluptates sapiente iure ullam temporibus necessitatibus sed commodi cum mollitia quasi, nobis eaque maxime quaerat dignissimos laudantium provident cupiditate. Culpa corrupti, atque commodi asperiores facere soluta! Perferendis reiciendis facilis hic blanditiis minus, laudantium laboriosam velit, modi nemo, dolorem vero aut? Laudantium sequi, quis vero numquam sapiente, aspernatur esse sint ipsum maxime omnis eos. Et pariatur est exercitationem explicabo! Quis velit temporibus nobis consequuntur, esse dolor unde suscipit aliquid illum at ex et veritatis illo inventore, soluta fugit omnis perferendis tempore quisquam voluptatem ea quasi necessitatibus natus voluptatibus! Eligendi nam dolores molestiae officia similique atque consequuntur ab quos itaque praesentium qui, placeat distinctio amet exercitationem est non asperiores excepturi ea aut explicabo tenetur ad nulla porro ipsam! Culpa, natus aliquid?

        <template #footer>
            <Button label="Close" icon="pi pi-times" @click="closeBasic" />
        </template>
    </Dialog>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
export default {
    components: {  },
    setup() {

        const header = "Upload Trajectory"

        const store = useStore()

        const modalTrajectory = computed(() => store.state.modalTrajectory)

        const hideModal = () => {
            console.log(store.state.modalTrajectory)
        }

        const showModal = () => {
            console.log(store.state.modalTrajectory)
        }

        const closeBasic = () => {
            store.dispatch('displayModalTrajectory', false)
        }


        return { header, modalTrajectory, hideModal, showModal, closeBasic }
    }
}
</script>

<style>

</style>