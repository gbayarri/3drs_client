<template>
    <Dialog v-model:visible="dialog.settings" 
            @show="onOpenDialog"
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="false" 
            :modal="true" 
            :baseZIndex="10"
            :style="{ width: '60vw' }">
        <template #header>
            <i class="fas fa-cog"></i> <h3>{{ header }}</h3>
        </template>

        <div class="p-grid">
            <div class="p-col">
                <label>{{ label_title }}</label>
            </div>
        </div>
        <div class="p-fluid p-grid">
            <div class="p-field p-col-12 p-md-12">
                <div class="p-input-icon-right">
                    <i class="pi pi-spin pi-spinner spinner-settings" v-show="updating.title" />
                    <InputText id="title" type="text" v-model="title" :placeholder="label_title" />
                    <!--<Button icon="pi pi-check" @click="saveSettingsInput" id="title" :disabled="title === null || title === ''" />-->
                </div>
                <label class="warning-title" v-show="titleEmpty">{{ warning_title }}</label>
            </div>
        </div>

        <div class="p-grid">
            <div class="p-col">
                <label v-html="label_caption"></label>
            </div>
        </div>
        <div class="p-fluid p-grid">
            <div class="p-col-12 p-md-12" style="position:relative;">
                <i class="pi pi-spin pi-spinner spinner-settings spinner-caption" v-show="updating.caption" />
                <Editor v-model="caption" :placeholder="caption_placeholder" editorStyle="height: 135px">
                    <template #toolbar>
                        <span class="ql-formats">
                            <button class="ql-bold"></button>
                            <button class="ql-italic"></button>
                            <button class="ql-underline"></button>
                            <button class="ql-link"></button>
                        </span>
                        <span class="ql-formats">
                            <button class="ql-clean"></button>
                        </span>
                    </template>
                </Editor>
            </div>
        </div>

        <div class="p-grid">
            <div class="p-md-4 p-col-12">
                <label>{{ label_fork }}</label>
            </div>
            <div class="p-md-4 p-col-12">
                <label>{{ label_public }}</label>
            </div>
            <div class="p-md-4 p-col-12">
                <label>{{ label_toasts }}</label>
            </div>
        </div>
        <div class="p-fluid p-grid">
            <div class="p-field p-col-12 p-md-4">
                <InputSwitch v-model="forkable" class="margin-top-5" /> 
            </div>
            <div class="p-field p-col-12 p-md-4">
                <InputSwitch v-model="isPublic" class="margin-top-5" /> 
            </div>
            <div class="p-field p-col-12 p-md-4">
                <InputSwitch v-model="toasts" class="margin-top-5" /> 
            </div>
        </div>

        <div class="p-grid">
            <div class="p-md-4 p-col-12">
                <label>{{ label_creation }}</label>
            </div>
            <!--<div class="p-md-4 p-col-12">
                <label>{{ label_update }}</label>
            </div>-->
            <div v-if="expires" class="p-md-4 p-col-12">
                <label>{{ label_expiration }}</label>
            </div>
        </div>
        <div class="p-fluid p-grid">
            <div class="p-field p-col-12 p-md-4 settings-dates">
                {{ creationDate }}
                <span>{{ creationTime }}</span>
            </div>
            <!--<div class="p-field p-col-12 p-md-4 settings-dates">
                {{ lastUpdate }}
                <span>{{ lastUpdateTime }}</span>
            </div>-->
            <div v-if="expires" class="p-field p-col-12 p-md-4 settings-dates expiring-date">
                {{ expirationDate }}
            </div>
        </div>

        <template #footer>
            <Button label="Close" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
