import { Permission } from '@/permissions'

/**
 * Maps route names to the permissions required to access them.
 * Used by the router navigation guard.
 */
export const routePermissions: Record<string, Permission[]> = {
  users: [Permission.VIEW_USERS],
  'user-create': [Permission.CREATE_USER],
  'user-edit': [Permission.UPDATE_USER],
  'admin-visits': [Permission.VIEW_ANALYTICS],
}
