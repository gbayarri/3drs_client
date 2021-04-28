import { createRouter, createWebHistory } from 'vue-router'
import About from '@/views/About.vue'
import Launch from '@/views/Launch.vue'
import Contact from '@/views/Contact.vue'
import Representation from '@/views/Representation.vue'
import Shared from '@/views/Shared.vue'
import NotFound from '@/views/NotFound.vue'

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
  },
  {
    path: '/representation/:id',
    name: 'Representation',
    component: Representation,
    props: true
  },
  {
    path: '/draft/:id',
    name: 'Draft',
    component: Shared,
    props(route) { 
      return {
        id: route.params.id,
        hasFork: true,
        isDraft: true
      }
    }
  },
  {
    path: '/shared/:id',
    name: 'Shared',
    component: Shared,
    props(route) { 
      return {
        id: route.params.id,
        hasFork: true,
        isDraft: false
      }
    }
  },
  {
    path: '/embed/:id',
    name: 'Embed',
    component: Shared,
    props(route) { 
      return {
        id: route.params.id,
        hasFork: false
      }
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
