<template>
    <Panel :toggleable="chains.length > 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-link"></i> <div class="p-panel-title">{{ page.header }}</div>
        </template>

        <MultiSelect 
        v-model="selectedChains" 
        :options="chains" 
        optionLabel="name" 
        :placeholder="page.placeholder" 
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
                    {{ page.placeholder }}
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
import { ref, computed, watch } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import structureNavigation from '@/modules/structure/structureNavigation'
export default {
    setup() {

        const { getChains } = structureStorage()
        const { updateCurrentChains, getCurrentChains } = structureNavigation()

        const isCollapsed = ref(true)

        const page = {
            header: "Chains",
            placeholder: "Select Chains"
        }

        // trick for creating reactivity with computed property
        const watchedChains = computed(() => getCurrentChains())
        const selectedChains = ref(getCurrentChains())

        const chains = computed(() => getChains())

        const updateNav = () => {
            const chs = []
            for(const chain of selectedChains.value){
                chs.push(chain)
            }
            updateCurrentChains(chs )
        }

        const onChange = () => {
            updateNav()
        }

        const removeChip = (e) => {
            selectedChains.value = selectedChains.value.filter(item => item.id !== e.path[1].innerText)
            updateNav()
        }

        // modifying isCollapsed & selectedChains v-model properties without computed()
        watch([watchedChains, chains], (newValues, prevValues) => {
            const wch = newValues[0]
            const chs = newValues[1]
            selectedChains.value = wch
            if(chs.length <= 1) isCollapsed.value = true
        })

        return { page, isCollapsed, selectedChains, chains, onChange, removeChip }
    }
}
</script>

<style>
    .settings-panel.chains .p-multiselect { width:100%; }
    .settings-panel.chains .p-multiselect .p-multiselect-label:not(.p-placeholder) {
        padding-top: .25rem!important;
    }
</style>