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
import { ref, inject, computed } from 'vue'
import useModals from '@/modules/common/useModals'
import structureSettings from '@/modules/structure/structureSettings'
export default {
    props: ['project_id'],
    components: {  },
    setup(props) {

        /* MODAL */
        const header = "Upload Trajectory"
        //const modals = inject('modals')
        const { dialog, closeModal } = useModals()
        const { currentStructure } = structureSettings()

        const project_id = props.project_id
        const currStr = computed(() => currentStructure.value)

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

            formData.append('project', project_id)
            formData.append('structure', currStr.value);

            $axios
                .post(process.env.VUE_APP_API_LOCATION + '/upload/traj/', formData)
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
                    //disableFileUpload.value = false
                    if(resp.status === 'error') {
                        /*closeModal('block')
                        const msg = {
                            severity: 'error',
                            content: resp.message,
                            show: true
                        }
                        setMessage('launch', msg)*/
                        // SHOW ERROR IN MODAL
                        disableFileUpload.value = false
                    } else if(resp.status === 'success') {
                        //setBlockUI('load')
                        //$router.push({ name: 'Representation', params: { id: resp.id } }) 
                        //  DO SOMETHING WITH STORAGE DATA AND UPDATE WITH NEW TRAJECTORY!!!!!!
                        // CLOSE MODAL
                        closeModal('trajectory')
                        disableFileUpload.value = false
                    }
                })
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