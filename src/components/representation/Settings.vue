<template>

    <Button 
    v-if="reprList.length <= 1 || currReprVal === defaultRepresentation"
    id="settings-impostor"
    v-tooltip.left="ttdb"
    />

    <Button icon="pi pi-angle-double-left" 
    @click="visibleRight = true" 
    v-if="!visibleRight"
    id="settings-handle"
    :disabled="reprList.length <= 1 || currReprVal === defaultRepresentation" 
    v-tooltip.left="ttst"/>

    <!-- @show="onSidebarShown"
    @hide="onSidebarHidden"-->
    <Sidebar 
    v-model:visible="visibleRight" 
    :baseZIndex="1" 
    :dismissable="false" 
    :modal="false" 
    position="right" 
   
    id="sidebar">
        <div id="sidebar-content">
            <TitleSettings title="structures" />
            <SelectFile :stage="stage" />
            <MenuFile :stage="stage" />
            <!--<hr class="subsection" />
            <UploadFile />-->
            <hr />
            <TitleSettings :title="tit_mod_chs" />
            <Models class="settings-panel models" :stage="stage" />
            <Chains class="settings-panel chains" :stage="stage" />
            <hr class="subsection" />
            <TitleSettings :title="tit_mols" />
            <Residues class="settings-panel residues" :stage="stage" />
            <Heteroatoms class="settings-panel hetero" :stage="stage" />
            <Ions class="settings-panel ions" :stage="stage" />
            <Waters class="settings-panel water" :stage="stage" />
            <CustomSelection class="settings-panel custom" :stage="stage" />
            <hr class="subsection" />
            <TitleSettings :title="tit_traj" />
            <Trajectory />
        </div>
    </Sidebar>
</template>

<script>
import { ref, reactive, computed, toRefs } from 'vue'
import useFlags from '@/modules/common/useFlags'
import useStage from '@/modules/ngl/useStage'
import useRepresentations from '@/modules/representations/useRepresentations'
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
        
        const { flags, setFlagStatus } = useFlags()
        const { currentRepresentation, defaultRepresentation, getRepresentationNames } = useRepresentations()
        const { getStage } = useStage()

        //const visibleRight = ref(false)
        //console.log(flags.sidebarEnabled)
        const visibleRight = computed({
            get: () => flags.sidebarEnabled,
            set: val => setFlagStatus('sidebarEnabled', val)
        })
        const stage = getStage()
        const reprList = computed(() => getRepresentationNames())
        const currReprVal = computed(() => currentRepresentation.value)

        const page = reactive({
            tit_mod_chs: "models / chains",
            tit_mols: "molecules",
            tit_traj: "trajectory",
            ttdb: computed(() => (reprList.value.length <= 1 && currReprVal.value === defaultRepresentation) ? "Settings are disabled until you create a new representation" : "Default representation has no access to settings"),
            ttst: "Open representation settings"
        })

        /*const onSidebarShown = () => {
            setFlagStatus('sidebarEnabled', true)
        }

        const onSidebarHidden = () => {
            setFlagStatus('sidebarEnabled', false)
        }*/

        return { 
            visibleRight, 
            stage,
            /*onSidebarShown, 
            onSidebarHidden, */
            ...toRefs(page),
            reprList, currReprVal, defaultRepresentation
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
    #settings-impostor {
        position: absolute;
        right: 0px;
        top: 50%;
        cursor: pointer;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        background: transparent;
        width: 30px;
        font-size: 20px;
        padding: 10px;
        z-index: 3;
        border:none;
    }
    .p-sidebar { padding:0!important; background: transparent!important; }
    .p-sidebar-right { width:25%!important; }
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
    #sidebar .p-dropdown ul.p-dropdown-items li.p-dropdown-item {  padding:0 }
    #sidebar .p-dropdown ul.p-dropdown-items li.p-dropdown-item div { padding: 0.5rem 1rem; }

    /* chips */
    .settings-panel .p-chip { margin-right: 0.2rem; font-size:12px; font-weight: 600; background-color: #6f96a9; color:#fff; }
    .settings-panel .p-chip .pi { margin-left: 0.2rem; font-size:12px; }
    
    /* listbox */
    .settings-panel .p-listbox { border:none; }
    .settings-panel .p-listbox .p-listbox-list { padding:0; }
    .settings-panel .p-listbox .p-listbox-list .p-listbox-item { justify-content:space-between; display:flex; padding:0; }
    .settings-panel .p-listbox .p-listbox-list .p-listbox-item div { padding: 0.5rem 1rem; width:100%; }
    .settings-panel .p-listbox .p-listbox-list .p-listbox-item div button { position:absolute;right:.5rem;top:.25rem;z-index:100; }
    .settings-panel .p-listbox:not(.p-disabled) .p-listbox-item:not(.p-highlight):not(.p-disabled):hover { background: #e9ecef!important; }

    /* slider */
    .settings-panel .p-slider.p-slider-horizontal { width: 95%; margin: 0 2.5%; }
    .settings-panel .p-slider .p-slider-range { background: #6f96a9; }
    .settings-panel .p-slider .p-slider-handle { border-color: #6f96a9; }
    .settings-panel .p-slider:not(.p-disabled) .p-slider-handle:hover { background: #6f96a9;  border-color: #6f96a9; }
    .settings-panel .slider-value { text-align:right; font-weight: 700;}

</style>