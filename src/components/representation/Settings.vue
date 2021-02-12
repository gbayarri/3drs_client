<template>
    <Button icon="pi pi-angle-double-left" @click="visibleRight = true" class="**p-mr-2" id="settings-handle" />

    <Sidebar v-model:visible="visibleRight" :baseZIndex="1000" :dismissable="false" :modal="false" position="right" id="sidebar">
        <div id="sidebar-content">
            <TitleSettings title="structures" />
            <SelectFile />
            <MenuFile />
            <hr class="subsection" />
            <UploadFile />
            <hr />
            <TitleSettings title="models / chains" />
            <Models />
            <Chains />
            <hr class="subsection" />
            <TitleSettings title="representations" />
            <MainStructure />
            <Heteroatoms />
            <Metals />
            <Residues />
            <Water />
            <hr class="subsection" />
            <TitleSettings title="trajectory" />
            <Trajectory />
        </div>
    </Sidebar>
</template>

<script>
import { ref } from 'vue'
import TitleSettings from '@/components/representation/settings/TitleSettings'
import SelectFile from '@/components/representation/settings/SelectFile'
import UploadFile from '@/components/representation/settings/UploadFile'
import MenuFile from '@/components/representation/settings/MenuFile'
import Models from '@/components/representation/settings/Models'
import Chains from '@/components/representation/settings/Chains'
import MainStructure from '@/components/representation/settings/MainStructure'
import Heteroatoms from '@/components/representation/settings/Heteroatoms'
import Metals from '@/components/representation/settings/Metals'
import Residues from '@/components/representation/settings/Residues'
import Water from '@/components/representation/settings/Water'
import Trajectory from '@/components/representation/settings/Trajectory'
export default {
    components: { TitleSettings, SelectFile, UploadFile, MenuFile, Models, Chains, MainStructure, Heteroatoms, Metals, Residues, Water, Trajectory },
    setup() {

        let visibleRight = ref(false)

        return { visibleRight }
    }
}
</script>

<style>
    hr { margin:20px 0!important; }
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
    .p-sidebar { padding:0!important; background: transparent!important;
        /*background-image: url("~@/assets/img/logo_gray.png"); 
        background-color: #cccccc; 
        height: 500px; 
        background-position: center; 
        background-repeat: no-repeat;    */
    }
    .p-sidebar-right { width:20%; }
    .p-sidebar-content { position: relative; width: 100%; height: 100%; }
    #sidebar-content {  
        background-size:175px auto; 
        background-repeat: no-repeat; 
        background-image: url("~@/assets/img/logo_corner.png"); 
        background-color: rgb(123 141 160 / 0.95); 
        background-position: right bottom;
        width: 100%; 
        height: 100%; 
        padding: 10px 0; 
        overflow-y: auto; 
    }
    .p-sidebar .p-sidebar-close {
        position: absolute;
        left: -30px;
        top: 50%;
        cursor: pointer;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        background: rgb(123 141 160 / 0.95)!important;
        color: #fff!important;
        padding: 25px 15px;
        width: 30px!important;
        font-size: 20px;
        z-index: 2;
        border-radius: 5px 0 0 5px!important;
        box-shadow: -3px 0 3px -2px rgba(0,0,0,0.3);
    }
    .p-sidebar .p-sidebar-close .p-sidebar-close-icon::before { content: "\e92e"; }
    .p-sidebar .p-sidebar-close:focus { box-shadow: none!important;}

    h3.settings-title { 
        margin-left: 2.5%;
        /*line-height: 0;*/
        margin-top: 0;
        padding: 0;
        font-size: 15px;
        font-weight: 600;
        text-transform: uppercase;
        color: #fff;
    }

    /* panels */
    #sidebar .p-panel.p-component { background: #fff; padding: 0 0 1px 0; width: 95%; margin: 0 2.5% 5px; border-radius: 4px; }
    #sidebar .p-panel.p-panel-toggleable .p-panel-header { position:relative; padding: .7rem 1rem; background: #d0dfef!important; font-size: 14px; }
    #sidebar .p-panel.p-panel-toggleable .p-panel-header .p-panel-icons { position: absolute; right: 0; }
    #sidebar .p-panel.p-panel-toggleable .p-panel-content { font-size: 14px; }

    /* buttons */
    #sidebar .settings-button { width: 95%; margin: 0 2.5%; background:#fff; color:#6f96a9; text-align: left; }
    #sidebar .settings-button:hover { background:#546974; color:#fff; }
</style>