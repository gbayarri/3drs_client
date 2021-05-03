<template>
    <Dialog v-model:visible="dialog.structure" 
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw' }">
        <template #header>
            <i class="fas fa-upload"></i> <h3>{{ header }}</h3>
        </template>

        <FileUpload 
        @uploader="uploader"
        @select="selector"
        accept=".pdb" 
        :customUpload="true"
        :multiple="true" 
        :maxFileSize="52428800"
        :disabled="disableFileUpload"
        chooseLabel="Select">
            <template #empty>
                <p v-html="descr"></p>
            </template>
        </FileUpload>

        <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { ref, inject } from 'vue'
import useModals from '@/modules/common/useModals'
export default {
    components: {  },
    setup() {

        // TODO!! ADD TWO TABS FROM LAUNCH AND CUSTOM SOME DATA FOR REUSE THE SAME TabPanelFile.vue AND TabPanelPDB.vue COMPONENTS

        /* MODAL */
        const header = "Upload Structure"
        //const modals = inject('modals')
        const { dialog, closeModal } = useModals()

        const closeThisModal = () => {
            //modals.closeModal('structure')
            closeModal('structure')
        }

        /* FILE UPLOAD */
        const $axios = inject('$axios');
        const disableFileUpload = ref(false)
        const descr = "Click <strong>Select button</strong> above or drag and drop files to here to upload."
        
        const selector = () => {
            setTimeout(function(){
                const rows = document.getElementsByClassName("p-fileupload-row")
                for(var item of rows){
                    //item.getElementsByTagName("div")[0].innerHTML = '<img role="presentation" src="' + require(`@/assets/img/pdb.png`) + '" width="100">'
                    item.querySelector("div").innerHTML = '<img role="presentation" src="' + require(`@/assets/img/pdb.png`) + '" width="100">'
                }
            }, 20);
        }

        const uploader = (e) => {
            disableFileUpload.value = true
            let filesList =  Object.assign([], e.files)
            let formData = new FormData();
            let resp = null

            for (const [key, value] of filesList.entries()) {
                formData.append('file' + key, value)
            }

            console.log('Uploading structure files!!!')

            /*$axios
                .post(process.env.VUE_APP_API_LOCATION + '/upload/file/', formData)
                .then(function (response) {
                    //console.log(response);
                    resp = response.data
                })
                .catch(err => console.error(err.message))
                .finally( () => {
                    // CONTROL ERRORS WHEN EMPTY FILE, FOR EXAMPLE
                    //router.push({ name: 'Contact', params: { id } }) 
                    //$router.push({ path: `/representation/${id}` }) 
                    console.log(resp)
                })*/
        }

        return { header, dialog, closeThisModal,
                 descr, selector, uploader, disableFileUpload }
    }
}
</script>

<style>

</style>