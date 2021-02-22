<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed" v-if="models.length > 1">
        <template #header>
            <i class="fas fa-layer-group"></i> <div class="p-panel-title">{{ header }}</div>
        </template>

        <Dropdown 
        v-model="selectedModel" 
        :options="models" 
        optionLabel="name" 
        :placeholder="placeholder" 
        @change="onChange" />

    </Panel>
</template>

<script>
import { ref, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import structureNavigation from '@/modules/structure/structureNavigation'
export default {
    setup() {

        const { getModels } = structureStorage()
        const { updateNavigation, getCurrentModel } = structureNavigation()

        const isCollapsed = ref(true)
        const header = "Models"
        const placeholder = "Select Models"

        const selectedModel = ref(getCurrentModel())
        const models = computed(() => getModels())

        const onChange = (e) => {
            updateNavigation('model', { name: selectedModel.value.name, id: selectedModel.value.id } )
        }

        return { header, placeholder, isCollapsed, selectedModel, models, onChange }
    }
}
</script>

<style>
    .settings-panel.models .p-multiselect { width:100%; }
    .settings-panel.models .p-multiselect .p-multiselect-label:not(.p-placeholder) {
        padding-top: .25rem!important;
    }

</style>