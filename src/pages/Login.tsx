import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('admin@brightloop.dev')
  const [password, setPassword] = useState('Admin#2026')
  const [error, setError] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await login(email, password)
      if (!res.ok) {
        setError(res.error || 'Invalid credentials. Password must be >8 characters with uppercase, lowercase, and special character.')
        return
      }
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const fillCreds = (em: string, pw: string) => {
    setEmail(em)
    setPassword(pw)
    setError('')
  }

  return (
    <div className="bg-[#F7F5F7] min-h-screen flex items-center justify-center p-4 antialiased text-[#29242B]">
      {/* Container */}
      <div className="w-full max-w-5xl bg-white border border-[#E4DEE3] shadow-sm flex flex-col md:flex-row h-auto md:h-[650px] rounded-sm overflow-hidden">
        
        {/* Left Side: Branding (Plum) */}
        <div className="w-full md:w-1/2 bg-[#724B68] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-[#724B68] flex items-center justify-center font-bold text-xl rounded-sm">
              B
            </div>
            <span className="font-semibold text-lg tracking-tight">Brightloop</span>
          </div>

          {/* Tagline */}
          <div className="relative z-10 my-8 md:my-0">
            <div className="inline-block border border-white/30 text-xs font-mono tracking-widest uppercase px-3 py-1 mb-6 text-white/80">
              Enterprise Billing
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
              Manage subscriptions,<br />
              billing, and revenue<br />
              in one place.
            </h1>
            <p className="text-white/70 text-sm max-w-xs leading-relaxed">
              A structural, data-dense platform built for modern enterprise finance teams.
            </p>
          </div>

          {/* Footer */}
          <div className="text-xs text-white/50 font-mono">
            © 2026 Brightloop Software Systems Pvt Ltd.
          </div>
        </div>

        {/* Right Side: Form (White) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight mb-1 text-[#29242B]">Sign in</h2>
              <p className="text-[#746F75] text-sm">Enter your credentials to access the workspace.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#746F75] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@brightloop.dev"
                  required
                  className="w-full px-3 py-2 bg-white border border-[#E4DEE3] rounded-sm text-sm focus:outline-none focus:border-[#724B68] focus:ring-1 focus:ring-[#724B68] transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-[#746F75] uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" className="text-xs text-[#724B68] hover:underline font-medium">Forgot?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-3 py-2 bg-white border border-[#E4DEE3] rounded-sm text-sm focus:outline-none focus:border-[#724B68] focus:ring-1 focus:ring-[#724B68] transition-colors font-mono"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#724B68] hover:bg-[#36283B] disabled:opacity-60 text-white font-medium text-sm py-2.5 rounded-sm transition-colors mt-2 cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                {isLoading ? 'Signing in...' : 'Sign in to Brightloop'}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-8 pt-5 border-t border-[#E4DEE3]">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#746F75] mb-2 font-semibold">
                DEMO ROLES (CLICK TO AUTOFILL)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillCreds('admin@brightloop.dev', 'Admin#2026')}
                  className="px-2 py-1 text-xs font-mono border border-[#E4DEE3] hover:border-[#724B68] rounded-sm bg-white text-[#29242B] text-center transition-colors cursor-pointer"
                >
                  ADMIN
                </button>
                <button
                  type="button"
                  onClick={() => fillCreds('staff@brightloop.dev', 'Staff#2026')}
                  className="px-2 py-1 text-xs font-mono border border-[#E4DEE3] hover:border-[#724B68] rounded-sm bg-white text-[#29242B] text-center transition-colors cursor-pointer"
                >
                  STAFF
                </button>
                <button
                  type="button"
                  onClick={() => fillCreds('customer@brightloop.dev', 'Cust#2026')}
                  className="px-2 py-1 text-xs font-mono border border-[#E4DEE3] hover:border-[#724B68] rounded-sm bg-white text-[#29242B] text-center transition-colors cursor-pointer"
                >
                  CUSTOMER
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center text-sm text-[#746F75]">
              New to Brightloop?{' '}
              <a href="#" className="text-[#724B68] font-medium hover:underline">
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
