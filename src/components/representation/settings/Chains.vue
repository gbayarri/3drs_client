<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed" v-if="chains.length > 1">
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
                :label="option.id" 
                @remove="removeChip" 
                removable 
                v-for="option of slotProps.value" 
                :key="option.id" />
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
import { ref, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import structureNavigation from '@/modules/structure/structureNavigation'
export default {
    setup() {

        const { getChains } = structureStorage()
        const { updateNavigation, getCurrentChains } = structureNavigation()

        const isCollapsed = ref(true)
        const header = "Chains"

        const placeholder = "Select Chains"

        const selectedChains = ref(getCurrentChains())
        const chains = computed(() => getChains())

        const onChange = (e) => {
            const chs = []
            for(const chain of selectedChains.value){
                chs.push(chain)
            }
            updateNavigation('chain', chs )
        }

        const removeChip = (e) => {
            selectedChains.value = selectedChains.value.filter(item => item.code !== e.path[1].innerText)
            //console.log(selectedChains.value)
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