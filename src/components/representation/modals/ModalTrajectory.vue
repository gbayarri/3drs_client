<template>
    <Dialog v-model:visible="dialog.trajectory" 
            @hide="hideDialog"
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw' }">
        <template #header>
            <i class="fas fa-film"></i> <h3>{{ header }}</h3>
        </template>

        <Message :severity="message.severity" :key="message.content" v-if="message.show">{{message.content}}</Message>

        <p v-html="desc"></p>
        <FileUpload 
        @uploader="uploader"
        @select="selector"
        accept=".xtc, .dcd, .trr, .binpos, .netcdf, .nc" 
        :customUpload="true"
        :multiple="false" 
        :fileLimit="1"
        :maxFileSize="524288000"
        :disabled="disableFileUpload"
        chooseLabel="Select" >
            <template #empty>
                <p v-html="int_desc"></p>
            </template>
        </FileUpload>

        <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { ref, inject, computed, reactive, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
import useMessages from '@/modules/common/useMessages'
import structureSettings from '@/modules/structure/structureSettings'
import useComponents from '@/modules/ngl/useComponents'
export default {
    props: ['project_id'],
    components: {  },
    setup(props) {

        /* MODAL */
        //const header = "Upload Trajectory"
        const page = reactive({
            header: "Upload Trajectory",
            desc: "Please click or drag and drop files, only <strong>XTC</strong>, <strong>DCD</strong>, <strong>TRR</strong>, <strong>BINPOS</strong> and <strong>NETCDF</strong> files accepted:",
            int_desc: "Click <strong>Select button</strong> above or drag and drop files to here to upload."
        })
        //const modals = inject('modals')
        const { dialog, openModal, closeModal, setBlockUI } = useModals()
        const { currentStructure } = structureSettings()
        const { messages, setMessage, resetMessage } = useMessages()
        const { addNewTrajectory } = useComponents()

        const project_id = props.project_id
        const currStr = computed(() => currentStructure.value)
        const message = computed(() => messages.launch)

        const closeThisModal = () => {
            closeModal('trajectory')
        }

        const hideDialog = () => {
            resetMessage('launch')
            disableFileUpload.value = false
        }

        /* FILE UPLOAD */
        const $axios = inject('$axios');
        const disableFileUpload = ref(false)
        const descr = "Click <strong>Select button</strong> above or drag and drop files to here to upload."
        
        const selector = (e) => {
            // TO FIX!!!!
            setTimeout(function(){
                let ext = ''
                if(e.originalEvent.path[3].innerText.indexOf('.xtc') != -1) ext = 'xtc'
                if(e.originalEvent.path[3].innerText.indexOf('.dcd') != -1) ext = 'dcd'
                if(e.originalEvent.path[3].innerText.indexOf('.trr') != -1) ext = 'trr'
                if(e.originalEvent.path[3].innerText.indexOf('.binpos') != -1) ext = 'binpos'
                if(e.originalEvent.path[3].innerText.indexOf('.netcdf') != -1) ext = 'netcdf'
                if(e.originalEvent.path[3].innerText.indexOf('.nc') != -1) ext = 'netcdf'

                if(ext != '') {
                    const rows = document.getElementsByClassName("p-fileupload-row")
                    for(var item of rows){
                        //item.getElementsByTagName("div")[0].innerHTML = '<span class="fu-ext-traj">' + ext + '</span><br><span class="fu-traj">trajectory</span>'
                        //item.getElementsByTagName("div")[0].style.lineHeight = '15px'
                        //let ext = ''
                        if(item.getElementsByTagName("div")[1].innerText.indexOf('.xtc') != -1) ext = 'xtc'
                        if(item.getElementsByTagName("div")[1].innerText.indexOf('.dcd') != -1) ext = 'dcd'
                        if(item.getElementsByTagName("div")[1].innerText.indexOf('.trr') != -1) ext = 'trr'
                        if(item.getElementsByTagName("div")[1].innerText.indexOf('.binpos') != -1) ext = 'binpos'
                        if(item.getElementsByTagName("div")[1].innerText.indexOf('.netcdf') != -1) ext = 'netcdf'
                        if(item.getElementsByTagName("div")[1].innerText.indexOf('.nc') != -1) ext = 'netcdf'
                        item.querySelector("div").innerHTML = '<span class="fu-ext-traj">' + ext + '</span><br><span class="fu-traj">trajectory</span>'
                        item.querySelector("div").style.lineHeight = '15px'
                    }
                } else {
                    const msg = {
                            severity: 'warn',
                            content: 'Error: only trajectory formats allowed. Please close this modal window and try again.',
                            show: true
                        }
                    setMessage('launch', msg)
                    disableFileUpload.value = true
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
                .post(process.env.VUE_APP_API_LOCATION + '/upload/traj/', formData,
                {
                    onUploadProgress: (e) => {
                        if (e.lengthComputable) {
                            document.querySelector(".p-progressbar-value.p-progressbar-value-animate").style.width = Math.floor((e.loaded/e.total) * 100) + "%"
                        }
                    }
                })
                .then(function (response) {
                    //console.log(response);
                    resp = response.data
                })
                .catch(err => console.error(err.message))
                .finally( () => {
                    // CONTROL ERRORS WHEN EMPTY FILE, FOR EXAMPLE
                    //router.push({ name: 'Contact', params: { id } }) 
                    //$router.push({ path: `/representation/${id}` }) 
                    //console.log(resp)
                    //disableFileUpload.value = false
                    if(resp.status === 'error') {
                        const msg = {
                            severity: 'error',
                            content: resp.message,
                            show: true
                        }
                        setMessage('launch', msg)
                        disableFileUpload.value = false
                    } else if(resp.status === 'success') {
                        //setBlockUI('load')
                        //$router.push({ name: 'Representation', params: { id: resp.id } }) 
                        //  DO SOMETHING WITH STORAGE DATA AND UPDATE WITH NEW TRAJECTORY!!!!!!
                        // CLOSE MODAL
                        // CREATE useCOmponentS > addTrajectory WITH THE 77-106 CODE!!!
                        closeModal('trajectory')
                        setBlockUI('traj')
                        openModal('block')
                        addNewTrajectory(resp.data)
                        //closeModal('trajectory')
                        
                        disableFileUpload.value = false
                    }
                })
        }

        return { ...toRefs(page), dialog, closeThisModal, message,
                 descr, selector, uploader, disableFileUpload, hideDialog }
    }
}
</script>

<style>
    .fu-ext-traj { color:#6f96a9; font-weight: 700; }
    .fu-traj { text-transform: uppercase; color: #8c8c8c; font-size: 14px; font-weight: 600; }
</style>