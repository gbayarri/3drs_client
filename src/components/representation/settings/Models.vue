<template>
    <Panel :toggleable="models.length > 1" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-layer-group"></i> <div class="p-panel-title">{{ header }}</div>
        </template>

        <div class="p-grid double-col">
            <div class="p-col">
                <label>{{ label_models }}</label>
            </div>
            <div class="p-col slider-value">
                <label>{{ selectedModel }}</label>
            </div>
        </div>
        <div class="p-grid margin-top-5">
            <div class="p-col">
                <Slider v-model="selectedModel" :min="1" :max="models.length" :step="1" @change="onChange" />
            </div>
        </div>


    </Panel>
</template>

<script>
import { ref, computed, watch } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import structureNavigation from '@/modules/structure/structureNavigation'
export default {
    setup() {

        const { getModels } = structureStorage()
        const { updateCurrentModel, getCurrentModel } = structureNavigation()

        const header = "Models"
        const placeholder = "Select Models"
        const label_models = "Model index"

        // TODO: put in a watcher and make this number reactive!!!
        // CHECK getCurrentModel() FUNCTION WHEN CHANGE FILE
        const selectedModel = ref(getCurrentModel() + 1)
        const models = computed(() => getModels())
        const isCollapsed = ref(true)
        /*const isCollapsed = computed({ 
            get: () => {
                //if(getModels().length <= 1) return true
                console.log(getModels().length)
                return true
                //if(getModels().length > 1) return false
            },
            set: (value) => value
        }) */

        const onChange = (e) => {
            updateCurrentModel( selectedModel.value - 1 )
        }

        // modifying isCollapsed v-model property without computed()
        watch(models, (mods, prevmods) => {
            if(mods.length <= 1) isCollapsed.value = true
        })

        return { header, placeholder, label_models, isCollapsed, selectedModel, models, onChange }
    }
}
</script>

<style>
    .settings-panel.models .p-multiselect { width:100%; }
    .settings-panel.models .p-multiselect .p-multiselect-label:not(.p-placeholder) {
        padding-top: .25rem!important;
    }

</style>