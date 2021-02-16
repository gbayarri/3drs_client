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
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA" v-tooltip.top="'Alanine (ALA)<br>Residue: 702'">A</span>
            <span class="sheet" v-tooltip.bottom="'β-sheet<br>ALA703~ALA707'">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sheet-arrow">&#9654;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item disabled">&nbsp;</span>
            <span class="sequence-item disabled">&nbsp;</span>
            <span class="sequence-item disabled">&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-number">712&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-number">722&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="helix-bullet">&#9687;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-number">732&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-number">742&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sheet">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
            <span class="sheet-arrow">&#9654;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="336" data-resname="ALA">A</span>
        </div>
        
    </Panel>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

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
    #sequence-text .sequence-item { position:relative; padding:0 0.5px; cursor:default; }
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
        background: rgb(2, 131, 2);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 1.3em;
        left: 1.2em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 8px;
    }
    #sequence-text .sheet-arrow {
        color: rgb(2, 131, 2);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 0.6em;
        left: 1.2em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 22px;
    }
    #sequence-text .helix {
        background: rgb(165, 0, 0);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 1.3em;
        left: 1.2em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 8px;
    }
    #sequence-text .helix-bullet {
        color: rgb(165, 0, 0);
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 0.6em;
        left: 0.6em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 22px;
        border-left: solid 2px rgb(165, 0, 0);
    }
</style>