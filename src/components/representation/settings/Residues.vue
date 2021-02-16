<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-share-alt"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button icon="fas fa-eye" class="p-button-rounded p-button-text" />
        </template>
        <div id="sequence-text">
            <span class="sequence-number">702&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="702" data-resname="ALA" v-tooltip.top="'Alanine (ALA)<br>Residue: 702'">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="703" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet" v-tooltip.bottom="'β-sheet<br>ALA703~ALA707'">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="704" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="705" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="706" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="707" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet-arrow">&#9654;&nbsp;</span>
            <span class="sequence-item disabled">&nbsp;</span>
            <span class="sequence-item disabled">&nbsp;</span>
            <span class="sequence-item disabled">&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="711" data-resname="ALA">A</span>
            <span class="sequence-number">712&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="712" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="713" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="714" data-resname="ALA" data-helix="1">A</span>
            <span class="helix" v-tooltip.bottom="'α-helix<br>ALA714~ALA718'">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="715" data-resname="ALA" data-helix="1">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="716" data-resname="ALA" data-helix="1">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="717" data-resname="ALA" data-helix="1">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="718" data-resname="ALA" data-helix="1">A</span>
            <span class="helix-bullet">&#9679;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="719" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="720" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="721" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-number">722&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="722" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="723" data-resname="ALA">A</span>
            <span class="helix-bullet">&#9679;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="724" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="725" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="726" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="727" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="728" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="729" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="730" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="731" data-resname="ALA">A</span>
            <span class="sequence-number">732&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="732" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="733" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="734" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="735" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="736" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="737" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="738" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="739" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="740" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="741" data-resname="ALA">A</span>
            <span class="sequence-number">742&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="742" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="743" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="744" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="745" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="746" data-resname="ALA">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="747" data-resname="ALA">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="748" data-resname="ALA">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="749" data-resname="ALA">A</span>
            <span class="sheet-arrow">&#9654;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="750" data-resname="ALA">A</span>
        </div>
        
    </Panel>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

        // TODO ROLLOVER SHEET / HELIX ALL RESIDUES

        let isCollapsed = ref(true)
        const header = "Residues"

        return { header, isCollapsed }
    }
}
</script>

<style>
   #sequence-text {
        font-family: monospace;
        font-size: 14px !important;
        line-height: 35px;
        word-break: break-all;
    }
    #sequence-text .sequence-item { position:relative; z-index:1; padding:0 0.5px; cursor:default; }
    #sequence-text .sequence-item:not(.disabled) { cursor: pointer; }    
    #sequence-text .sequence-item:not(.disabled):hover {
        color: #fff;
        background: #5E738B;
    }
    #sequence-text .sequence-number {
        color: #325880;
        word-break: keep-all;
        cursor: default;
        position: relative;
        top: -1.1em;
        left: 3.1em;
        padding: 0px;
        margin-left: -3em;
        font-size: 80%;
    }
    #sequence-text .sheet {
        background: rgb(104, 158, 153);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 1.3em;
        left: 0;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 8px;
    }
    #sequence-text .sheet-arrow {
        color: rgb(104, 158, 153);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 0.6em;
        left: .7em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 22px;
    }
    #sequence-text .helix {
        background: rgb(183, 120, 120);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 1.1em;
        left: 0.4em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 10px;
    }
    #sequence-text .helix-bullet {
        color: rgb(183, 120, 120);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 0.67em;
        left: 0.6em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 18px;
    }
</style>