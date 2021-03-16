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
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
export default {
    setup() {

        const { updateCurrentChains, getCurrentChains, getChains } = structureSettings()
        const { currentRepresentation } = useRepresentations()
        const currReprVal = computed(() => currentRepresentation.value)

        const isCollapsed = ref(true)

        const page = {
            header: "Chains",
            placeholder: "Select Chains"
        }

        // trick for creating reactivity with computed property
        //const watchedChains = computed(() => getCurrentChains())
        //const selectedChains = ref(getCurrentChains())
        const selectedChains = computed({
            get: () => getCurrentChains(currReprVal.value),
            set: val => updateNav(val)
        })

        const chains = computed(() => getChains(currReprVal.value))
        //console.log(selectedChains.value)

        const updateNav = (value) => {
            const chs = []
            for(const chain of value){
                chs.push(chain)
            }
            updateCurrentChains(chs, currReprVal.value)
        }

        /*const onChange = () => {
            updateNav()
        }*/

        const removeChip = (e) => {
            //console.log(e)
            //selectedChains.value = selectedChains.value.filter(item => item.id !== e.path[1].innerText)
            updateNav(selectedChains.value.filter(item => item.id !== e.path[1].innerText))
        }

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        // modifying isCollapsed & selectedChains v-model properties without computed()
        watch(chains, (chs, prevChs) => {
            if(chs.length <= 1) isCollapsed.value = true
        })

        return { page, isCollapsed, selectedChains, chains, /*onChange,*/ removeChip }
    }
}
</script>

<style>
    .settings-panel.chains .p-multiselect { width:100%; }
    .settings-panel.chains .p-multiselect .p-multiselect-label:not(.p-placeholder) {
        padding-top: .25rem!important;
    }
</style>