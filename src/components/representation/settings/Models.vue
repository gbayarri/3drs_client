<template>
    <Panel :toggleable="models.length > 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-layer-group"></i> <div class="p-panel-title">{{ page.header }}</div>
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
import { ref, computed, watch } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
export default {
    setup() {

        const { updateCurrentModel, getCurrentModel, getModels } = structureSettings()

        const page = {
            header: "Models",
            label_models: "Model index"
        }

        // trick for creating reactivity with computed property
        //const watchedModel = computed(() => (getCurrentModel() + 1))
        //const selectedModel = ref(getCurrentModel() + 1)
        const selectedModel = computed({
            get: () => getCurrentModel() + 1,
            set: val => updateCurrentModel( val - 1 )
        })

        const models = computed(() => getModels())

        const isCollapsed = ref(true)
        //const isCollapsed = computed(() => (getModels().length <= 1))

        /*const onChange = (e) => {
            updateCurrentModel( selectedModel.value - 1 )
        }*/

        // TODO: REPLACE BY COMPUTED GETTER / SETTER
        // modifying isCollapsed & selectedModel v-model properties without computed()
        watch(models, (mods, prevMods) => {
            if(mods.length <= 1) isCollapsed.value = true
        })

        return { page, isCollapsed, selectedModel, models/*, onChange*/ }
    }
}
</script>

<style>
    .settings-panel.models .p-multiselect { width:100%; }
    .settings-panel.models .p-multiselect .p-multiselect-label:not(.p-placeholder) {
        padding-top: .25rem!important;
    }

</style>