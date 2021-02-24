<template>
    <span class="sequence-number" v-if="index % 10 === 0">{{ residue.num }}
        <span v-if="residue.num.toString().length == 3">&nbsp;</span>
        <span v-if="residue.num.toString().length == 2">&nbsp;&nbsp;</span>
        <span v-if="residue.num.toString().length == 1">&nbsp;&nbsp;&nbsp;</span>
    </span>
    
    <span v-if="residue.id" class="sequence-item" 
    :data-chain="residue.chain" 
    :data-resnum="residue.num" 
    :data-resname="residue.label" 
    v-tooltip.left="residue.longname + ' (' +  residue.label + ')<br>Residue: ' + residue.id + ' ' + residue.num">
        {{ residue.id }}
    </span>
    <span v-else class="sequence-item disabled">&nbsp;</span>

    <!-- TO ADD IN EXTERNAL WINDOW    -->
    <span :class="residue.last_sheet ? 'sheet-arrow' : 'sheet'" 
    v-if="(residue.sheet !== null)" 
    @mouseover="sheetOver(residue.sheet)" 
    @mouseleave="sheetLeave(residue.sheet)" 
    :data-sheet="residue.sheet" 
    v-tooltip.bottom="'β-sheet<br>ALA703~ALA707'"><span v-if="!residue.last_sheet">&nbsp;&nbsp;</span><span v-else>&#9654;&nbsp;</span></span>

    <span class="helix" 
    v-if="(residue.helix !== null)" 
    @mouseover="helixOver(residue.helix)" 
    @mouseleave="helixLeave(residue.helix)" 
    :data-helix="residue.helix" 
    v-tooltip.bottom="'β-helix<br>ALA703~ALA707'">&nbsp;&nbsp;</span>
</template>

<script>
import { computed } from 'vue'
export default {
    props: ['residue', 'index'],
    setup(props) {

        const residue =  computed(() => props.residue)

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

        return { residue,
            sheetOver, sheetLeave,
            helixOver, helixLeave,
        }
    }
}
</script>

<style>

</style>