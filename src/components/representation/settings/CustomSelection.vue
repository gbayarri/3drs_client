<template>
  <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-user-cog"></i> <div class="p-panel-title">{{ header }}</div>
        </template>

        <div class="p-grid">
            <div class="p-col">
                <label>{{ label }} <i class="far fa-question-circle" id="custom-help" v-tooltip.top="ttp" @click="openHelp"></i></label>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col">
                <div class="p-inputgroup">
                    <InputText v-model="customSelection" :placeholder="placeholder"/>
                    <Button icon="pi pi-check" @click="handleClick"/>
                </div>
            </div>
        </div>

    </Panel>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

        let isCollapsed = ref(true)
        let customSelection = ref(null)
        const header = "Custom selection"
        const label = "Add custom selection"
        const ttp = 'Need help with NGL viewer Selection Language? Click here.'
        const placeholder = "e.g. 10:F.CA/0..."

        const openHelp = () => {
            window.open(process.env.VUE_APP_NGL_HELP_URL, '_blank')
        }

        const handleClick = () => {
            console.log(customSelection.value)
        }

        return { isCollapsed, customSelection, 
                header, label, ttp, placeholder, 
                openHelp, handleClick }
    }
}
</script>

<style>
    #custom-help { cursor:pointer; }
</style>