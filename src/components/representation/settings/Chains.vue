<template>
    <Panel :toggleable="chains.length > 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-link"></i> <div class="p-panel-title">{{ page.header }}</div>
        </template>
        <template #icons>
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="page.ttpst" 
            :disabled="chains.length <= 1" />
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
                :key="option.id"
                @mouseover="onHover(option.id)"
                @mouseleave="onLeave(option.id)"
                />
                <template v-if="!slotProps.value || slotProps.value.length === 0">
                    {{ page.placeholder }}
                </template>
            </template>
            <template #option="slotProps">
                <div class="p-content"
                    @mouseover="onHover(slotProps.option.id)"
                    @mouseleave="onLeave(slotProps.option.id)">
                    <div>{{slotProps.option.name}}</div>
                </div>
            </template>
        </MultiSelect>

    </Panel>
</template>

<script>
import { ref, computed, watch, onUpdated } from 'vue'
import { useToast } from 'primevue/usetoast'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useSettings from '@/modules/settings/useSettings'
import useSelections from '@/modules/representations/useSelections'
import useModals from '@/modules/common/useModals'
import useProjectSettings from '@/modules/structure/useProjectSettings'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage

        const { currentStructure, getFileNames, updateCurrentChains, getCurrentChains, getCurrentModel, getChains } = structureSettings()
        const { currentRepresentation, getCurrentRepresentationSettings, setSelectionRepresentation } = useRepresentations()
        const { setChainsSettings } = useSettings()
        const { openModal } = useModals()
        const { getSelectionChains } = useSelections()
        const { getProjectSettings } = useProjectSettings()

        const currReprVal = computed(() => currentRepresentation.value)
        const currStr = computed(() => currentStructure.value)
        const currModel = computed(() => getCurrentModel(currReprVal.value))
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const component = computed(() => stage.compList.filter(item => item.parameters.name === currStr.value)[0])
        const filesList = computed(() => getFileNames())
        const toastSettings = computed(() => getProjectSettings().toasts) 

        const isCollapsed = ref(true)

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-' + currStr.value + '\-[a-z]*)', 'g'))

        const toast = useToast()

        const page = {
            header: "Chains",
            placeholder: "Select Chains",
            ttpst: "Show tips for Chains"
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
            const msg = updateCurrentChains(chs, currReprVal.value)
            const strName = filesList.value.filter(item => item.id === currStr.value)[0].name
            // TODO: update selection with some function of useSelection
            // show toast when added / removed chains
            // TODO: CLEAN chains, model, structure
            const [selection, structures] = getSelectionChains(selectedChains.value, currReprVal.value, currStr.value)
            //console.log(selection, structures)
            setChainsSettings(null, null, null, currReprVal.value)
                    .then((r) => {
                        if(r.code != 404) {
                            if(toastSettings.value) {
                                toast.add({ 
                                    severity: msg.status, 
                                    summary: msg.tit, 
                                    detail: msg.txt1
                                            + ' [ '
                                            + msg.chains
                                            + ' ] ' 
                                            + msg.txt2 
                                            + ' Model ' 
                                            + (getCurrentModel(currReprVal.value) + 1)
                                            + ' in ' 
                                            + strName 
                                            + ' structure of ' 
                                            + currReprSettings.value.name 
                                            + ' representation',
                                    life: 10000
                                })
                            }
                            // save selection representation
                            setSelectionRepresentation(stage, selection, structures, re.value, true)
                                .then((r) => {
                                    if(r.code != 404) console.log(r.message)
                                    else console.error(r.message)
                                })
                            console.log(r.message)
                        } else console.error(r.message) 
                    })
        }

        /*const onChange = () => {
            updateNav()
        }*/

        const removeChip = (e) => {
            //console.log(e)
            //selectedChains.value = selectedChains.value.filter(item => item.id !== e.path[1].innerText)
            updateNav(selectedChains.value.filter(item => item.id !== e.path[1].innerText))
        }

        const getOtherChains = (chains, impostor) => {
            let sele = `not (`
            for(const chain of chains) { 
                if(chain.id !== impostor) sele += `:${chain.id} or `
            }
            sele = sele.slice(0, -4)
            sele += `)`

            return sele
        }

        const onHover = (v) => {
            //console.log(currStr.value, currReprVal.value, v)
            let sele = null
            if(v === '@') sele =  '/' + currModel.value + ' and ' + getOtherChains(chains.value, '@')
            else sele = ':' + v + '/' + currModel.value
            const new_name = currStr.value + '-' + sele + '-hover'
            if(stage.getRepresentationsByName(new_name).list.length === 0) {
                component.value.addRepresentation( "spacefill", { 
                    name: new_name,
                    sele: '(' + sele + ')', 
                    opacity:.25, 
                    radius:2,
                    color:'#5E738B' 
                })
            }
        }

        const onLeave = (v) => {
            let sele = null
            if(v === '@') sele =  '/' + currModel.value + ' and ' + getOtherChains(chains.value, '@')
            else sele = ':' + v + '/' + currModel.value
            const re = currStr.value + '-' + sele + '-hover'
            for(const item of stage.getRepresentationsByName(re).list) {
                item.dispose()
            }
        }

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        // modifying isCollapsed & selectedChains v-model properties without computed()
        /*watch(chains, (chs, prevChs) => {
            if(chs.length <= 1) isCollapsed.value = true
        })*/

        const showTips = () => {
            openModal('tips', 'chains')
        }

        onUpdated(() => {
            if(chains.value.length <= 1) isCollapsed.value = true
        })

        return { page, isCollapsed, selectedChains, chains, /*onChange,*/ showTips, removeChip, onHover, onLeave }
    }
}
</script>

<style>
    .settings-panel.chains .p-multiselect { width:100%; }
    .settings-panel.chains .p-multiselect .p-multiselect-label:not(.p-placeholder) {
        padding-top: .25rem!important;
    }
    .settings-panel.chains .p-multiselect .p-multiselect-panel .p-multiselect-items .p-multiselect-item { padding: 0; }
    .settings-panel.chains .p-multiselect .p-multiselect-panel .p-multiselect-items .p-multiselect-item .p-checkbox { margin-left:1rem; }
    .settings-panel.chains .p-multiselect .p-multiselect-panel .p-multiselect-items .p-multiselect-item .p-content { width:100%;padding: .5rem 1rem; }    
</style>