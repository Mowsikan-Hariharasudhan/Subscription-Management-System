import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  customerId?: string | null
}

interface AuthCtx {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function getAuthHeaders(): HeadersInit {
  const token = sessionStorage.getItem('bl.token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      return JSON.parse(sessionStorage.getItem('bl.user') ?? 'null')
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('bl.token'))
  const [isLoading, setIsLoading] = useState(false)

  // Verify token on mount
  useEffect(() => {
    if (token && !user) {
      fetch('/api/auth/me', { headers: getAuthHeaders() })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.user) {
            setUser(data.user)
            sessionStorage.setItem('bl.user', JSON.stringify(data.user))
          } else {
            logout()
          }
        })
        .catch(() => logout())
    }
  }, [token])

  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()
      if (!res.ok) {
        return { ok: false, error: data.error || 'Invalid credentials' }
      }

      setUser(data.user)
      setToken(data.token)
      sessionStorage.setItem('bl.user', JSON.stringify(data.user))
      sessionStorage.setItem('bl.token', data.token)
      return { ok: true }
    } catch (err: any) {
      return { ok: false, error: 'Network error connecting to API server' }
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null)
      setToken(null)
      sessionStorage.removeItem('bl.user')
      sessionStorage.removeItem('bl.token')
    }
  }

  return (
    <Ctx.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
