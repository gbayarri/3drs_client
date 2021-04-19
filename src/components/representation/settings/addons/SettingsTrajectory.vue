<template>
  <Panel :toggleable="true" v-model:collapsed="isCollapsed" class="margin-top-20">
        <template #header>
            <i class="fas fa-cog"></i> <div class="p-panel-title"> {{ header }}</div>
        </template>
        <template #icons>
            <Button 
            icon="far fa-lightbulb" 
            @click="showTips" 
            style="font-size:16px;"
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttpst" />
        </template>
        
        Settings

    </Panel>
</template>

<script>
import { ref, reactive, computed, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
export default {

    setup() {

        const { openModal } = useModals()

        const isCollapsed = ref(true)

        const page = reactive({
            header: "Trajectory settings",
            ttpst: "Show tips for trajectory settings"
        })

        const showTips = () => {
            openModal('tips', 'trajectory')
        }


        return  { ...toRefs(page), isCollapsed, showTips }

    }

}
</script>

<style>

</style>