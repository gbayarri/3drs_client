<template>
    <Dialog v-model:visible="dialog.settings" 
            @show="onOpenDialog"
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw' }">
        <template #header>
            <i class="fas fa-cog"></i> <h3>{{ header }}</h3>
        </template>

        <div class="p-grid">
            <div class="p-col">
                <label>{{ label_title }}</label>
            </div>
            <div class="p-col">
                <label>{{ label_author }}</label>
            </div>
        </div>
        <div class="p-fluid p-grid">
            <div class="p-field p-col-12 p-md-6">
                <div class="p-input-icon-right">
                    <i class="pi pi-spin pi-spinner spinner-settings" v-show="updating.title" />
                    <InputText id="title" type="text" v-model="title" :placeholder="label_title" />
                    <!--<Button icon="pi pi-check" @click="saveSettingsInput" id="title" :disabled="title === null || title === ''" />-->
                </div>
            </div>
            <div class="p-field p-col-12 p-md-6">
                <div class="p-input-icon-right">
                    <i class="pi pi-spin pi-spinner spinner-settings" v-show="updating.author" />
                    <InputText id="author" type="text" v-model="author" :placeholder="label_author" />
                    <!--<Button icon="pi pi-check" @click="saveSettingsInput" id="author" :disabled="author === null || author === ''" />-->
                </div>
            </div>
        </div>

        <div class="p-grid">
            <div class="p-col">
                <label>{{ label_fork }}</label>
            </div>
            <div class="p-col">
                <label>{{ label_toasts }}</label>
            </div>
        </div>
        <div class="p-fluid p-grid">
            <div class="p-field p-col-12 p-md-6">
                <InputSwitch v-model="forkable" class="margin-top-5" /> <!--<span class="label-switch">{{ status_fork }}</span>-->
            </div>
            <div class="p-field p-col-12 p-md-6">
                <InputSwitch v-model="toasts" class="margin-top-5" /> <!--<span class="label-switch">{{ status_toasts }}</span>-->
            </div>
        </div>

        <div class="p-grid">
            <div class="p-col">
                <label>{{ label_creation }}</label>
            </div>
            <div v-if="expires" class="p-col">
                <label>{{ label_expiration }}</label>
            </div>
        </div>
        <div class="p-fluid p-grid">
            <div class="p-field p-col-12 p-md-6 settings-dates">
                {{ creationDate }}
            </div>
            <div v-if="expires" class="p-field p-col-12 p-md-6 settings-dates expiring-date">
                {{ expirationDate }}
            </div>
        </div>

        <template #footer>
            <Button label="Close" icon="pi pi-times" @click="closeThisModal" />
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
        const expires = computed(() => getProjectSettings().status === 'w')
        const creationDate = new Date(settings.value.uploadDate.date).toLocaleDateString("en-GB")
        const expirationDate = new Date(settings.value.expiration.date).toLocaleDateString("en-GB")
        const daysToExpire = Math.floor((new Date(settings.value.expiration.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))

        const updating = reactive({
            title: false,
            author: false
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
            label_author: "Project author",
            label_fork:  "Fork project when shared",
            label_toasts: "Overlay messages",
            /*status_fork:  computed(() => forkable.value ? "Enabled" : "Disabled"),
            status_toasts: computed(() => toasts.value ?  "Enabled" : "Disabled"),*/
            label_creation: "Creation date",
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

        // author

        // change author
        const changeAuthor = (value) => {
            showSpinner('author')
            updateProjectSettingsTimeout('author', value)
                .then((r) => {
                    if(r.code != 404) {
                        updating.author = false
                        console.log(r.message)
                    }
                    else console.error(r.message)
                })
        }
        const author = computed({
            get: () => settings.value.author,
            set: val => changeAuthor(val)
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
            expires, creationDate, expirationDate,
            ...toRefs(page), dialog, closeThisModal,
            title, author, forkable, toasts
        }
    }
}
</script>

<style>
    .settings-dates { font-weight: 700; color:#6f96a9; font-size: 20px;}
    .spinner-settings { color:#6f96a9!important; }
    .label-switch { margin-left: 10px; vertical-align:super; font-size:14px; }
</style>