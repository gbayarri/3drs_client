<template>
    <div id="tools" >
        <div>
        <Reload :stage="stage" />
        <Rotate :stage="stage" />
        <Center :stage="stage" />
        <Background v-if="!isShared" />
        <FullScreen :stage="stage" />
        <Picture :stage="stage" />
        <Align v-if="!isShared" :stage="stage" />
        <Player v-if="isShared" :stage="stage" />
        <Help />
        <ProjectSettings v-if="!isShared" />
        </div>
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
import Player from '@/components/representation/tools/Player'
import Align from '@/components/representation/tools/Align'
import ProjectSettings from '@/components/representation/tools/ProjectSettings'
export default {
    components: { Reload, Rotate, Center, Background, FullScreen, Picture, Help, Player, Align, ProjectSettings },
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
    #tools { position: absolute; z-index: 2; left: 1%; top: 1%;  width:40px; }
    #tools .p-button.p-button-icon-only { width:auto; width:2.2rem; height:2rem; margin-top:.2rem; }
    @media (max-width: 600px) {
        #tools { left: 0; bottom: 2%; top:auto; width:100%; }
        #tools div { text-align: center; }
        #tools .p-button.p-button-icon-only { margin-right:.2rem; }
    }
</style>