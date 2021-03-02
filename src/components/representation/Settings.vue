<template>
    <Button icon="pi pi-angle-double-left" 
    @click="visibleRight = true" 
    v-if="!visibleRight"
    id="settings-handle" />

    <Sidebar 
    v-model:visible="visibleRight" 
    :baseZIndex="1" 
    :dismissable="false" 
    :modal="false" 
    position="right" 
    @show="onSidebarShown"
    @hide="onSidebarHidden"
    id="sidebar">
        <div id="sidebar-content">
            <TitleSettings title="structures" />
            <SelectFile />
            <MenuFile />
            <hr class="subsection" />
            <UploadFile />
            <hr />
            <TitleSettings :title="tit_mod_chs" />
            <Models class="settings-panel models" />
            <Chains class="settings-panel chains" />
            <hr class="subsection" />
            <TitleSettings :title="tit_mols" />
            <Residues class="settings-panel residues" />
            <Heteroatoms class="settings-panel hetero" />
            <Ions class="settings-panel ions" />
            <Waters class="settings-panel water" />
            <CustomSelection class="settings-panel custom" />
            <hr class="subsection" />
            <TitleSettings :title="tit_traj" />
            <Trajectory />
        </div>
    </Sidebar>
</template>

<script>
import { ref } from 'vue'
import useFlags from '@/modules/common/useFlags'
import TitleSettings from '@/components/representation/settings/TitleSettings'
import SelectFile from '@/components/representation/settings/SelectFile'
import UploadFile from '@/components/representation/settings/UploadFile'
import MenuFile from '@/components/representation/settings/MenuFile'
import Models from '@/components/representation/settings/Models'
import Chains from '@/components/representation/settings/Chains'
import Heteroatoms from '@/components/representation/settings/Heteroatoms'
import Ions from '@/components/representation/settings/Ions'
import Residues from '@/components/representation/settings/Residues'
import Waters from '@/components/representation/settings/Waters'
import CustomSelection from '@/components/representation/settings/CustomSelection'
import Trajectory from '@/components/representation/settings/Trajectory'
export default {
    components: { TitleSettings, SelectFile, UploadFile, MenuFile, Models, Chains, Heteroatoms, Ions, Residues, Waters, CustomSelection, Trajectory },
    setup() {
        const visibleRight = ref(false)
        const { setFlagStatus } = useFlags()

        const tit_mod_chs = "models / chains"
        const tit_mols = "molecules"
        const tit_traj = "trajectory"

        const onSidebarShown = () => {
            setFlagStatus('sidebarEnabled', true)
        }

        const onSidebarHidden = () => {
            setFlagStatus('sidebarEnabled', false)
        }

        return { 
            visibleRight, onSidebarShown, onSidebarHidden, tit_mod_chs, tit_mols, tit_traj
        }
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
    .p-sidebar { padding:0!important; background: transparent!important; }
    .p-sidebar-right { width:25%; }
    .p-sidebar-content { position: absolute; width: 100%; height: 100%; z-index:10; }
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
        overflow-x: hidden;
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
    #sidebar .p-panel .p-panel-content { padding:0.5rem; }
    #sidebar .p-panel .p-panel-header { position:relative; padding: .7rem 1rem; background: #d0dfef!important; font-size: 14px; }
    #sidebar .p-panel:not(.p-panel-toggleable) .p-panel-header { background: #f5faff!important; color:#b4c6d6!important; cursor: not-allowed; }
    #sidebar .p-panel .p-panel-header .p-panel-icons { position: absolute; right: 0; }
    #sidebar .p-panel .p-panel-content { font-size: 14px; }

    /* buttons */
    #sidebar .settings-button { width: 95%; margin: 0 2.5%; background:#fff; color:#6f96a9; text-align: left; }
    #sidebar .settings-button:hover { background:#546974; color:#fff; }
    #sidebar .p-panel .p-panel-header .p-button:disabled { color: #b4c6d6;}

    .settings-panel button.p-button-rounded.p-button-text { height: 1.8rem; width: 1.8rem; font-size: 13px; color:#6c757d; }
    .settings-panel button.p-button-rounded.p-button-text:hover { color:#fff; background:#849096!important; }

    /* dowpdown */ 
    .settings-panel .p-dropdown { width:100%; margin:0; }

    /* chips */
    .settings-panel .p-chip { margin-right: 0.2rem; font-size:12px; font-weight: 600; background-color: #6f96a9; color:#fff; }
    .settings-panel .p-chip .pi { margin-left: 0.2rem; font-size:12px; }
    
    /* listbox */
    .settings-panel .p-listbox { border:none; }
    .settings-panel .p-listbox .p-listbox-list { padding:0; }
    .settings-panel .p-listbox .p-listbox-list .p-listbox-item { justify-content:space-between; display:flex; }
    .settings-panel .p-listbox .p-listbox-list .p-listbox-item i { font-size:14px; color:#88939c; margin-top:3px; }

    /* slider */
    .settings-panel .p-slider.p-slider-horizontal { width: 95%; margin: 0 2.5%; }
    .settings-panel .p-slider .p-slider-range { background: #6f96a9; }
    .settings-panel .p-slider .p-slider-handle { border-color: #6f96a9; }
    .settings-panel .p-slider:not(.p-disabled) .p-slider-handle:hover { background: #6f96a9;  border-color: #6f96a9; }
    .settings-panel .slider-value { text-align:right; font-weight: 700;}

</style>