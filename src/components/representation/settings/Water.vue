<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-tint"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button icon="fas fa-eye" class="p-button-rounded p-button-text" />
        </template>
        <div id="water-text">
            <span class="water-number">702&nbsp;&nbsp;</span>
            <span class="water-item" data-chain="A" data-resnum="702" data-resname="HOH" v-tooltip.top="'HOHnine (HOH)<br>Residue: 702'">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="703" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="704" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="705" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="706" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="707" data-resname="HOH">HOH</span>
            <span class="water-item disabled">&nbsp;</span>
            <span class="water-item disabled">&nbsp;</span>
            <span class="water-item disabled">&nbsp;</span>
            <span class="water-item" data-chain="A" data-resnum="711" data-resname="HOH">HOH</span>
            <span class="water-number">712&nbsp;&nbsp;</span>
            <span class="water-item" data-chain="A" data-resnum="712" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="713" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="714" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="715" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="716" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="717" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="718" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="719" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="720" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="721" data-resname="HOH">HOH</span>
            <span class="water-number">722&nbsp;&nbsp;</span>
            <span class="water-item" data-chain="A" data-resnum="722" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="723" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="724" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="725" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="726" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="727" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="728" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="729" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="730" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="731" data-resname="HOH">HOH</span>
            <span class="water-number">732&nbsp;&nbsp;</span>
            <span class="water-item" data-chain="A" data-resnum="732" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="733" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="734" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="735" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="736" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="737" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="738" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="739" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="740" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="741" data-resname="HOH">HOH</span>
            <span class="water-number">742&nbsp;&nbsp;</span>
            <span class="water-item" data-chain="A" data-resnum="742" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="743" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="744" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="745" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="746" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="747" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="748" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="749" data-resname="HOH">HOH</span>
            <span class="water-item" data-chain="A" data-resnum="750" data-resname="HOH">HOH</span>
        </div>
    </Panel>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

        let isCollapsed = ref(true)
        const header = "Water"

        return { header, isCollapsed }
    }
}
</script>

<style>
   #water-text {
        font-family: monospace;
        font-size: 14px !important;
        line-height: 25px;
        word-break: break-all;
    }
    #water-text .water-item { position:relative; z-index:1; padding:0 1px; cursor:default; }
    #water-text .water-item:not(.disabled) { cursor: pointer; }    
    #water-text .water-item:not(.disabled):hover {
        color: #fff;
        background: #5E738B;
    }
    #water-text .water-number {
        color: #325880;
        word-break: keep-all;
        cursor: default;
        position: relative;
        top: -1.1em;
        left: 3.1em;
        padding: 0;
        margin-left: -3em;
        font-size: 80%;
    }
</style>