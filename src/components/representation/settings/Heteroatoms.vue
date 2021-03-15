<template>
    <Panel :toggleable="modelHeteroatoms.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fab fa-hubspot fa-lg"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="allSelected ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;" 
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
                <div
                    @mouseover="onHover(slotProps.option.res)"
                    @mouseleave="onLeave(slotProps.option.res)" >
                        <Button 
                        icon="fas fa-bullseye" 
                        class="p-button-rounded p-button-text" 
                        v-tooltip.left="ttpcv"
                        @click="centerHetero(slotProps.option.res)"/>
                        <span>{{slotProps.option.name}}</span>
                </div>
            </template>
        </Listbox>

    </Panel>
</template>

<script>
import { ref, reactive, computed, watch, toRefs } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
import useLegend from '@/modules/viewport/useLegend'
import useFlags from '@/modules/common/useFlags'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage

        const { updateLegend } = useLegend()
        const { setFlagStatus } = useFlags()
        const { currentStructure, getCurrentChains, getChainContent, getFileNames } = structureSettings()

        const filesList = computed(() => getFileNames())
        const currStr = computed(() => currentStructure.value)
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])
        const isCollapsed = ref(true)
        const allSelected = ref(false)

        const page = reactive({
            header: "Heteroatoms",
            filterPlaceholder: "Search heteroatom",
            ttpsa: "Select all heteroatoms",
            ttpcv: "Center view on this heteroatom"
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
                        id: het.num + ':' + chain.id.toUpperCase() + '/' + het.model,
                        res: {
                            num: het.num,
                            name: het.name,
                            chain: chain.id.toUpperCase(),
                            model: het.model
                        }
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

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        watch([watchedChains, selectedHets], (newValues, prevValues) => {
            const wch = newValues[0]
            const shts = newValues[1]
            modelHeteroatoms  =  computed(() => computeHeteroList(wch, 'heteroatoms'))
            //console.log(modelHeteroatoms.value)
            if(modelHeteroatoms.value.length < 1) isCollapsed.value = true
            if(!shts || shts.length === 0) allSelected.value = false
            if(shts && (shts.length === modelHeteroatoms.value.length)) allSelected.value = true
        })

        const centerHetero = (v) => {
            // TODO: SYNC WITH STAGE (IONS AS WELL!!!)
            console.log(v)
        }

        const onHover = (v) => {
            // NGL representation
            const sele = v.num + ':' + v.chain + '/' + v.model
            const new_name = currStr.value + '-' + sele + '-hover'
            if(stage.getRepresentationsByName(new_name).list.length === 0) {
                component.value.addRepresentation( "spacefill", { 
                    name: new_name,
                    sele: '(' + sele + ')', 
                    opacity:.5, 
                    radius:2,
                    color:'#5E738B' 
                })
            }
            // legend
            const name = filesList.value.filter(item => item.id === currStr.value)[0].name
            updateLegend({
                name: name,
                chainname: v.chain,
                resname: v.name,
                resno: v.num,
                atomname: null
            })
            setFlagStatus('legendEnabled', true)
        }

        const onLeave = (v) => {
            // NGL representation
            const sele = v.num + ':' + v.chain + '/' + v.model
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
            // legend
            setFlagStatus('legendEnabled', false)
        }

        const onChange = (e) => {
            //console.log(e.value)
            // TODO!!!! ADD TO NAVIGATION
            console.log(selectedHets.value)
        }

        return { 
            ...toRefs(page), isCollapsed, 
            modelHeteroatoms,
            selectedHets, centerHetero, onChange, onHover, onLeave,
            allSelected, selectAll
        }
    }
}
</script>

<style>
    
</style>