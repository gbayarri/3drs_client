import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/About.vue'
import Launch from '../views/Launch.vue'
import Contact from '../views/Contact.vue'

const routes = [
  {
    path: '/',
    name: 'About',
    component: About
  },
  {
    path: '/launch',
    name: 'Launch',
    component: Launch
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
