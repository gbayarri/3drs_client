import { reactive } from "vue";
import { Stage } from 'ngl'

let stage = reactive({});

const ngl = {
    createStage(layer) { 
        stage = new Stage(layer, { /*backgroundColor:"#f1f1f1",*/ tooltip:false })
        console.log('stage created')
        return { stage } 
    }, 
    getStage() { 
        console.log('return stage')
        return { stage } 
    }
}

export default ngl
