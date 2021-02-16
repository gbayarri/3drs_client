<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="far fa-dot-circle"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button icon="fas fa-eye" class="p-button-rounded p-button-text" />
        </template>
        
        <Listbox 
        v-model="selectedMetals" 
        :options="metals" 
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
        const header = "Metals"

        const filterPlaceholder = "Search metal"

        const selectedMetals = ref(null)
        const metals =  [
            {name: 'K', code: 'K'},
            {name: 'Na', code: 'Na'},
            {name: 'Mn', code: 'Mn'}
        ]

        const onChange = (e) => {
            //console.log(e.value)
            console.log(selectedMetals.value)
        }

        return { header, isCollapsed, filterPlaceholder, selectedMetals, metals, onChange }
    }
}
</script>

<style>
    
</style>