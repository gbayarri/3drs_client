<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
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
import { ref } from 'vue'
export default {
    setup() {

        let isCollapsed = ref(true)
        const header = "Models"
        const placeholder = "Select Models"

        let selectedModel = ref({name: 'Model 1', code: '1'})

        const models = [
            {name: 'Model 1', code: '1'},
            {name: 'Model 2', code: '2'},
            {name: 'Model 3', code: '3'},
            {name: 'Model 4', code: '4'},
            {name: 'Model 5', code: '5'}
        ]

        const onChange = (e) => {
            console.log(e.value)
            console.log(selectedModel.value)
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