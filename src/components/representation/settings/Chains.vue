<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-link"></i> <div class="p-panel-title">{{ header }}</div>
        </template>

        <MultiSelect 
        v-model="selectedChains" 
        :options="chains" 
        optionLabel="name" 
        :placeholder="placeholder" 
        @change="onChange"
        class="multiselect-custom">
            <template #value="slotProps">
                <Chip 
                :label="option.code" 
                @remove="removeChip" 
                removable 
                v-for="option of slotProps.value" 
                :key="option.code" />
                <template v-if="!slotProps.value || slotProps.value.length === 0">
                    {{ placeholder }}
                </template>
            </template>
            <template #option="slotProps">
                <div class="">
                    <div>{{slotProps.option.name}}</div>
                </div>
            </template>
        </MultiSelect>

    </Panel>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

        const isCollapsed = ref(true)
        const header = "Chains"

        const placeholder = "Select Chains"

        const selectedChains = ref([
            {name: 'Chain A', code: 'A'},
            {name: 'Chain B', code: 'B'},
            {name: 'Chain C', code: 'C'},
            {name: 'Chain D', code: 'D'}
        ])

        const chains = [
            {name: 'Chain A', code: 'A'},
            {name: 'Chain B', code: 'B'},
            {name: 'Chain C', code: 'C'},
            {name: 'Chain D', code: 'D'}
        ]

        const onChange = (e) => {
            //console.log(e.value)
            console.log(selectedChains.value)
        }

        const removeChip = (e) => {
            selectedChains.value = selectedChains.value.filter(item => item.code !== e.path[1].innerText)
            console.log(selectedChains.value)
        }

        return { header, placeholder, isCollapsed, selectedChains, chains, onChange, removeChip }
    }
}
</script>

<style>
    .settings-panel.chains .p-multiselect { width:100%; }
    .settings-panel.chains .p-multiselect .p-multiselect-label:not(.p-placeholder) {
        padding-top: .25rem!important;
    }
</style>