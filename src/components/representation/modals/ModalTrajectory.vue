<template>
    <Dialog v-model:visible="dialog.trajectory" 
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw' }">
        <template #header>
            <i class="fas fa-film"></i> <h3>{{ header }}</h3>
        </template>

        <FileUpload 
        @uploader="uploader"
        @select="selector"
        accept=".xtc, .dcd" 
        :customUpload="true"
        :multiple="false" 
        :maxFileSize="52428800"
        :disabled="disableFileUpload"
        chooseLabel="Select">
            <template #empty>
                <p v-html="descr"></p>
            </template>
        </FileUpload>

        <template #footer>
            <Button label="Close" icon="pi pi-times" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { ref, inject } from 'vue'
import useModals from '@/modules/common/useModals'
export default {
    components: {  },
    setup() {

        // TODO!! ADD TAB FROM LAUNCH AND CUSTOM SOME DATA FOR REUSE THE SAME TabPanelFile.vue COMPONENT

        /* MODAL */
        const header = "Upload Trajectory"
        //const modals = inject('modals')
        const { dialog, closeModal } = useModals()

        const closeThisModal = () => {
            closeModal('trajectory')
        }

        /* FILE UPLOAD */
        const $axios = inject('$axios');
        const disableFileUpload = ref(false)
        const descr = "Click <strong>Select button</strong> above or drag and drop files to here to upload."
        
        const selector = (e) => {
            setTimeout(function(){
                let ext = 'dcd'
                if(e.originalEvent.path[3].innerText.indexOf('.xtc') != -1) ext = 'xtc'

                const rows = document.getElementsByClassName("p-fileupload-row")
                for(var item of rows){
                    //item.getElementsByTagName("div")[0].innerHTML = '<span class="fu-ext-traj">' + ext + '</span><br><span class="fu-traj">trajectory</span>'
                    //item.getElementsByTagName("div")[0].style.lineHeight = '15px'
                    item.querySelector("div").innerHTML = '<span class="fu-ext-traj">' + ext + '</span><br><span class="fu-traj">trajectory</span>'
                    item.querySelector("div").style.lineHeight = '15px'
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

            console.log('Uploading trajectory file!!!')

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
    .fu-ext-traj { color:#6f96a9; font-weight: 700; }
    .fu-traj { text-transform: uppercase; color: #8c8c8c; font-size: 14px; font-weight: 600; }
</style>