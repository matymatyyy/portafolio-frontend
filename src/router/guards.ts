import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (!to.meta.requiresAuth) {
    return next()
  }

  const token = localStorage.getItem('token')
  if (!token) {
    return next({ name: 'login' })
  }

  return next()
}
