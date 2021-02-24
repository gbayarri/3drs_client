<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-share-alt"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            icon="far fa-clone fa-flip-horizontal" 
            class="p-button-rounded p-button-text" 
            @click="openOut" 
            v-tooltip.left="ttpoo"
            />
            <Button 
            :icon="allSelected ? 'fas fa-times' : 'fas fa-check-double'" 
            class="p-button-rounded p-button-text" 
            @click="selectAll" 
            v-tooltip.left="ttpsa" />
            <Button 
            :icon="allVisible ? 'fas fa-eye-slash' : 'fas fa-eye'" 
            @click="hideAll" 
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpha" 
            />
        </template>
        <div id="sequence-text">
            <div class="chain-sequence" v-for="(chain, index) in modelResidues" :key="index">
                <div class="chain-title" v-if="chain.residues.length > 0">Chain {{ chain.id }}</div>
                <Residue v-for="(item, index) in chain.residues" :key="index" :residue="item" :index="index" />
            </div>
        </div>
        
    </Panel>
</template>

<script>
import { ref, reactive, computed, watch, toRefs } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import structureNavigation from '@/modules/structure/structureNavigation'
import Residue from '@/components/representation/settings/residues/Residue'
export default {
    components: { Residue },
    setup() {

        const { getChainContent } = structureStorage()
        const { getCurrentChains } = structureNavigation()

        const isCollapsed = ref(true)
        const allSelected = ref(false)
        const allVisible = ref(false)

        const page = reactive({
            header: "Residues",
            label_models: "Model index",
            ttpha: "Hide all residues",
            ttpsa: "Select all residues",
            ttpoo: "View in external window"
        })
        
        // trick for creating reactivity with computed property
        const watchedChains = computed(() => getCurrentChains())
        //const selectedChains = ref(getCurrentChains())

        const getModelResidues = (wch) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allResidues = getChainContent('residues')
            const allSheets = getChainContent('sheets')
            const allHelixes = getChainContent('helixes')
            /*return [ 
                allResidues.filter(item => chains.includes(item.id)),  
                allSheets.filter(item => chains.includes(item.id)),
                allHelixes.filter(item => chains.includes(item.id))                
                ]*/
            return allResidues.filter(item => chains.includes(item.id))
        }

        const modelSheets = []
        const modelHelixes = []

        let modelResidues = computed(() => getModelResidues(watchedChains.value))
        console.log(modelResidues.value)

        // TODO!!!!
        const residues = []
        //const shownResidues = ref(getCurrentResidues())

        const openOut = () => {

        }

        const selectAll = () => {
            page.ttpsa = allSelected.value ? 'Select all the residues' : 'Unselect all the residues'
            const items = document.getElementsByClassName("sequence-item")
            for(const it of items) {
                if(!allSelected.value) {
                    if(it.className.indexOf('disabled') === -1) it.classList.add('sequence-item-hover')
                } else {
                    if(it.className.indexOf('disabled') === -1) it.classList.remove('sequence-item-hover')
                }
            }
            allSelected.value = !allSelected.value
        }

        const hideAll = () => {
            page.ttpha = allVisible.value ? 'Hide all residues' : 'Show all residues'
            allVisible.value = !allVisible.value
        }

        // modifying isCollapsed & selectedChains v-model properties without computed()
        watch([watchedChains/*, residues*/], (newValues, prevValues) => {
            const wch = newValues[0]
            let modelResidues  =  computed(() => getModelResidues(wch))
            console.log(modelResidues)
        })

        return { ...toRefs(page), isCollapsed,
        modelResidues, modelSheets, modelHelixes,
        openOut,
        allSelected, selectAll, hideAll, allVisible 
        }
    }
}
</script>

<style>
   #sequence-text {
        font-family: monospace;
        font-size: 14px !important;
        line-height: 35px;
        word-break: break-all;
    }
    #sequence-text .sequence-item { position:relative; z-index:1; padding:0 0.5px; cursor:default; }
    #sequence-text .sequence-item:not(.disabled) { cursor: pointer; }    
    #sequence-text .sequence-item:not(.disabled):hover,
    .sequence-item-hover {
        color: #fff;
        background: #5E738B;
    }
    #sequence-text .sequence-number {
        color: #325880;
        word-break: keep-all;
        cursor: default;
        position: relative;
        top: -1.1em;
        left: 3.1em;
        padding: 0px;
        margin-left: -3em;
        font-size: 80%;
    }
    #sequence-text .sheet {
        background: rgb(104, 158, 153);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 1.3em;
        left: 0;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 8px;
    }
    #sequence-text .sheet-arrow {
        color: rgb(104, 158, 153);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 0.6em;
        left: .7em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 22px;
    }
    #sequence-text .helix {
        background-repeat: no-repeat; 
        background-image: url("~@/assets/img/bg_helix.png"); 
        background-position: center bottom;
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 1.1em;
        left: 0.4em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 10px;
    }
</style>