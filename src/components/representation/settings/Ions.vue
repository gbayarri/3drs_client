<template>
    <Panel :toggleable="modelIons.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="far fa-dot-circle"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="allSelected ? 'fas fa-times' : 'fas fa-check-double'" 
            class="p-button-rounded p-button-text" 
            @click="selectAll" 
            v-tooltip.left="ttpsa"
            :disabled="modelIons.length == 0" />
            <!--<Button icon="fas fa-eye" class="p-button-rounded p-button-text" />-->
        </template>
        
        <Listbox 
        v-model="selectedIons" 
        :options="modelIons" 
        :multiple="true" 
        :filter="true" 
        :filterPlaceholder="filterPlaceholder"
        optionLabel="name" 
        listStyle="max-height:200px" 
        style="width:100%"
        @change="onChange">
            <template #option="slotProps">
                <div>{{slotProps.option.name}}</div>
                <!--<i class="fab fas fa-eye"></i>-->
            </template>
        </Listbox>

    </Panel>
</template>

<script>
import { ref, reactive, computed, watch, toRefs } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import structureNavigation from '@/modules/structure/structureNavigation'
export default {
    setup() {

        const { getChainContent } = structureStorage()
        const { getCurrentChains } = structureNavigation()

        const isCollapsed = ref(true)
        const allSelected = ref(false)

        const page = reactive({
            header: "Ions",
            filterPlaceholder: "Search ion",
            ttpsa: "Select all ions"
        })

        let selectedIons = ref(null)

        /*const isCollapsed = ref(true)
        const header = "Ions"

        const filterPlaceholder = "Search ion"

        const selectedIons = ref(null)
        const ions =  [
            {name: 'K', code: 'K'},
            {name: 'Na', code: 'Na'},
            {name: 'Mn', code: 'Mn'}
        ]*/

        // trick for creating reactivity with computed property
        const watchedChains = computed(() => getCurrentChains())

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label)
            return allContent.filter(item => chains.includes(item.id))
        }

        const computeIonsList = (wch, label) => {
            const ions = []
            const ion_chains = getModelContent(wch, label)
            for(const chain of ion_chains) {
                for(const ion of chain.ions) {
                    ions.push({
                        name: chain.id.toUpperCase() + ': ' + ion.name + ' ' + ion.num,
                        id: chain.id.toUpperCase() + ':' + ion.num
                    })
                }
            }
            return ions
        }

        let modelIons = computed(() => computeIonsList(watchedChains.value, 'ions'))
        //console.log(modelIons.value)

        const selectAll = () => {
            page.ttpsa = allSelected.value ? 'Select all ions' : 'Unselect all ions'
            selectedIons.value = allSelected.value ? null : modelIons.value
            allSelected.value = !allSelected.value
        }

        watch([watchedChains, selectedIons], (newValues, prevValues) => {
            const wch = newValues[0]
            const sins = newValues[1]
            modelIons  =  computed(() => computeIonsList(wch, 'ions'))
            //console.log(modelIons.value)
            if(modelIons.value.length < 1) isCollapsed.value = true
            if(!sins || sins.length === 0) allSelected.value = false
            //if(sins.length === modelIons.value.length) allSelected.value = true
            //if(sins.length < modelIons.value.length) allSelected.value = false
        })

        const onChange = (e) => {
            //console.log(e.value)
            // TODO!!!! ADD TO NAVIGATION
            console.log(selectedIons.value)
        }

        return { 
            ...toRefs(page), isCollapsed, 
            modelIons,
            selectedIons, onChange,
            allSelected, selectAll
         }
    }
}
</script>

<style>
    
</style>