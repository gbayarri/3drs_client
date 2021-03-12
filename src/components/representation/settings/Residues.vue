<template>
    <Panel :toggleable="modelResidues.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-share-alt"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="externalWindow ? 'fas fa-external-link-square-alt fa-flip-vertical' : 'fas fa-external-link-square-alt fa-flip-horizontal'" 
            class="p-button-rounded p-button-text"
            style="font-size:16px;" 
            @click="openOut" 
            v-tooltip.left="ttpoo"
            :disabled="modelResidues.length == 0"
            />
            <Button 
            :icon="checkAllSelected ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;"
            @click="selectAll" 
            v-tooltip.left="ttpsa"
            :disabled="modelResidues.length == 0" />
            <!--<Button 
            :icon="allVisible ? 'fas fa-eye-slash' : 'fas fa-eye'" 
            @click="hideAll" 
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpha" 
            />-->
        </template>
        <div id="sequence-text">
            <div class="chain-sequence margin-bottom-10" v-for="(chain, index) in modelResidues" :key="index">
                <div class="chain-title margin-bottom-10" v-if="chain.residues.length > 0">Chain {{ chain.id }}</div>
                <Residue 
                v-for="(item, index) in chain.residues" 
                :key="index" 
                :residue="item" 
                :index="index" 
                :sheets="modelSheets" 
                :helixes="modelHelixes" 
                :window="false"
                :stage="stage"
                />
            </div>
        </div>
        
    </Panel>
</template>

<script>
import { ref, reactive, computed, watch, toRefs } from 'vue'
import useFlags from '@/modules/common/useFlags'
import useZoomWindow from '@/modules/representations/useZoomWindow'
import structureSettings from '@/modules/structure/structureSettings'
import Residue from '@/components/representation/settings/addons/Residue'
export default {
    props: ['stage'],
    components: { Residue },
    setup(props) {

        const stage = props.stage
        const { flags, setFlagStatus } = useFlags()
        const { windowType, allSelected, setWindowType } = useZoomWindow()
        const { getCurrentChains, getChainContent } = structureSettings()

        const isCollapsed = ref(true)
        //const allSelected = ref(false)
        const externalWindow = computed(() => (flags.zoomWindowEnabled && windowType.value === 'residues'))
        //const allVisible = ref(false)

        const page = reactive({
            header: "Residues",
            //ttpha: "Hide all residues",
            ttpsa: "Select all residues",
            ttpoo: computed(() => (flags.zoomWindowEnabled && windowType.value === 'residues') ? 'Close external window' : 'View in external window')
        })

        const checkAllSelected = computed(() => allSelected['residues'] )
        
        // trick for creating reactivity with computed property
        const watchedChains = computed(() => getCurrentChains())

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label)
            return allContent.filter(item => chains.includes(item.id))
        }

        let modelResidues = computed(() => getModelContent(watchedChains.value, 'residues'))
        let modelSheets = computed(() => getModelContent(watchedChains.value, 'sheets'))
        let modelHelixes = computed(() => getModelContent(watchedChains.value, 'helixes'))
        /*console.log(modelResidues.value)
        console.log(modelSheets.value)
        console.log(modelHelixes.value)*/

        const openOut = () => {
            if(!externalWindow.value) {
                setWindowType('residues')
                setFlagStatus('zoomWindowEnabled', true)
            } else {
                setWindowType('')
                setFlagStatus('zoomWindowEnabled', false)
            }
        }

        const selectAll = () => {
            /*page.ttpsa = allSelected.value ? 'Select all residues' : 'Unselect all residues'
            const items = document.getElementsByClassName("sequence-item")
            for(const it of items) {
                if(!allSelected.value) {
                    if(it.className.indexOf('disabled') === -1) it.classList.add('sequence-item-selected')
                } else {
                    if(it.className.indexOf('disabled') === -1) it.classList.remove('sequence-item-selected')
                }
            }
            allSelected.value = !allSelected.value*/

            // TODO!!!! ADD TO NAVIGATION

            allSelected['residues'] = !allSelected['residues']
        }

        // TODO!!!! ADD TO NAVIGATION
        // FUNCTION onClick OR SIMILAR

        /*const hideAll = () => {
            page.ttpha = allVisible.value ? 'Hide all residues' : 'Show all residues'
            allVisible.value = !allVisible.value
        }*/

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        // modifying isCollapsed & selectedChains v-model properties without computed()
        watch([watchedChains], (newValues, prevValues) => {
            const wch = newValues[0]
            modelResidues  =  computed(() => getModelContent(wch, 'residues'))
            modelSheets = computed(() => getModelContent(wch, 'sheets'))
            modelHelixes = computed(() => getModelContent(wch, 'helixes'))
            //console.log(modelResidues.value)
            /*console.log(modelSheets.value)
            console.log(modelHelixes.value)*/
            if(modelResidues.value.length < 1) isCollapsed.value = true
        })

        return { 
            ...toRefs(page), isCollapsed, stage,
            modelResidues, modelSheets, modelHelixes,
            openOut, externalWindow,
            allSelected, selectAll, checkAllSelected
            /*hideAll, allVisible */
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
        overflow-y: auto; 
        overflow-x: hidden; 
        max-height:15rem;
    }
    #sequence-text .chain-title {
        font-family: 'Open Sans';
        background: #e1ebf7;
        padding-left: .5rem;
        line-height: 25px;
    }
    #sequence-text .sequence-item { position:relative; z-index:1; padding:0 0.5px; cursor:default; }
    #sequence-text .sequence-item:not(.disabled) { cursor: pointer; }    
    #sequence-text .sequence-item:not(.disabled):hover,
    .sequence-item-hover {
        color: #fff;
        background: #99a8b9;
    }
    .sequence-item-selected {
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