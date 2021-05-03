<template>
    <Dialog v-model:visible="dialog.hierarchy" 
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw' }">
        <template #header>
            <i class="fas fa-sitemap"></i> <h3>{{ header }}</h3>
        </template>
        <Tree :value="nodes" :expandedKeys="expandedKeys" ></Tree>
        <template #footer>
            <Button :label="labelClose" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useSelections from '@/modules/representations/useSelections'
export default {
    setup() {

        const { dialog, closeModal } = useModals()
        const { currentStructure, getFileNames } = structureSettings()
        const { getCurrentRepresentationSettings, getHierarchy } = useRepresentations()
        const { selection } = useSelections()

        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const selections = computed(() => selection.value)
        const filesList = computed(() => getFileNames())

        const page = reactive({
            header: computed(() => 'Hierarchy map for ' + currReprSettings.value.name),
            labelClose: 'Close'
        })

        const nodes = computed(() => getHierarchy(selections, filesList))
        const expandedKeys = computed(() => {
            return {
                [currReprSettings.value.id]: true,
                [currReprSettings.value.id + '-' + currentStructure.value]: true
            }
        })
    
        const closeThisModal = () => {
            closeModal('hierarchy')
        }

        return { ...toRefs(page), dialog, closeThisModal, nodes, expandedKeys }
    }
}
</script>

<style>
    .p-tree .p-tree-container .p-treenode .p-treenode-content { padding:.3rem!important; }
    .p-tree .p-tree-container .p-treenode .p-treenode-content:focus,
    .p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler:focus { box-shadow: none!important;}
    .default-class .p-treenode-label, .default-class .p-treenode-icon { color:#b9b7b7!important; border-color: #b9b7b7!important; }
    .p-treenode-icon { border: 2px solid #6c757d; padding:6px; border-radius: 15px; font-size:13px; min-width: 29px; text-align: center;}
</style>