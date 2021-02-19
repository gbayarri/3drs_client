<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-share-alt"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button 
            :icon="allSelected ? 'fas fa-times' : 'fas fa-check-double'" 
            class="p-button-rounded p-button-text" 
            @click="selectAll" 
            v-tooltip.left="ttpsa" />
            <Button 
            :icon="allVisible ? 'fas fa-eye-slash' : 'fas fa-eye'" 
            @click="hideAll" 
            class="p-button-rounded p-button-text" 
            v-tooltip.left="ttph" 
            />
        </template>
        <div id="sequence-text">
            <span class="sequence-number">702&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="702" data-resname="ALA" v-tooltip.top="'Alanine (ALA)<br>Residue: 702'">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="703" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet" @mouseover="sheetOver(1)" @mouseleave="sheetLeave(1)" data-sheet="1" v-tooltip.bottom="'β-sheet<br>ALA703~ALA707'">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="704" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet" @mouseover="sheetOver(1)" @mouseleave="sheetLeave(1)" data-sheet="1" v-tooltip.bottom="'β-sheet<br>ALA703~ALA707'">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="705" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet" @mouseover="sheetOver(1)" @mouseleave="sheetLeave(1)" data-sheet="1" >&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="706" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet" @mouseover="sheetOver(1)" @mouseleave="sheetLeave(1)" data-sheet="1" >&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="707" data-resname="ALA" data-sheet="1">A</span>
            <span class="sheet-arrow" @mouseover="sheetOver(1)" @mouseleave="sheetLeave(1)" data-sheet="1">&#9654;&nbsp;</span>
            <span class="sequence-item disabled">&nbsp;</span>
            <span class="sequence-item disabled">&nbsp;</span>
            <span class="sequence-item disabled">&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="711" data-resname="ALA">A</span>
            <span class="sequence-number">712&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="712" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="713" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="714" data-resname="ALA" data-helix="1">A</span>
            <span class="helix" @mouseover="helixOver(1)" @mouseleave="helixLeave(1)" data-helix="1" v-tooltip.bottom="'α-helix<br>ALA714~ALA718'">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="715" data-resname="ALA" data-helix="1">A</span>
            <span class="helix" @mouseover="helixOver(1)" @mouseleave="helixLeave(1)" data-helix="1">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="716" data-resname="ALA" data-helix="1">A</span>
            <span class="helix" @mouseover="helixOver(1)" @mouseleave="helixLeave(1)" data-helix="1">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="717" data-resname="ALA" data-helix="1">A</span>
            <span class="helix" @mouseover="helixOver(1)" @mouseleave="helixLeave(1)" data-helix="1">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="718" data-resname="ALA" data-helix="1">A</span>
            <span class="helix" @mouseover="helixOver(1)" @mouseleave="helixLeave(1)" data-helix="1">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="719" data-resname="ALA">A</span>
            <span class="sequence-item" data-chain="A" data-resnum="720" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="721" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-number">722&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="722" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
            <span class="sequence-item" data-chain="A" data-resnum="723" data-resname="ALA">A</span>
            <span class="helix">&nbsp;&nbsp;</span>
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

        const isCollapsed = ref(true)
        const header = "Residues"
        const ttph = ref("Hide all residues")
        const allSelected = ref(false)
        const allVisible = ref(false)
        const ttpsa = ref("Select all the residues")

        const selectAll = () => {
            ttpsa.value = allSelected.value ? 'Select all the residues' : 'Unselect all the residues'
            const items = document.getElementsByClassName("sequence-item")
            for(const it of items) {
                if(!allSelected.value) {
                    if(it.className.indexOf('disabled') === -1) it.classList.add('sequence-item-hover')
                } else {
                    if(it.className.indexOf('disabled') === -1) it.classList.remove('sequence-item-hover')
                }
            }
            allSelected.value = !allSelected.value
        }

        const hideAll = () => {
            ttph.value = allVisible.value ? 'Hide all residues' : 'Show all residues'
            allVisible.value = !allVisible.value
        }

        const sheetOver = (sheet) => {
            const sheets = document.querySelectorAll('[data-sheet="' + sheet + '"]')
            for(const s of sheets) {
                if(s.className == 'sheet') s.style.backgroundColor = 'rgb(46, 199, 150)'
                if(s.className == 'sheet-arrow') s.style.color = 'rgb(46, 199, 150)'
                if(s.className == 'sequence-item')  s.classList.add('sequence-item-hover')
            }
        }

        const sheetLeave = (sheet) => {
            const sheets = document.querySelectorAll('[data-sheet="' + sheet + '"]')
            for(const s of sheets) {
                if(s.className == 'sheet') s.style.backgroundColor = 'rgb(104, 158, 153)'
                if(s.className == 'sheet-arrow') s.style.color = 'rgb(104, 158, 153)'
                if(s.className == 'sequence-item sequence-item-hover')  s.classList.remove('sequence-item-hover')
            }
        }

        const helixOver = (sheet) => {
            const helixes = document.querySelectorAll('[data-helix="' + sheet + '"]')
            for(const s of helixes) {
                if(s.className == 'helix') s.style.backgroundPosition = 'center top'
                if(s.className == 'sequence-item')  s.classList.add('sequence-item-hover')
            }
        }

        const helixLeave = (sheet) => {
            const helixes = document.querySelectorAll('[data-helix="' + sheet + '"]')
            for(const s of helixes) {
                if(s.className == 'helix') s.style.backgroundPosition = 'center bottom'
                if(s.className == 'sequence-item sequence-item-hover')  s.classList.remove('sequence-item-hover')
            }
        }

        return { header, isCollapsed, ttph,
        ttpsa, allSelected, selectAll, hideAll, allVisible,
        sheetOver, sheetLeave, helixOver, helixLeave }
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
    #sequence-text .sequence-item:not(.disabled):hover,
    .sequence-item-hover {
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
        background-repeat: no-repeat; 
        background-image: url("~@/assets/img/bg_helix.png"); 
        background-position: center bottom;
        word-break: keep-all;
        cursor: pointer;
        position: relative;
        top: 1.1em;
        left: 0.4em;
        padding: 0px;
        margin-left: -1.2em;
        font-size: 10px;
    }
</style>