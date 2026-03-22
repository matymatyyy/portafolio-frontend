export enum Permission {
  VIEW_USERS = 'view_users',
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  VIEW_ANALYTICS = 'view_analytics',
}

export enum Role {
  ADMIN = 'ROLE_ADMIN',
  USER = 'ROLE_USER',
}

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.USER]: [Permission.VIEW_USERS],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}
