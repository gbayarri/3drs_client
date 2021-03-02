<template>
    <div id="zoomwindow" v-if="isActive" class="p-shadow-2" :class="{ 'open-settings': sidebarEnabled }">
        <div id="zoomw-header">
            <span><i :class="(windowType === 'residues') ? 'fas fa-share-alt' : 'fas fa-tint'"></i>&nbsp;&nbsp;{{ title }}</span>
            <div>
            <Button 
            :icon="checkAllSelected ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;"
            @click="selectAll" 
            v-tooltip.left="ttpsa" />
            <Button 
            icon="fas fa-window-close" 
            class="p-button-rounded p-button-text" 
            style="font-size:17px;"
            @click="closeWindow" />
            </div>
        </div>

        <div id="sequence-text" v-if="windowType === 'residues'">
            <div class="chain-sequence margin-bottom-10" v-for="(chain, index) in modelResidues" :key="index">
                <div class="chain-title margin-bottom-10" v-if="chain.residues.length > 0">Chain {{ chain.id }}</div>
                <Residue 
                v-for="(item, index) in chain.residues" 
                :key="index" 
                :residue="item" 
                :index="index" 
                :sheets="modelSheets" 
                :helixes="modelHelixes" 
                :window="true"
                />
            </div>
        </div>

        <div id="water-text" v-if="windowType === 'waters'">
            <div class="chain-water margin-bottom-10" v-for="(chain, index) in modelWater" :key="index">
                <div class="chain-title margin-bottom-10" v-if="chain.waters.length > 0">Chain {{ chain.id }}</div>
                <Water 
                v-for="(item, index) in chain.waters" 
                :key="index" 
                :water="item" 
                :index="index"
                :window="true"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { computed, watch, reactive, toRefs } from 'vue'
import useFlags from '@/modules/common/useFlags'
import useZoomWindow from '@/modules/representations/useZoomWindow'
import structureSettings from '@/modules/structure/structureSettings'
import Residue from '@/components/representation/settings/addons/Residue'
import Water from '@/components/representation/settings/addons/Water'
export default {
    components: { Residue, Water},
    setup() {
        
        const { flags, setFlagStatus } = useFlags()
        const { windowType, allSelected, setWindowType, toggleAllSelected  } = useZoomWindow()
        
        const { getCurrentChains, getChainContent } = structureSettings()

        const isActive = computed(() => flags.zoomWindowEnabled)
        const sidebarEnabled = computed(() => flags.sidebarEnabled)

        const page = reactive({
            title: computed(() => (windowType.value === 'residues') ? 'Residues' : 'Water'),
            ttpsa: computed(() => {
                const txt = !allSelected[windowType.value] ? "Select all " : "Unselect all "
                return txt + windowType.value 
            })
        })

        const closeWindow = () => {
            setWindowType('')
            setFlagStatus('zoomWindowEnabled', false)
        }

        const checkAllSelected = computed(() => allSelected[windowType.value] )

        // PUT THAT INSIDE WATER / RESIDUE???
        const selectAll = () => {
            //console.log(windowType.value)
            /*page.ttpsa = computed(() => (allSelected.value ? 'Select all ' + windowType.value : 'Unselect all ' + windowType.value))
            // select residues / waters
            const items = document.getElementsByClassName("sequence-item")
            for(const it of items) {
                if(!allSelected.value) {
                    if(it.className.indexOf('disabled') === -1) it.classList.add('sequence-item-selected')
                } else {
                    if(it.className.indexOf('disabled') === -1) it.classList.remove('sequence-item-selected')
                }
            }
            allSelected.value = !allSelected.value*/
            allSelected[windowType.value] = !allSelected[windowType.value]
        }

        // trick for creating reactivity with computed property
        const watchedChains = computed(() => getCurrentChains())

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label)
            return allContent.filter(item => chains.includes(item.id))
        }

        // **********************
        // RESIDUES
        // **********************

        let modelResidues = computed(() => getModelContent(watchedChains.value, 'residues'))
        let modelSheets = computed(() => getModelContent(watchedChains.value, 'sheets'))
        let modelHelixes = computed(() => getModelContent(watchedChains.value, 'helixes'))

        // **********************
        // WATERS
        // **********************

        let modelWater = computed(() => getModelContent(watchedChains.value, 'waters'))

        watch([watchedChains], (newValues, prevValues) => {
            const wch = newValues[0]
            // residues
            modelResidues  =  computed(() => getModelContent(wch, 'residues'))
            modelSheets = computed(() => getModelContent(wch, 'sheets'))
            modelHelixes = computed(() => getModelContent(wch, 'helixes'))
            if(windowType.value === 'residues' && modelResidues.value.length < 1) setFlagStatus('zoomWindowEnabled', false)
            // waters
            modelWater  =  computed(() => getModelContent(wch, 'waters'))
            if(windowType.value === 'waters' && modelWater.value.length < 1) setFlagStatus('zoomWindowEnabled', false)
        })

        return { 
            ...toRefs(page), windowType,
            isActive, sidebarEnabled,
            closeWindow,
            modelResidues, modelSheets, modelHelixes,
            modelWater,
            allSelected, selectAll, checkAllSelected
        }

    }

}
</script>

<style>
    #zoomwindow { 
        position: absolute;
        left:calc(2% + 38px); 
        top:1.5%;
        width:calc(100% - (4% + 95px + 1rem)); 
        min-height: calc(64px + .7rem);
        max-height:12rem; 
        background: rgba(255, 255, 255, .9); 
        z-index: 2;
        border-radius:5px;
        -moz-transition-duration: 0.35s;
        -webkit-transition-duration: 0.35s;
        -o-transition-duration: 0.35s;
        transition-duration: 0.35s;
        -moz-transition-timing-function: ease;
        -webkit-transition-timing-function: ease;
        -o-transition-timing-function: ease;
        transition-timing-function: ease;
    }
    #zoomwindow.open-settings { 
        width:calc(75% - (4% + 90px + 1rem));
        -moz-transition-duration: 0.3s;
        -webkit-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -moz-transition-timing-function: ease-out;
        -webkit-transition-timing-function: ease-out;
        -o-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
    }
    
    #zoomwindow #zoomw-header { 
        width:100%; 
        padding:.5rem; 
        justify-content: space-between; 
        display:flex; 
        align-items: center; 
        font-weight: 600; 
        font-size: 18px; 
        border-bottom: 1px solid #bfd1d2;
    }
    #zoomwindow #zoomw-header button.p-button-rounded.p-button-text { height: 1.8rem; width: 1.8rem; font-size: 13px; color:#6c757d; }
    #zoomwindow #zoomw-header button.p-button-rounded.p-button-text:hover { color:#fff; background:#849096!important; }

    #zoomwindow #sequence-text { width:100%; padding:.5rem; overflow-y: auto; overflow-x: hidden; max-height:8rem; font-size:18px!important; line-height: 45px; }
    #zoomwindow #sequence-text .chain-title { line-height:30px; font-size:16px; }
    #zoomwindow #sequence-text .sheet { font-size: 10px; }
    #zoomwindow #sequence-text .sheet-arrow { font-size: 28px; }

    #zoomwindow #water-text { width:100%; padding:.5rem; overflow-y: auto; overflow-x: hidden; max-height:8rem; font-size:18px!important; line-height: 35px; }
    #zoomwindow #water-text .chain-title { line-height:30px; font-size:16px; }

</style>