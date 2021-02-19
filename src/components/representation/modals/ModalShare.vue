<template>
    <Dialog v-model:visible="dialog.share" 
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw' }">
        <template #header>
            <i class="fas fa-share-square"></i> <h3>{{ header }}</h3>
        </template>

        Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium autem sed ducimus minus. Facere, commodi totam! Facere eaque facilis beatae eveniet nostrum quo quam corrupti repudiandae adipisci error doloremque praesentium in cum voluptate enim quibusdam assumenda blanditiis, quidem deserunt sed distinctio, fuga ad. Cum pariatur doloribus dolorum, dolor earum maxime consectetur quasi dignissimos eaque? Nesciunt voluptatem iusto voluptatum doloribus ratione commodi ipsum ad, fugiat nisi quos quaerat omnis non iure quae temporibus repellendus odit facere amet, quod maiores dolore ab ea architecto praesentium. Adipisci error nesciunt atque praesentium similique molestias consequatur id voluptatum, minus temporibus quae, repellendus odit aliquid provident.

        <template #footer>
            <Button label="Close" icon="pi pi-times" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import useModals from '@/modules/common/useModals'
export default {
    components: {  },
    setup() {

        /* MODAL */
        const header = "Share representation"
        const { dialog, closeModal } = useModals()

        const closeThisModal = () => {
            closeModal('share')
        }

        return { header, dialog, closeThisModal }
    }
}
</script>

<style>

</style>