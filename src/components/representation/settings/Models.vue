<template>
    <Panel :toggleable="models.length > 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-layer-group"></i> <div class="p-panel-title">{{ page.header }}</div>
        </template>
        <template #icons>
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="page.ttpst" 
            :disabled="models.length <= 1" />
        </template>
        <div class="p-grid double-col">
            <div class="p-col">
                <label>{{ page.label_models }}</label>
            </div>
            <div class="p-col slider-value">
                <label>{{ selectedModel }}</label>
            </div>
        </div>
        <div class="p-grid margin-top-5">
            <div class="p-col">
                <Slider v-model="selectedModel" :min="1" :max="models.length" :step="1" />
            </div>
        </div>


    </Panel>
</template>

<script>
import { ref, computed, watch, onUpdated } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
import useRepresentations from '@/modules/representations/useRepresentations'
import useSettings from '@/modules/settings/useSettings'
import useModals from '@/modules/common/useModals'
export default {
    setup() {

        const { currentStructure, updateCurrentModel, getCurrentModel, getModels } = structureSettings()
        const { currentRepresentation } = useRepresentations()
        const { setModelsSettings } = useSettings()
        const { openModal } = useModals()

        const currReprVal = computed(() => currentRepresentation.value)
        const currStr = computed(() => currentStructure.value)

        const page = {
            header: "Models",
            label_models: "Model index",
            ttpst: "Show tips for Models"
        }

        // trick for creating reactivity with computed property
        //const watchedModel = computed(() => (getCurrentModel() + 1))
        //const selectedModel = ref(getCurrentModel() + 1)
        const selectedModel = computed({
            get: () => getCurrentModel(currReprVal.value) + 1,
            // save with timeout (many calls at the same time)
            set: val => {
                updateCurrentModel((val - 1), currReprVal.value)
                setModelsSettings((val - 1), currStr.value, currReprVal.value)
                    .then((r) => {
                        if(r.code != 404) console.log(r.message)
                        else console.error(r.message)
                    })
            }
        })

        const models = computed(() => getModels(currReprVal.value))

        const isCollapsed = ref(true)
        //const isCollapsed = computed(() => (getModels().length <= 1))

        /*const onChange = (e) => {
            updateCurrentModel( selectedModel.value - 1 )
        }*/

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        // modifying isCollapsed & selectedModel v-model properties without computed()
        /*watch(models, (mods, prevMods) => {
            if(mods.length <= 1) isCollapsed.value = true
        })*/

        const showTips = () => {
             openModal('tips', 'models')
        }

        onUpdated(() => {
            if(models.value.length <= 1) isCollapsed.value = true
        })

        return { page, isCollapsed, selectedModel, models/*, onChange*/, showTips }
    }
}
</script>

<style>
    .settings-panel.models .p-multiselect { width:100%; }
    .settings-panel.models .p-multiselect .p-multiselect-label:not(.p-placeholder) {
        padding-top: .25rem!important;
    }

</style>