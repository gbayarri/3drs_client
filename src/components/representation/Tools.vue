<template>
    <div id="tools" >
        <Reload :stage="stage" />
        <Rotate :stage="stage" />
        <Center :stage="stage" />
        <Background />
        <FullScreen :stage="stage" />
        <Picture :stage="stage" />
        <Align v-if="!isShared" :stage="stage" />
        <Help />
        <ProjectSettings v-if="!isShared" />
    </div>
</template>

<script>
import { computed } from 'vue'
import useStage from "@/modules/ngl/useStage"
import useFlags from '@/modules/common/useFlags'
import Reload from '@/components/representation/tools/Reload'
import Rotate from '@/components/representation/tools/Rotate'
import Center from '@/components/representation/tools/Center'
import Background from '@/components/representation/tools/Background'
import FullScreen from '@/components/representation/tools/FullScreen'
import Picture from '@/components/representation/tools/Picture'
import Help from '@/components/representation/tools/Help'
import Align from '@/components/representation/tools/Align'
import ProjectSettings from '@/components/representation/tools/ProjectSettings'
export default {
    components: { Reload, Rotate, Center, Background, FullScreen, Picture, Help, Align, ProjectSettings },
    setup() {
        const { getStage } = useStage()
        const { flags } = useFlags()
        
        const isShared = computed(() => flags.isShared)
        const stage = getStage()
        return { stage, isShared }
    }
}
</script>

<style>
    #tools { position: absolute; z-index: 2; left: 1%; top: 1%; /*display: none;*/ width:40px; }
    #tools .p-button.p-button-icon-only { width:auto; width:2.2rem; height:2rem; margin-top:.2rem; }

</style>