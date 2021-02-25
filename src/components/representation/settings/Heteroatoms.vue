<template>
    <Panel :toggleable="modelHeteroatoms.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fab fa-hubspot fa-lg"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="allSelected ? 'fas fa-times' : 'fas fa-check-double'" 
            class="p-button-rounded p-button-text" 
            @click="selectAll" 
            v-tooltip.left="ttpsa"
            :disabled="modelHeteroatoms.length == 0" />
            <!--<Button icon="fas fa-eye" class="p-button-rounded p-button-text" />-->
        </template>

        <Listbox 
        v-model="selectedHets" 
        :options="modelHeteroatoms" 
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
            header: "Heteroatoms",
            filterPlaceholder: "Search heteroatom",
            ttpsa: "Select all heteroatoms"
        })

        let selectedHets = ref(null)

        // trick for creating reactivity with computed property
        const watchedChains = computed(() => getCurrentChains())

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label)
            return allContent.filter(item => chains.includes(item.id))
        }

        const computeHeteroList = (wch, label) => {
            const hets = []
            const het_chains = getModelContent(wch, label)
            for(const chain of het_chains) {
                for(const het of chain.heteroatoms) {
                    hets.push({
                        name: chain.id.toUpperCase() + ': ' + het.name + ' ' + het.num,
                        id: chain.id.toUpperCase() + ':' + het.num
                    })
                }
            }
            return hets
        }

        let modelHeteroatoms = computed(() => computeHeteroList(watchedChains.value, 'heteroatoms'))
        //console.log(modelHeteroatoms.value)

        const selectAll = () => {
            page.ttpsa = allSelected.value ? 'Select all heteroatoms' : 'Unselect all heteroatoms'
            selectedHets.value = allSelected.value ? null : modelHeteroatoms.value
            allSelected.value = !allSelected.value
        }

        watch([watchedChains, selectedHets], (newValues, prevValues) => {
            const wch = newValues[0]
            const shts = newValues[1]
            modelHeteroatoms  =  computed(() => computeHeteroList(wch, 'heteroatoms'))
            //console.log(modelHeteroatoms.value)
            if(modelHeteroatoms.value.length < 1) isCollapsed.value = true
            if(!shts || shts.length === 0) allSelected.value = false
        })

        const onChange = (e) => {
            //console.log(e.value)
            // TODO!!!! ADD TO NAVIGATION
            console.log(selectedHets.value)
        }

        return { 
            ...toRefs(page), isCollapsed, 
            modelHeteroatoms,
            selectedHets, onChange,
            allSelected, selectAll
        }
    }
}
</script>

<style>
    
</style>