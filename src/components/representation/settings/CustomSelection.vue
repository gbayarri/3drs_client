<template>
  <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-user-cog"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpst" 
            />
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
import { ref, reactive, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
export default {
    setup() {

        const { openModal } = useModals()

        const isCollapsed = ref(true)
        const customSelection = ref(null)
        /*const header = "Custom selection"
        const label = "Add custom selection"
        const ttp = 'Need help with NGL viewer Selection Language? Click here.'
        const placeholder = "e.g. 10:F.CA/0..."*/

        const page = reactive({
            header: "Custom selection",
            label: "Add custom selection",
            ttp: "Need help with NGL viewer Selection Language? Click here.",
            placeholder: "e.g. 10:F.CA/0...",
            ttpst: "Show tips for Custom Selection"
        })

        const openHelp = () => {
            window.open(process.env.VUE_APP_NGL_HELP_URL, '_blank')
        }

        const handleClick = () => {
            console.log(customSelection.value)
        }

        const showTips = () => {
            openModal('tips', 'custom')
        }

        return { 
            ...toRefs(page), isCollapsed, customSelection, 
            openHelp, handleClick,
            showTips
        }
    }
}
</script>

<style>
    #custom-help { cursor:pointer; }
</style>