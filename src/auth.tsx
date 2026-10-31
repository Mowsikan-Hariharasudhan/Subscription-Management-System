// Auth context — simple in-memory auth for demo
// In production: JWT + httpOnly cookies from Express backend
import { createContext, useContext, useState, type ReactNode } from 'react'
import { USERS, type Role } from './data/seed'

interface AuthUser { id: string; name: string; email: string; role: Role }

interface AuthCtx {
  user: AuthUser | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

// Demo credentials map  (in prod: bcrypt comparison on server)
const DEMO_CREDS: Record<string, string> = {
  'admin@brightloop.dev':    'Admin#2026',
  'staff@brightloop.dev':    'Staff#2026',
  'customer@brightloop.dev': 'Cust#2026',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { return JSON.parse(sessionStorage.getItem('bl.user') ?? 'null') } catch { return null }
  })

  function login(email: string, password: string): { ok: boolean; error?: string } {
    const e = email.toLowerCase().trim()
    if (DEMO_CREDS[e] !== password) return { ok: false, error: 'Invalid credentials.' }
    const u = USERS.find(u => u.email === e)
    if (!u) return { ok: false, error: 'User not found.' }
    const authUser: AuthUser = { id: u.id, name: u.name, email: u.email, role: u.role }
    setUser(authUser)
    sessionStorage.setItem('bl.user', JSON.stringify(authUser))
    return { ok: true }
  }

  function logout() {
    setUser(null)
    sessionStorage.removeItem('bl.user')
  }

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

