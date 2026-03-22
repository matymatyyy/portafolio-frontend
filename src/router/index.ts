import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'portfolio',
      component: () => import('@/pages/PortfolioPage.vue'),
      meta: { title: 'Portfolio', hideNav: true },
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('@/pages/ProjectDetailPage.vue'),
      meta: { title: 'Project', hideNav: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { title: 'Login', hideNav: true },
    },
    {
      path: '/admin',
      component: () => import('@/pages/admin/AdminPage.vue'),
      meta: { requiresAuth: true, hideNav: true },
      children: [
        {
          path: '',
          redirect: { name: 'admin-projects' },
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('@/pages/admin/ProjectsPage.vue'),
          meta: { title: 'Projects', requiresAuth: true, hideNav: true },
        },
        {
          path: 'projects/new',
          name: 'admin-project-create',
          component: () => import('@/pages/admin/ProjectFormPage.vue'),
          meta: { title: 'New Project', requiresAuth: true, hideNav: true },
        },
        {
          path: 'projects/:id/edit',
          name: 'admin-project-edit',
          component: () => import('@/pages/admin/ProjectFormPage.vue'),
          meta: { title: 'Edit Project', requiresAuth: true, hideNav: true },
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/pages/users/UsersPage.vue'),
          meta: { title: 'Users', requiresAuth: true, hideNav: true },
        },
        {
          path: 'users/new',
          name: 'user-create',
          component: () => import('@/pages/users/UserFormPage.vue'),
          meta: { title: 'New User', requiresAuth: true, hideNav: true },
        },
        {
          path: 'users/:id/edit',
          name: 'user-edit',
          component: () => import('@/pages/users/UserFormPage.vue'),
          meta: { title: 'Edit User', requiresAuth: true, hideNav: true },
        },
        {
          path: 'visits',
          name: 'admin-visits',
          component: () => import('@/pages/admin/VisitsPage.vue'),
          meta: { title: 'Visitors', requiresAuth: true, hideNav: true },
        },
        {
          path: 'cv',
          name: 'admin-cv',
          component: () => import('@/pages/admin/CvPage.vue'),
          meta: { title: 'CV', requiresAuth: true, hideNav: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: { title: 'Not Found' },
    },
  ],
})

router.afterEach((to) => {
  const appName = import.meta.env.VITE_APP_NAME as string
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} — ${appName}` : appName
})

router.beforeEach(authGuard)

export default router
