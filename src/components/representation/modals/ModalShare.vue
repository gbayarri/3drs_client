<template>
    <Dialog v-model:visible="dialog.share" 
            @hide="hideDialog"
            :closable="!sharing"
            :closeOnEscape="!sharing" 
            :dismissableMask="!sharing" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '70vw' }">
        <template #header>
            <i class="fas fa-share-square"></i> <h3>{{ header }}</h3>
        </template>

        <h2 class="modal-share">Sharing instructions</h2>

        <p>If your project is ready for sharing, <strong>please follow the next steps</strong>:</p>

        <p><span class="num-list">1)</span> First off, <strong>take a look to the project draft</strong>. It will show you the project the same way the final users will see it. Take into account 
        that <strong>this address shouldn't be shared</strong>, because until you <strong>generate a shared project</strong>, the current one will be <strong>expirable</strong>.</p>

        <p><Button :label="labelDraft" icon="fas fa-file-signature" @click="openDraft" :disabled="sharing" /></p>

        <p><span class="num-list">2)</span> Be sure that you agree with the <strong>fork permissions</strong> for this project. You can allow or not other users to <strong>fork this project</strong> once it is
        shared:</p>

        <p><InputSwitch v-model="forkable" class="margin-top-5" :disabled="sharing" /> <span class="label-switch">{{ status_fork }}</span></p>

        <p><span class="num-list">3)</span> Allow or not to <strong>make this project public</strong> and <strong>available to other users</strong> throughout the home page:</p>

        <p><InputSwitch v-model="isPublic" class="margin-top-5" :disabled="sharing" /> <span class="label-switch">{{ status_public }}</span></p>
        
        <p><span class="num-list">4)</span> Finally, clicking the button below <strong>the shared project will be generated</strong>. 
        Remember that <strong>you can share the same project as many times as you want</strong>, but once a project is shared, the subsequent updates in the current representation <strong> won't
        be reflected </strong> in the previous shared projects. </p>

        <p><Button :label="labelShare" :icon="sharing ? 'fas fa-spinner fa-pulse' : 'fas fa-share'" @click="launchShareProject" :disabled="sharing" /></p>

        <div v-show="shared">
            <h2>Share project</h2>
            <p>For sharing it, <strong>you just need to copy and share the address below</strong>:</p>
            <div class="p-inputgroup">
                <Button icon="fas fa-copy" :label="labelCopy" @click="copyShared" />
                <InputText v-model="sharedAddress" id="copytextarea" />
                <Button icon="fas fa-share-square" :label="labelOpen" @click="openShared" />
            </div>

            <h2>Embed project</h2>
            <p>For embed it as a widget, <strong>you just need to copy the HTML code below</strong> and paste it into your website:</p>
            <div class="p-inputgroup">
                <Textarea v-model="embedCode" rows="2"  id="embedtextarea" />
                <Button icon="fas fa-copy" :label="labelCopy" @click="copyEmbed" />
            </div>

            <h2>QR code</h2>
            <p>Below you can find a <strong>QR code for sharing the new generated address</strong>:</p>
            <div id="qr-container">
                <img v-bind:src="qrImage" /> 
            </div>
        </div>

        <template #footer>
            <Button :label="labelClose" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" :disabled="sharing" />
        </template>
    </Dialog>
</template>

