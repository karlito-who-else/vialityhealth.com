import type { PayloadMcpApiKey, User } from '@/payload-types'

export const checkRole = (allRoles: User['roles'] = [], user?: (User | PayloadMcpApiKey) | null): boolean => {
  if (user && 'roles' in user && allRoles) {
    return allRoles.some((role) => {
      return user.roles?.some((individualRole) => {
        return individualRole === role
      })
    })
  }

  return false
}
