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

    <span :class="residue.last_sheet ? 'sheet-arrow' : 'sheet'" 
    v-if="(residue.sheet !== null) && window" 
    @mouseover="sheetOver(residue.sheet, residue.chain)" 
    @mouseleave="sheetLeave(residue.sheet, residue.chain)" 
    :data-sheet="residue.chain + ':' + residue.sheet" 
    v-tooltip.bottom="labelSheet"><span v-if="!residue.last_sheet">&nbsp;&nbsp;</span><span v-else>&#9654;&nbsp;</span></span>

    <span class="helix" 
    v-if="(residue.helix !== null) && window" 
    @mouseover="helixOver(residue.helix, residue.chain)" 
    @mouseleave="helixLeave(residue.helix, residue.chain)" 
    :data-helix="residue.chain + ':' + residue.helix" 
    v-tooltip.bottom="labelHelix">&nbsp;&nbsp;</span>
</template>

<script>
import { computed } from 'vue'
export default {
    props: ['residue', 'sheets', 'helixes', 'window', 'index'],
    setup(props) {

        const residue =  computed(() => props.residue)
        const sheets =  computed(() => props.sheets)
        const helixes =  computed(() => props.helixes)
        const window =  computed(() => props.window)

        const labelSheet = computed(() => {
            if(sheets && residue.value.id) {
                const resSheet = sheets.value.filter(item => item.id === residue.value.chain)[0].sheets[residue.value.sheet]
                if(resSheet) {
                    const firstItem = resSheet[0];
                    const lastItem = resSheet[resSheet.length-1];
                    return "β-sheet<br>" + firstItem.label + firstItem.num + "~" + lastItem.label + lastItem.num
                }
            }
        })

        const labelHelix = computed(() => {
            if(helixes && residue.value.id) {
                const resHelix = helixes.value.filter(item => item.id === residue.value.chain)[0].helixes[residue.value.helix]
                if(resHelix) {
                    const firstItem = resHelix[0]
                    const lastItem = resHelix[resHelix.length-1]
                    return "α-helix<br>" + firstItem.label + firstItem.num + "~" + lastItem.label + lastItem.num
                }
            }
        })

        const sheetOver = (sheet, chain) => {
            const sheets = document.querySelectorAll('[data-sheet="' + chain + ':' + sheet + '"]')
            for(const s of sheets) {
                if(s.className == 'sheet') s.style.backgroundColor = 'rgb(46, 199, 150)'
                if(s.className == 'sheet-arrow') s.style.color = 'rgb(46, 199, 150)'
                if(s.className == 'sequence-item')  s.classList.add('sequence-item-hover')
            }
        }

        const sheetLeave = (sheet, chain) => {
            const sheets = document.querySelectorAll('[data-sheet="' + chain + ':' + sheet + '"]')
            for(const s of sheets) {
                if(s.className == 'sheet') s.style.backgroundColor = 'rgb(104, 158, 153)'
                if(s.className == 'sheet-arrow') s.style.color = 'rgb(104, 158, 153)'
                if(s.className == 'sequence-item sequence-item-hover')  s.classList.remove('sequence-item-hover')
            }
        }

        const helixOver = (sheet, chain) => {
            const helixes = document.querySelectorAll('[data-helix="' + chain + ':' + sheet + '"]')
            for(const s of helixes) {
                if(s.className == 'helix') s.style.backgroundPosition = 'center top'
                if(s.className == 'sequence-item')  s.classList.add('sequence-item-hover')
            }
        }

        const helixLeave = (sheet, chain) => {
            const helixes = document.querySelectorAll('[data-helix="' + chain + ':' + sheet + '"]')
            for(const s of helixes) {
                if(s.className == 'helix') s.style.backgroundPosition = 'center bottom'
                if(s.className == 'sequence-item sequence-item-hover')  s.classList.remove('sequence-item-hover')
            }
        }

        return { residue, window,
            labelSheet, labelHelix,
            sheetOver, sheetLeave,
            helixOver, helixLeave,
        }
    }
}
</script>

<style>

</style>