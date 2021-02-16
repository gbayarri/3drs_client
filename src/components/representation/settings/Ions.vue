<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="far fa-dot-circle"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button icon="fas fa-eye" class="p-button-rounded p-button-text" />
        </template>
        
        <Listbox 
        v-model="selectedIons" 
        :options="ions" 
        :multiple="true" 
        :filter="true" 
        :filterPlaceholder="filterPlaceholder"
        optionLabel="name" 
        listStyle="max-height:200px" 
        style="width:100%"
        @change="onChange">
            <template #option="slotProps">
                <div>{{slotProps.option.name}}</div>
                <i class="fab fas fa-eye"></i>
            </template>
        </Listbox>

    </Panel>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

        let isCollapsed = ref(true)
        const header = "Ions"

        const filterPlaceholder = "Search ion"

        const selectedIons = ref(null)
        const ions =  [
            {name: 'K', code: 'K'},
            {name: 'Na', code: 'Na'},
            {name: 'Mn', code: 'Mn'}
        ]

        const onChange = (e) => {
            //console.log(e.value)
            console.log(selectedIons.value)
        }

        return { header, isCollapsed, filterPlaceholder, selectedIons, ions, onChange }
    }
}
</script>

<style>
    
</style>