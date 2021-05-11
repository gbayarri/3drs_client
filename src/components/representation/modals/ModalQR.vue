<template>
    <Dialog v-model:visible="dialog.qrcode" 
            @show="onShow"
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            >
        <template #header>
            <i class="fas fa-qrcode"></i> <h3 v-html="header"></h3>
        </template>

        <div style="text-align:center">
            <img v-bind:src="qrImage" /> 
        </div>

        <template #footer>
            <Button :label="labelClose" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import QRCode from 'qrcode'
import useModals from '@/modules/common/useModals'
export default {
    props: ['project_id'],
    components: {  },
    setup(props) {

        const { dialog, closeModal } = useModals()

        const project_id = props.project_id
        const qrImage = ref(null)

        /* MODAL */
        const page = reactive({
            header:'Get QR code for this representation&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp',
            labelClose: 'Close'
        })
        
        const closeThisModal = () => {
            closeModal('qrcode')
        }

        const onShow = () => {
            generateQR()
        }

        /* QR */

        const generateQR = async () => {
            try {
                var url = window.location.origin + process.env.BASE_URL + 'shared/' + project_id
                qrImage.value = await QRCode.toDataURL(url)
            } catch (err) {
                console.error(err)
            }
        }

        return { 
            ...toRefs(page), 
            dialog, closeThisModal, onShow,
            qrImage
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