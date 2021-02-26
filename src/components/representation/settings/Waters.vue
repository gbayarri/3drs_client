<template>
    <Panel :toggleable="modelWater.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-tint"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="externalWindow ? 'fas fa-external-link-square-alt fa-flip-vertical' : 'fas fa-external-link-square-alt fa-flip-horizontal'" 
            class="p-button-rounded p-button-text"
            style="font-size:16px;" 
            @click="openOut" 
            v-tooltip.left="ttpoo"
            :disabled="modelWater.length == 0"
            />
            <Button 
            :icon="checkAllSelected ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;" 
            @click="selectAll" 
            v-tooltip.left="ttpsa"
            :disabled="modelWater.length == 0" />
            <!--<Button icon="fas fa-eye" class="p-button-rounded p-button-text" />-->
        </template>
        <div id="water-text">
            <div class="chain-water margin-bottom-10" v-for="(chain, index) in modelWater" :key="index">
                <div class="chain-title margin-bottom-10" v-if="chain.waters.length > 0">Chain {{ chain.id }}</div>
                <Water 
                v-for="(item, index) in chain.waters" 
                :key="index" 
                :water="item" 
                :index="index"
                :window="false"
                />
            </div>
        </div>
    </Panel>
</template>

<script>
import { ref, reactive, computed, watch, toRefs } from 'vue'
import useFlags from '@/modules/common/useFlags'
import useZoomWindow from '@/modules/representations/useZoomWindow'
import structureStorage from '@/modules/structure/structureStorage'
import structureNavigation from '@/modules/structure/structureNavigation'
import Water from '@/components/representation/settings/addons/Water'
export default {
    components: { Water },
    setup() {

        const { flags, setFlagStatus } = useFlags()
        const { windowType, allSelected, setWindowType } = useZoomWindow()
        const { getChainContent } = structureStorage()
        const { getCurrentChains } = structureNavigation()

        const isCollapsed = ref(true)
        //const allSelected = ref(false)
        const externalWindow = computed(() => (flags.zoomWindowEnabled && windowType.value === 'waters'))
        
        const page = reactive({
            header: "Water",
            //ttpha: "Hide all waters",
            ttpsa: "Select all waters",
            ttpoo: computed(() => (flags.zoomWindowEnabled && windowType.value === 'waters') ? 'Close external window' : 'View in external window')
        })

        const checkAllSelected = computed(() => allSelected['waters'] )

        // trick for creating reactivity with computed property
        const watchedChains = computed(() => getCurrentChains())

        const getModelContent = (wch, label) => {
            const chains = []
            for(const c of wch) chains.push(c.id)
            const allContent = getChainContent(label)
            return allContent.filter(item => chains.includes(item.id))
        }

        let modelWater = computed(() => getModelContent(watchedChains.value, 'waters'))
        //console.log(modelWater.value)

        const openOut = () => {
            if(!externalWindow.value) {
                setWindowType('waters')
                setFlagStatus('zoomWindowEnabled', true)
            } else {
                setWindowType('')
                setFlagStatus('zoomWindowEnabled', false)
            }
        }

        const selectAll = () => {
            /*page.ttpsa = allSelected.value ? 'Select all waters' : 'Unselect all waters'
            const items = document.getElementsByClassName("water-item")
            for(const it of items) {
                if(!allSelected.value) {
                    if(it.className.indexOf('disabled') === -1) it.classList.add('water-item-selected')
                } else {
                    if(it.className.indexOf('disabled') === -1) it.classList.remove('water-item-selected')
                }
            }
            allSelected.value = !allSelected.value*/

            // TODO!!!! ADD TO NAVIGATION

            allSelected['waters'] = !allSelected['waters']
        }

        // TODO!!!! ADD TO NAVIGATION
        // FUNCTION onClick OR SIMILAR

        watch([watchedChains], (newValues, prevValues) => {
            const wch = newValues[0]
            modelWater  =  computed(() => getModelContent(wch, 'waters'))
            //console.log(modelWater.value)
            if(modelWater.value.length < 1) isCollapsed.value = true
        })

        return { 
            ...toRefs(page), isCollapsed,
            modelWater,
            openOut, externalWindow,
            allSelected, selectAll, checkAllSelected
        }
    }
}
</script>

<style>
   #water-text {
        font-family: monospace;
        font-size: 14px !important;
        line-height: 35px;
        word-break: break-all;
        overflow-y: auto; 
        overflow-x: hidden; 
        max-height:15rem;
    }
    #water-text .chain-title {
        font-family: 'Open Sans';
        background: #e1ebf7;
        padding-left: .5rem;
        line-height: 25px;
    }
    #water-text .water-item { position:relative; z-index:1; padding:0 1.5px; cursor:default; }
    #water-text .water-item:not(.disabled) { cursor: pointer; }    
    #water-text .water-item:not(.disabled):hover,
    .water-item-hover {
        color: #fff;
        background: #99a8b9;
    }
    .water-item-selected {
        color: #fff;
        background: #5E738B;
    }
    #water-text .water-number {
        color: #325880;
        word-break: keep-all;
        cursor: default;
        position: relative;
        top: -1.1em;
        left: 3.1em;
        padding: 0;
        margin-left: -3em;
        font-size: 80%;
    }
</style>