import useProjectSettings from '@/modules/structure/useProjectSettings'
export default {
    components: {  },
    setup() {

        const { dialog, closeModal } = useModals()
        const { getProjectSettings, updateProjectSettings, updateProjectSettingsTimeout } = useProjectSettings()

        const settings = computed(() => getProjectSettings())
        const expires = computed(() => getProjectSettings().status === 'w' || getProjectSettings().status === 'wf')
        const creationDate = new Date(settings.value.uploadDate.date).toLocaleDateString("en-GB")
        const creationTime = new Date(settings.value.uploadDate.date).toLocaleTimeString("en-GB")
        //const lastUpdate = computed(() => new Date(settings.value.lastUpdate.date).toLocaleDateString("en-GB"))
        //const lastUpdateTime = computed(() => new Date(settings.value.lastUpdate.date).toLocaleTimeString("en-GB"))
        const expirationDate = new Date(settings.value.expiration.date).toLocaleDateString("en-GB")
        const daysToExpire = Math.floor((new Date(settings.value.expiration.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))

        const updating = reactive({
            title: false,
            caption: false
        })
        const shortTimeOut = 1000
        let myTimeOut = null
        
        const onOpenDialog = () => {
            if(expires.value) {
                let col = null
                // expiring color
                if(daysToExpire > 15) {
                    col = '#6f96a9'
                } else if(daysToExpire <= 15 && daysToExpire > 5) {
                    col = '#e2893b'
                } else if(daysToExpire <= 5) {
                    col = '#c00'
                }
                document.querySelector(".expiring-date").style.color = col
            }
        }

        /* MODAL */
        const page = reactive({
            header: "Project settings",
            label_title: "Project title",
            warning_title: "Warning! If title is empty, nothing will be shown as project description",
            label_caption: "Representation caption (use <strong>Ctrl+Shift+V</strong> to copy without format)",
            caption_placeholder: "Please add here description, author(s), links and so on.\nUse the buttons above for adding bold (B), italic (I), underline (U) and links.\nUse clean button (Tx) for cleaning format or paste with Ctrl+Shift+V.",
            label_fork:  "Fork project when shared",
            label_public: "Make project public",
            label_toasts: "Overlay messages",
            /*status_fork:  computed(() => forkable.value ? "Enabled" : "Disabled"),
            status_toasts: computed(() => toasts.value ?  "Enabled" : "Disabled"),*/
            label_creation: "Creation date",
            label_update: "Last update",
            label_expiration: "Expiration date",
        })

        const closeThisModal = () => {
            closeModal('settings')
        }

        /* FORM */

        const showSpinner = (v) => {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => {
                updating[v] = true
            }, shortTimeOut)
        }

        // title
        const titleEmpty = computed(() => (settings.value.title === null || settings.value.title === ""))
        // change title
        const changeTitle = (value) => {
            showSpinner('title')
            updateProjectSettingsTimeout('title', value)
                .then((r) => {
                    if(r.code != 404) {
                        updating.title = false
                        console.log(r.message)
                    }
                    else console.error(r.message)
                })
        }
        const title = computed({
            get: () => settings.value.title,
            set: val => changeTitle(val)
        })

        // caption

        // change caption
        const changeCaption = (value) => {
            showSpinner('caption')
            updateProjectSettingsTimeout('caption', value)
                .then((r) => {
                    if(r.code != 404) {
                        updating.caption = false
                        console.log(r.message)
                    }
                    else console.error(r.message)
                })
        }
        const caption = computed({
            get: () => settings.value.caption,
            set: val => changeCaption(val)
        })

        // fork

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

        // toasts

        // change toasts from switch
        const changeToasts = (value) => {
            updateProjectSettings('toasts', value)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }
        const toasts = computed({
            get: () => settings.value.toasts,
            set: val => changeToasts(val)
        })

        return { 
            updating,
            onOpenDialog,
            expires, creationDate, creationTime, /*lastUpdate, lastUpdateTime,*/ expirationDate,
            ...toRefs(page), dialog, closeThisModal,
            title, titleEmpty, caption, forkable, isPublic, toasts
        }
    }
}
</script>

<style>
    .settings-dates { font-weight: 700; color:#6f96a9; font-size: 20px;}
    .settings-dates span { display:block; font-weight: 400; font-size: 16px; line-height:10px; }
    .spinner-settings { color:#6f96a9!important; }
    .spinner-caption { color:#6f96a9!important; position: absolute; right: 1rem; bottom: 1rem; z-index: 1; }
    .label-switch { margin-left: 10px; vertical-align:super; font-size:14px; }
    .warning-title { color: #faa60b; margin-bottom:0!important; }
</style>