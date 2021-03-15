<template>
    <Panel :toggleable="modelIons.length >= 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="far fa-dot-circle"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="allSelected ? 'fas fa-times-circle' : 'fas fa-check-circle'" 
            class="p-button-rounded p-button-text" 
            style="font-size:16px;" 
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
                <div
                    @mouseover="onHover(slotProps.option.res)"
                    @mouseleave="onLeave(slotProps.option.res)" >
                        <Button 
                        icon="fas fa-bullseye" 
                        class="p-button-rounded p-button-text" 
                        v-tooltip.left="ttpcv"
                        @click="centerIon(slotProps.option.res)"/>
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
            header: "Ions",
            filterPlaceholder: "Search ion",
            ttpsa: "Select all ions",
            ttpcv: "Center view on this ion"
        })

        let selectedIons = ref(null)

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
                        id: ion.num + ':' + chain.id.toUpperCase() + '/' + ion.model,
                        res: {
                            num: ion.num,
                            name: ion.name,
                            chain: chain.id.toUpperCase(),
                            model: ion.model
                        }
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

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        watch([watchedChains, selectedIons], (newValues, prevValues) => {
            const wch = newValues[0]
            const sins = newValues[1]
            modelIons  =  computed(() => computeIonsList(wch, 'ions'))
            //console.log(modelIons.value)
            if(modelIons.value.length < 1) isCollapsed.value = true
            if(!sins || sins.length === 0) allSelected.value = false
            if(sins && (sins.length === modelIons.value.length)) allSelected.value = true
            //if(sins.length < modelIons.value.length) allSelected.value = false
        })

        const centerIon = (v) => {
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
            console.log(selectedIons.value)
        }

        return { 
            ...toRefs(page), isCollapsed, 
            modelIons,
            selectedIons, onChange, onHover, onLeave, centerIon,
            allSelected, selectAll
         }
    }
}
</script>

<style>
    
</style>