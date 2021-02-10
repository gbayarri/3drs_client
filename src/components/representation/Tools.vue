<template>
    <div id="tools">
        <Reload />
        <Rotate />
        <Center />
        <FullScreen />
        <Picture />
        <Upload />
        <Align />
    </div>
</template>

<script>
import Reload from '@/components/representation/tools/Reload'
import Rotate from '@/components/representation/tools/Rotate'
import Center from '@/components/representation/tools/Center'
import FullScreen from '@/components/representation/tools/FullScreen'
import Picture from '@/components/representation/tools/Picture'
import Upload from '@/components/representation/tools/Upload'
import Align from '@/components/representation/tools/Align'
export default {
    components: { Reload, Rotate, Center, FullScreen, Picture, Upload, Align },

}
</script>

<style>
    #tools { position: absolute; z-index: 2; left: 1%; top: 1%; /*display: none;*/ width:40px; }
    #tools .p-button.p-button-icon-only { width:auto; width:2.2rem; height:2rem; margin-top:.2rem; }

</style>