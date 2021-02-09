<template>

    <Settings />

</template>

<script>
import { useStore } from 'vuex'
import Settings from '@/components/representation/Settings'
export default {
     components: { Settings },
    props: ['id'],
    setup(props) {

        const store = useStore()
        // disable menu
        store.dispatch('menuStatus', false) 

        console.log(props.id)

        return { }
    }
}
</script>

<style>
    
</style>