<script>
import { ref, computed, reactive, toRefs } from 'vue'
import globals from '@/globals'
import QRCode from 'qrcode'
import useModals from '@/modules/common/useModals'
import useAPI from '@/modules/api/useAPI'
import useProjectSettings from '@/modules/structure/useProjectSettings'
export default {
    props: ['project_id'],
    components: {  },
    setup(props) {

        const { dialog, closeModal } = useModals()
        const { getProjectSettings, updateProjectSettings } = useProjectSettings()
        const { shareProject } = useAPI()

        const project_id = props.project_id
        const settings = computed(() => getProjectSettings())

        /* MODAL */
        const page = reactive({
            header:'Share representation',
            labelClose: 'Close',
            labelDraft: 'View draft',
            labelCopy: 'Copy',
            labelOpen: 'Open',
            labelShare: computed(() => sharing.value ? "Sharing project, please don't close the tab" : "Share project"),
            status_fork: computed(() => forkable.value ? "Fork enabled" : "Fork disabled"),
            status_public: computed(() => isPublic.value ? "Project is public" : "Project is private")
        })
        
        const closeThisModal = () => {
            closeModal('share')
        }

        // when closing modal, hide shared block and clean copytextarea and embedtextarea
        const hideDialog = () => {
            shared.value = false
            sharedAddress.value = null
            embedCode.value = null
        }

        /* DRAFT */
        const openDraft = () => {
            window.open(process.env.BASE_URL + 'draft/' + project_id, '_blank')  
        }

        /* SHARE */
        // forkability
        // change fork from switch
        const changeForkable = (value) => {
            updateProjectSettings('forkable', value)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
        const forkable = computed({
            get: () => settings.value.forkable,
            set: val => changeForkable(val)
        })
        // public
        // change public from switch
        const changeisPublic = (value) => {
            updateProjectSettings('public', value)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
        const isPublic = computed({
            get: () => settings.value.public,
            set: val => changeisPublic(val)
        })

        // QR
        const qrImage = ref(null)
        const generateQR = async (url) => {
            try {
                qrImage.value = await QRCode.toDataURL(url, { width: 400 })
            } catch (err) {
                console.error(err)
            }
        }

        // sharing
        const shared = ref(false)
        const sharing = ref(false)
        let sharedAddress = ref(null)
        let sharedProject = ref(null)
        const launchShareProject = () => {
            sharing.value = true
            // API call to share project
            shareProject(project_id)
              .then((r) => {
                if(r.code != 404) {
                    console.log(r.message)
                    // set shared and embed to readonly
                    document.querySelector('#copytextarea').setAttribute('readonly', 'true')
                    document.querySelector('#embedtextarea').setAttribute('readonly', 'true')
                    // update flags
                    sharing.value = false
                    shared.value = true
                    // update models
                    sharedProject.value = r.project
                    sharedAddress.value =  window.location.origin + process.env.BASE_URL + 'shared/' + sharedProject.value
                    //embedCode.value = '<iframe width="500" height="500" src="' + window.location.origin + process.env.BASE_URL + 'embed/' + sharedProject.value + '" title="Title" frameborder="0" allowfullscreen></iframe>'   
                    var url = window.location.origin + process.env.BASE_URL + 'embed/' + sharedProject.value
                    embedCode.value = ecGlobal(url)
                    // update project status
                    var children = settings.value.children
                    children.push(r.project)
                    updateProjectSettings('children', children, false)
                    updateProjectSettings('status', 'ws', false)
                    // generate QR
                    generateQR(sharedAddress.value)
                        .then(() =>  {
                            // go to modal bottom
                            var element = document.querySelector('.p-dialog-content')
                            element.scrollTop = element.scrollHeight - element.clientHeight
                            //console.log(element.scrollHeight, element.clientHeight)
                        })                    
                }
                else console.error(r.message)
              })
        }

        const copyShared = () => {
            const copyTextarea = document.querySelector('#copytextarea')
            copyTextarea.focus();
            copyTextarea.select();
            try {
                document.execCommand('copy')
                console.log('Text successfully copied into clipboard')
            } catch (err) {
                console.log('Oops, unable to copy')
            }
        }

        const openShared = () => {
            window.open(process.env.BASE_URL + 'shared/' + sharedProject.value, '_blank')
        }

        // embedding
        const ecGlobal = globals.embedCode
        /*var url = window.location.origin + process.env.BASE_URL + 'embed/' + project_id
        const embedCode = ecGlobal(url)*/
        let embedCode = ref(null)
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
            dialog, closeThisModal, hideDialog,
            openDraft,
            forkable, isPublic, shared, sharing, launchShareProject, sharedAddress, copyShared, openShared, qrImage,
            embedCode, copyEmbed
        }
    }
}
</script>

<style>
    h2.modal-share { margin-top:0;}
    .num-list { font-weight: bold; color: #6f96a9; }
    .shared-address { border:solid 1px #6f96a9; padding:5px; background: #f0f8ff; }
    .label-switch { margin-left: 10px; vertical-align:super; font-size:14px; }
    #copytextarea { user-select: none; }
    #embedtextarea { resize: none;}
    #qr-container { text-align: center;}
    #qr-container img { max-width: 100%; }
</style>