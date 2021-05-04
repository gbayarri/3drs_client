<template>
    <Dialog v-model:visible="dialog.align" 
            @hide="hideDialog"
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw', opacity:'0.95' }">
        <template #header>
            <i class="far fa-clone"></i> <h3>{{ header }}</h3>
        </template>

        <p class="margin-bottom-30">Please select <strong>two structures</strong> from the list below and <strong>fill the selection</strong> for each structure. If you need help with <strong>NGL viewer Selection Language</strong>, 
            <a v-bind:href="nglHelp" target="_blank" style="font-weight: bold;">click here</a>.</p>

        <div v-for="(file, index) in filesList" :key="file.id" :class="'p-grid p-jc-start p-field-checkbox ' + ((index % 2 === 0) ? 'even-line' : 'odd-line')">
            <div class="p-col-3">
                <Checkbox :id="file.id" name="file" :value="file" v-model="structures" />
                <label :for="file.id" class="label-checkbox">{{file.name}}</label>
            </div>
            <div class="p-col-4">
                <InputText v-model="selections[file.id]" :placeholder="placeholderSel"/>
            </div>
        </div>

        <template #footer>
            <Button :label="labelApply" icon="pi pi-check" @click="applySuperposition" :disabled="applyDisabled" />
            <Button :label="labelClose" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { computed, ref, reactive, toRefs } from 'vue'
import { useToast } from 'primevue/usetoast'
import structureStorage from '@/modules/structure/structureStorage'
import useStage from '@/modules/ngl/useStage'
import structureSettings from '@/modules/structure/structureSettings'
import useModals from '@/modules/common/useModals'
import useAPI from '@/modules/api/useAPI'
import useProjectSettings from '@/modules/structure/useProjectSettings'
export default {
    components: {  },
    setup() {

        const { projectData } = structureStorage()
        const { createSuperposition } = useStage()
        const { getFileNames } = structureSettings()
        const { dialog, closeModal } = useModals()
        const { updateProjectData } = useAPI()
        const { getProjectSettings } = useProjectSettings()
        
        const dataProject = computed(() => projectData.value)
        const filesList = computed(() => getFileNames())
        const toastSettings = computed(() => getProjectSettings().toasts) 
        const toast = useToast()

        const structures = ref([])
        const selections = ref([])

        const superpositions = dataProject.value.superpositions

        const applyDisabled = computed(() => structures.value.length !== 2)

        /* MODAL */

        const page = reactive({
            header:'Superpose structures',
            labelClose: 'Close',
            labelApply: 'Apply Superposition',
            placeholderSel: 'Selection, e.g. :A',
            nglHelp: process.env.VUE_APP_NGL_HELP_URL
        })

        const closeThisModal = () => {
            closeModal('align')
        }

        // when closing modal, hide shared block and clean copytextarea and embedtextarea
        const hideDialog = () => {
            structures.value = []
            selections.value = []
        }

        /* SUPERPOSITION */

        const applySuperposition = () => {

            const str1 = structures.value[0].id
            const str2 = structures.value[1].id
            const sele1 = selections.value[str1] ? selections.value[str1].toUpperCase() : ''
            const sele2 = selections.value[str2] ? selections.value[str2].toUpperCase() : ''

            createSuperposition(str1, str2, sele1, sele2)

            if(toastSettings.value) {
                toast.add({ 
                    severity: 'info', 
                    summary: 'New superposition', 
                    detail: 'The structures ' 
                             + structures.value[0].name 
                             + ' and '
                             +  structures.value[1].name 
                             + ' have been superposed',
                    life: 10000
                })
            }

            superpositions.push({
                st1: str1,
                st2: str2,
                sl1: sele1,
                sl2: sele2
            })
            
            updateProjectData(dataProject.value._id, { superpositions: superpositions })
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })

            structures.value = []
            selections.value = []

        }

        return { 
            ...toRefs(page), dialog, closeThisModal, hideDialog,
            filesList, structures, selections, 
            applyDisabled, applySuperposition,
        }
    }
}
</script>

<style>
    .label-checkbox { font-weight: 600; margin-left:0.5rem; }
    .even-line { background: #f1f1f1; margin-bottom:.5rem!important; }
    .odd-line { background: #d5dce0; margin-bottom:.5rem!important; }
</style>