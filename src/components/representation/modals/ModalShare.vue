<template>
    <Dialog v-model:visible="dialog.share" 
            :closable="!sharing"
            :closeOnEscape="!sharing" 
            :dismissableMask="!sharing" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '70vw' }">
        <template #header>
            <i class="fas fa-share-square"></i> <h3>{{ header }}</h3>
        </template>

        <p>If your project is ready for sharing, <strong>please follow the next steps</strong>:</p>

        <p><span class="num-list">1)</span> First off, <strong>take a look to the project draft</strong>. It will show you the project the same way the final users will see it. Take into account 
        that <strong>this address shouldn't be shared</strong>, because until you <strong>generate a shared project</strong>, the current one will be <strong>expirable</strong>.</p>

        <p><Button :label="labelDraft" icon="fas fa-file-signature" @click="openDraft" :disabled="sharing" /></p>

        <p><span class="num-list">2)</span> Be sure that you agree with the <strong>forkability permissions</strong> for this project. You can allow or not other users to <strong>fork this project</strong> once it is
        shared:</p>

        <p><InputSwitch v-model="forkable" class="margin-top-5" :disabled="sharing" /> <span class="label-switch">{{ status_fork }}</span></p>
        
        <p><span class="num-list">3)</span> Finally, clicking the button below <strong>the shared project will be generated</strong> and you will be redirected to this shared project. 
        Remember that <strong>you can share the same project as many times as you want</strong>, but once a project is shared, the subsequent updates in the current representation <strong> won't
        be reflected </strong> in the previous shared projects. </p>

        <p><Button :label="labelShare" :icon="sharing ? 'fas fa-spinner fa-pulse' : 'fas fa-share'" @click="launchShareProject" :disabled="sharing" /></p>

        <!-- TODO: IT WILL APPEAR ONCE REST API HAS CREATED THE SHARED PROJECT -->
        <div v-if="shared">
            <p>For sharing it, <strong>you just need to copy and share the address below</strong>:</p>
            <p class="shared-address">{{ sharedAddress }}</p>
        </div>

        <template #footer>
            <Button :label="labelClose" icon="pi pi-times" @click="closeThisModal" :disabled="sharing" />
        </template>
    </Dialog>
</template>

<script>
import { ref, computed, reactive, toRefs } from 'vue'
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
            labelShare: computed(() => sharing.value ? "Sharing project, please don't close the tab" : "Share project"),
            status_fork: computed(() => forkable.value ? "Forkability enabled" : "Forkability disabled")
        })
        
        const closeThisModal = () => {
            closeModal('share')
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

        // sharing
        const shared = ref(false)
        const sharing = ref(false)
        let sharedAddress = ref(null)
        const launchShareProject = () => {
            sharing.value = true
            // API call to share project
            shareProject(project_id)
              .then((r) => {
                if(r.code != 404) {
                    // TODO: UPDATE PROJECT SETTINGS VAR (STATUS AND DATES(??))
                    console.log(r.message)
                    sharing.value = false
                    shared.value = true
                    sharedAddress.value =  window.location.origin + process.env.BASE_URL + 'shared/' + r.project
                    window.open(process.env.BASE_URL + 'shared/' + r.project, '_blank')
                }
                else console.error(r.message)
              })

        }

        return { 
            ...toRefs(page), 
            dialog, closeThisModal,
            openDraft,
            forkable, shared, sharing, launchShareProject, sharedAddress
        }
    }
}
</script>

<style>
    .num-list { font-weight: bold; color: #6f96a9; }
    .shared-address { border:solid 1px #6f96a9; padding:5px; background: #f0f8ff; }
    .label-switch { margin-left: 10px; vertical-align:super; font-size:14px; }
</style>