import { createApp } from 'vue'

// import PrimeVue and components
import PrimeVue from 'primevue/config'
import TabMenu from 'primevue/tabmenu';
import Tooltip from 'primevue/tooltip'
import Panel from 'primevue/panel';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Breadcrumb from 'primevue/breadcrumb';
import Sidebar from 'primevue/sidebar';
//import Toast from 'primevue/toast'
//import ToastService from 'primevue/toastservice'

// generic components
import Footer from '@/components/global/Footer'

// import App, router and Vuex store
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
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
app.use(store)
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

// create directives
app.directive('tooltip', Tooltip)

//mount app
app.mount('#app')
// provide / inject globallly axios & router
app.provide('$axios', axios)
app.provide('$router', router)