interface AuthProvider {
  isAuthenticated: boolean
  username: null | string
  signin(username: string): Promise<void>
  signout(): Promise<void>
  getCurrentUser(): Promise<User | null>
}

export type User = {
  name: string | null
  icon: string | null
}

export const AuthProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,
  async signin(username: string) {
    await new Promise((r) => setTimeout(r, 500))
    AuthProvider.isAuthenticated = true
    AuthProvider.username = username
  },
  async signout() {
    await new Promise((r) => setTimeout(r, 500))
    AuthProvider.isAuthenticated = false
    AuthProvider.username = null
  },
  async getCurrentUser(): Promise<User | null> {
    await new Promise((r) => setTimeout(r, 100))
    if (!AuthProvider.isAuthenticated) {
      return null
    }
    return {
      name: AuthProvider.username,
      icon: null,
    }
  },
}
