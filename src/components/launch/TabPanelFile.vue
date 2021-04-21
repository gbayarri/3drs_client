<template>
    <p v-html="texts.desc"></p>
    <FileUpload 
    @uploader="uploader"
    @select="selector"
    accept=".pdb, .gro" 
    :customUpload="true"
    :multiple="true" 
    :maxFileSize="52428800"
    :disabled="disableFileUpload"
    chooseLabel="Select">
        <template #empty>
            <p v-html="texts.int_desc"></p>
        </template>
    </FileUpload>
</template>

<script>
import { inject, ref } from 'vue'
import useMessages from '@/modules/common/useMessages'
import useModals from '@/modules/common/useModals'
export default {
    props: ['texts'],
    setup() {

        const $axios = inject('$axios')
        const $router = inject('$router')
        const { setMessage } = useMessages()
        const { openModal, setBlockUI, closeModal } = useModals()

        let disableFileUpload = ref(false)

        const selector = (e) => {
            
            //console.log(e.originalEvent)
            //console.log(e.files.length)
            setTimeout(function(){
                //let ext = ''

                if(e.originalEvent.path[3].innerText.indexOf('.gro') !== -1 || e.originalEvent.path[3].innerText.indexOf('.pdb') !== -1)  {
                    
                    //console.log(e.files.length)
                    //console.log(img)
                    const rows = document.getElementsByClassName("p-fileupload-row")
                    for(var item of rows){
                        //console.log(item.getElementsByTagName("div")[1].innerText)
                        let img = ''
                        if(item.getElementsByTagName("div")[1].innerText.indexOf('.gro') != -1) img = 'gro'
                        if(item.getElementsByTagName("div")[1].innerText.indexOf('.pdb') != -1) img = 'pdb'
                        //item.getElementsByTagName("div")[0].innerHTML = '<img role="presentation" src="' + require(`@/assets/img/pdb.png`) + '" width="100">'
                        item.querySelector("div").innerHTML = '<img role="presentation" src="' + require(`@/assets/img/` + img + `.png`) + '" width="100">'
                    }
                }else {
                    const msg = {
                            severity: 'warn',
                            content: 'Error: only pdb or gro formats allowed. Please try again.',
                            show: true
                        }
                    setMessage('launch', msg)
                    disableFileUpload.value = true
                }
            }, 20);
        }

        const uploader = (e) => {

            setBlockUI('upload_pdb')
            openModal('block')

            disableFileUpload.value = true
            let filesList =  Object.assign([], e.files)
            let formData = new FormData();
            let resp = null

            for (const [key, value] of filesList.entries()) {
                formData.append('file' + key, value)
            }

            $axios
                .post(process.env.VUE_APP_API_LOCATION + '/upload/file/', formData)
                .then(function (response) {
                    //console.log(response);
                    resp = response.data
                })
                .catch(err => console.error(err.message))
                .finally( () => {
                    if(resp.status === 'error') {
                        closeModal('block')
                        const msg = {
                            severity: 'error',
                            content: resp.message,
                            show: true
                        }
                        setMessage('launch', msg)
                        disableFileUpload.value = false
                    } else if(resp.status === 'success') {
                        setBlockUI('load')
                        $router.push({ name: 'Representation', params: { id: resp.id } }) 
                    }
                })
        }

        return { 
            disableFileUpload, 
            selector, 
            uploader 
        }
    }
}
</script>

<style>
    .p-fileupload.p-fileupload-advanced.p-component {
        padding: 12px 20px 15px;
        border: 1px solid #dee2e6;
    }
    .p-fileupload .p-fileupload-buttonbar {
        background: none!important;
        border:none!important;
    }
    .p-fileupload .p-fileupload-content {
        border:none!important;
        border-top: 1px solid #dee2e6!important;
    }
</style>