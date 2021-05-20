<template>
    <Dialog v-model:visible="dialog.embed_gallery" 
            @show="onShow"
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            >
        <template #header>
            <i class="fas fa-code"></i> <h3 v-html="header"></h3>
        </template>

        <div v-html="embedCode"></div>

        <template #footer>
            <Button :label="labelClose" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import globals from '@/globals'
import { reactive, computed, ref, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
export default {
    props: ['project_id'],
    components: {  },
    setup(props) {

        const { dialog, closeModal } = useModals()

        const project_id = computed(() => props.project_id)
        const ecGlobal = globals.embedCode
        let embedCode = ref([])

        /* MODAL */
        const page = reactive({
            header:'Embedded gallery example',
            labelClose: 'Close'
        })
        
        const closeThisModal = () => {
            closeModal('embed_gallery')
        }

        /* EMBED CODE */
        const onShow = () => {
            var url = window.location.origin + process.env.BASE_URL + 'embed/' + project_id.value
            embedCode.value = ecGlobal(url)
        }

        return { 
            ...toRefs(page), 
            dialog, closeThisModal, onShow, 
            embedCode
        }
    }
}
</script>

<style>
    #qr-container { text-align: center;}
    #qr-container img { max-width: 100%; }
</style>