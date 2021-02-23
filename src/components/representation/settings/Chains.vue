<template>
    <Panel :toggleable="chains.length > 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-link"></i> <div class="p-panel-title">{{ header }}</div>
        </template>

        <!--<MultiSelect 
        v-model="selectedChains" 
        :options="chains" 
        optionLabel="name" 
        :placeholder="placeholder"
        @change="onChange" />-->

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
import { ref, computed, watch, onMounted } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import structureNavigation from '@/modules/structure/structureNavigation'
export default {
    setup() {

        const { getChains } = structureStorage()
        const { updateCurrentChains, getCurrentChains, getCurrentModel } = structureNavigation()

        const isCollapsed = ref(true)
        const header = "Chains"

        const placeholder = "Select Chains"

        // trick for creating reactivity with computed property
        const watchedChains = computed(() => getCurrentChains())
        const selectedChains = ref(getCurrentChains())
        watch(watchedChains, (chs) => {
            selectedChains.value = chs
        })


        //let selectedChains = ref(getCurrentChains())
        //const watchedChains = computed(() => getCurrentChains())
        //let selectedChains = null
        //const watchedChains = computed(() => getCurrentChains())
        /*const selectedChains = computed({ 
            get: () => getCurrentChains(),
            set: (value) => {
                for(var item of value) {
                    console.log(item.id, item.name)
                }
                return [
                    { name: 'Chain A', id: 'A' },
                    { name: 'Chain B', id: 'B' }
                ]
            }
        })*/

        //console.log(selectedChains.value[0])


        const chains = computed(() => getChains())
        //console.log(chains.value)

        const updateNav = () => {
            const chs = []
            for(const chain of selectedChains.value){
                chs.push(chain)
            }
            updateCurrentChains(chs )
        }

        const onChange = () => {
            //console.log('curr model: ', getCurrentModel())
            updateNav()
        }

        const removeChip = (e) => {
            selectedChains.value = selectedChains.value.filter(item => item.id !== e.path[1].innerText)
            updateNav()
        }

        // modifying isCollapsed v-model property without computed()
        watch(chains, (chs, prevchs) => {
            if(chs.length <= 1) isCollapsed.value = true
        })

        // watching chains according to its model
       /* watch(watchedChains, (chs, prevchs) => {
            //console.log(chs, prevchs)
            selectedChains = chs
            console.log(chs)
        })*/

        /*watch(() => [...selectedChains.value], (chs, prevchs) => {
            console.log(chs, prevchs);
        })*/


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