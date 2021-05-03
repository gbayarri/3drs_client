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
                <InputText v-model="selections[index]" :placeholder="placeholderSel"/>
            </div>
        </div>

        <template #footer>
            <Button :label="labelApply" icon="pi pi-check" @click="applySuperposition" :disabled="applyDisabled" />
            <Button :label="labelClose" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { computed, ref, watch, reactive, toRefs } from 'vue'
import * as NGL from 'ngl'
import useStage from '@/modules/ngl/useStage'
import structureSettings from '@/modules/structure/structureSettings'
import useModals from '@/modules/common/useModals'
export default {
    components: {  },
    setup() {

        const { getStage } = useStage()
        const { getFileNames } = structureSettings()
        const { dialog, closeModal } = useModals()
        
        const stage = getStage()
        const filesList = computed(() => getFileNames())

        const structures = ref([])
        const selections = ref([])

        const applyDisabled = computed(() => structures.value.length !== 2)

        /* MODAL */

        const page = reactive({
            header:'Superpose structures',
            labelClose: 'Close',
            labelApply: 'Apply Superposition',
            placeholderSel: 'e.g. :A',
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
            //console.log(structures.value[0].name, selections.value)

            const c1 = stage.getComponentsByName(structures.value[0].id).list[0]
            const c2 = stage.getComponentsByName(structures.value[1].id).list[0]

            const s1 = c1.structure
            const s2 = c2.structure

            NGL.superpose(s1, s2, true, selections.value[0], selections.value[1])
            c1.updateRepresentations({ position: true })
            c1.autoView()

            // SAVE SUPERPOSITIONS TO DB:
            /* 
            superpositions: [
                { 
                    st1: "STRUCTUREID",
                    st2: "STRUCTUREID",
                    sl1: "SELECTION",
                    sl2: "SELECTION",
                }
            ]
            */
           // THEN, IN VIEWPORT, FOREACH superpositions, DO THE CODE ABOVE
           // MOVE THE CODE ABOVE TO ngl/useSuperposition.js AND REUSE IN VIEWPORT
           // CHECK WITH 4 STRUCTURES: 1GZM, 1U19, 3DQB, 3SN6

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