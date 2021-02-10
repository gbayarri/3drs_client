<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-layer-group"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        Content
    </Panel>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

        let isCollapsed = ref(true)
        const header = "Models"

        return { header, isCollapsed }
    }
}
</script>

<style>
    
</style>