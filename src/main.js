import { createApp } from 'vue'

// import PrimeVue and components
import PrimeVue from 'primevue/config'
import TabMenu from 'primevue/tabmenu'
import Tooltip from 'primevue/tooltip'
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import Breadcrumb from 'primevue/breadcrumb'
import Sidebar from 'primevue/sidebar'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import ColorPicker from 'primevue/colorpicker'
import ProgressSpinner from 'primevue/progressspinner'
import MultiSelect from 'primevue/multiselect'
import Slider from 'primevue/slider'
import Chip from 'primevue/chip'
import Listbox from 'primevue/listbox'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
//import Toast from 'primevue/toast'
//import ToastService from 'primevue/toastservice'

// generic components
import Footer from '@/components/global/Footer'

// import App, router 
import App from '@/App.vue'
import router from '@/router'
import axios from 'axios'
import VueAxios from 'vue-axios'

// import PrimeVue resources
import 'primevue/resources/themes/saga-blue/theme.css'      
import 'primevue/resources/primevue.min.css'                
import 'primeicons/primeicons.css'                          
import 'primeflex/primeflex.css'
// import font awesome
import '@fortawesome/fontawesome-free/css/all.css'

// main css
import '@/css/main.css'

// create app
const app = createApp(App)
app.use(router)
app.use(VueAxios, axios)
app.use(PrimeVue, {ripple: true})
//app.use(ToastService)

// create global components
app.component('TabMenu', TabMenu)
app.component('Footer', Footer)
app.component('Panel', Panel)
app.component('Card', Card)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('AutoComplete', AutoComplete)
app.component('Button', Button)
app.component('FileUpload', FileUpload)
app.component('Breadcrumb', Breadcrumb)
app.component('Sidebar', Sidebar)
app.component('Dropdown', Dropdown)
app.component('Dialog', Dialog)
app.component('ColorPicker', ColorPicker)
app.component('ProgressSpinner', ProgressSpinner)
app.component('MultiSelect', MultiSelect)
app.component('Slider', Slider)
app.component('Chip', Chip)
app.component('Listbox', Listbox)
app.component('InputText', InputText)
app.component('Message', Message)

// create directives
app.directive('tooltip', Tooltip)

//mount app
app.mount('#app')
// provide / inject globally modules
app.provide('$axios', axios)
app.provide('$router', router)