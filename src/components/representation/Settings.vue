<template>
  <Button icon="pi pi-angle-double-left" @click="visibleRight = true" class="**p-mr-2" id="settings-handle" />

    <Sidebar v-model:visible="visibleRight" :baseZIndex="1000" :dismissable="false" :modal="false" position="right">
        <div id="sidebar-content"></div>
    </Sidebar>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

        let visibleRight = ref(false)

        return { visibleRight }
    }
}
</script>

<style>
    #settings-handle {
        position: absolute;
        right: 0px;
        top: 50%;
        cursor: pointer;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        background: #7b8da0;
        color: #fff;
        padding: 10px;
        width: 30px;
        font-size: 20px;
        z-index: 2;
        border-radius: 5px 0 0 5px;
        box-shadow: -3px 0 3px -2px rgba(0,0,0,0.3);
    }
    .p-sidebar { padding:0!important; }
    .p-sidebar-content {
        position: relative;
        width: 100%;
        height: 100%;
    }
    #sidebar-content { 
        background: #f00;
        width: 100%;
        height: 100%;
    }
    .p-sidebar .p-sidebar-close {
        position: absolute;
        left: -30px;
        top: 50%;
        cursor: pointer;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        background: #7b8da0!important;
        color: #fff!important;
        padding: 10px;
        width: 30px!important;
        font-size: 20px;
        z-index: 2;
        border-radius: 5px 0 0 5px!important;
        box-shadow: -3px 0 3px -2px rgba(0,0,0,0.3);
    }
</style>