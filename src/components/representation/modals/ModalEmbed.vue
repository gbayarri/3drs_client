<template>
    <Dialog v-model:visible="dialog.embed" 
            @show="onShow"
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw' }">
        <template #header>
            <i class="fas fa-code"></i> <h3>{{ header }}</h3>
        </template>

        <p>For embed it as a widget, <strong>you just need to copy the HTML code below</strong> and paste it into your website:</p>
        <div class="p-inputgroup">
            <Textarea v-model="embedCode" rows="3"  id="embedtextarea" />
            <Button icon="fas fa-copy" :label="labelCopy" @click="copyEmbed" />
        </div>

        <template #footer>
            <Button :label="labelClose" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import globals from '@/globals'
import useModals from '@/modules/common/useModals'
export default {
    props: ['project_id'],
    components: {  },
    setup(props) {

        const { dialog, closeModal } = useModals()

        const project_id = props.project_id

        /* MODAL */
        const page = reactive({
            header:'Embed project',
            labelClose: 'Close',
            labelCopy: 'Copy'
        })
        
        const closeThisModal = () => {
            closeModal('embed')
        }

        const onShow = () => {
            document.querySelector('#embedtextarea').setAttribute('readonly', 'true')
        }

        // embedding
        const ecGlobal = globals.embedCode
        var url = window.location.origin + process.env.BASE_URL + 'embed/' + project_id
        const embedCode = ecGlobal(url)
        const copyEmbed = () => {
            const copyTextarea = document.querySelector('#embedtextarea')
            copyTextarea.focus();
            copyTextarea.select();
            try {
                document.execCommand('copy')
                console.log('Text successfully copied into clipboard')
            } catch (err) {
                console.log('Oops, unable to copy')
            }
        }

        return { 
            ...toRefs(page), 
            dialog, closeThisModal, onShow,
            embedCode, copyEmbed
        }
    }
}
</script>

<style>
    h2.modal-embed { margin-top:0;}
    .num-list { font-weight: bold; color: #6f96a9; }
    .shared-address { border:solid 1px #6f96a9; padding:5px; background: #f0f8ff; }
    .label-switch { margin-left: 10px; vertical-align:super; font-size:14px; }
    #copytextarea { user-select: none; }
    #embedtextarea { resize: none;}
</style>