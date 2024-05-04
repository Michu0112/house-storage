import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/houses',
            name: 'houses',
            component: () => import('../views/HousesView.vue')
        },
        {
            path: '/:houseId/rooms',
            name: 'rooms',
            component: () => import('../views/RoomsView.vue')
        },
        {
            path: '/:roomId/items',
            name: 'items',
            component: () => import('../views/ItemsView.vue')
        }
    ]
});

export default router;
