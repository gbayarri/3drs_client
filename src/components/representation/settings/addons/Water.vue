<template>
    <span class="water-number" v-if="index % 10 === 0">{{ water.num }}
        <span v-if="water.num.toString().length == 3">&nbsp;</span>
        <span v-if="water.num.toString().length == 2">&nbsp;&nbsp;</span>
        <span v-if="water.num.toString().length == 1">&nbsp;&nbsp;&nbsp;</span>
    </span>

    <span v-if="water.num" class="water-item" 
    :data-chain="water.chain" 
    :data-resnum="water.num" 
    :data-resname="water.name" 
    v-tooltip.left="'Water<br>' + water.chain + ': ' + water.name + ' ' + water.num"
    @click="onClick"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave">W</span>
    <span v-else class="water-item disabled">&nbsp;</span>

</template>

<script>
import { computed } from 'vue'
import useZoomWindow from '@/modules/representations/useZoomWindow'
export default {
    props: ['water', 'window', 'index', 'item'],
    setup(props) {

        // TODO: ADD TO NAVIGATION ALL THE SELECTEDS (FUNCTION ONCLICK()) AND COMPUTE HERE IF 
        // class="sequence-item" OR class="sequence-item-selected" WHEN CREATED
        //const { allSelected } = useZoomWindow()

        const water =  computed(() => props.water)
        const window =  computed(() => props.window)

        const onMouseOver = (e) => {
            // console.log(e.type) // mouseover / mouseleave 
            // TODO: ADD INTERACTIONS WITH STAGE
            const residues = document.querySelectorAll('[data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const res of residues) {
                res.classList.add('water-item-hover')
            }
        }

        const onMouseLeave = (e) => {
            // console.log(e.type) // mouseover / mouseleave 
            // TODO: ADD INTERACTIONS WITH STAGE
            const residues = document.querySelectorAll('[data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const res of residues) {
                res.classList.remove('water-item-hover')
            }
        }

        const onClick = (e) => {
            const waters = document.querySelectorAll('[data-chain="' + e.target.dataset.chain + '"][data-resnum="' + e.target.dataset.resnum + '"][data-resname="' + e.target.dataset.resname + '"]')
            for(const wat of waters) {
                if(wat.className.indexOf('water-item-selected') === -1) wat.classList.add('water-item-selected')
                else wat.classList.remove('water-item-selected')
            }
        }

        return { 
            water, window,
            onClick, onMouseOver, onMouseLeave
        }

    }

}
</script>

<style>

</style>