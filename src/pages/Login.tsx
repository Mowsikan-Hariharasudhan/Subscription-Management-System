import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Sparkles, Shield, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('admin@brightloop.dev')
  const [password, setPassword] = useState('Admin#2026')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await login(email, password)
      if (!res.ok) {
        setError(res.error || 'Authentication failed. Please verify credentials.')
        return
      }
      navigate('/dashboard')
    } catch {
      setError('Connection to authentication service failed.')
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
    <div className="w-full h-screen flex flex-col relative z-10 overflow-hidden bg-[#f7f5f8] text-gray-900 select-none">
      <div className="bg-layer" />
      <div className="bg-glow" />

      {/* Top Header */}
      <header className="h-24 px-10 flex items-center justify-between flex-shrink-0 relative z-10">
        <div className="flex items-center gap-3 anim-fade">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg glass-odoo">
            B
          </div>
          <span className="font-bold text-[1.125rem] tracking-tight text-[#4A3043]">Brightloop</span>
        </div>

        <div className="flex items-center gap-4 anim-fade stagger-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-white border-[1.5px] border-black text-[#4A3043] font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
          >
            View Dashboard →
          </button>
        </div>
      </header>

      {/* Main Login Card Center */}
      <main className="flex-1 flex items-center justify-center p-4 -mt-10 relative z-10">
        <div className="w-[62.5rem] h-[36.25rem] bg-white/60 backdrop-blur-2xl border-[1.5px] border-black rounded-3xl flex overflow-hidden anim-spring stagger-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] group">
          
          {/* Left Side (Deep Odoo Purple Glass) */}
          <div className="w-[52%] p-12 flex flex-col justify-between relative glass-odoo text-white">
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-14">
                <div className="w-14 h-14 border-[1.5px] border-white/30 rounded-2xl flex items-center justify-center text-white font-bold text-2xl bg-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                  B
                </div>
                <div>
                  <div className="text-[0.6875rem] font-bold text-white/70 tracking-[0.2em] uppercase mb-1.5 font-mono">
                    SUBSCRIPTION & BILLING SUITE
                  </div>
                  <div className="text-[1.5rem] font-bold text-white tracking-tight">
                    Brightloop
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 border-[1.5px] border-white/20 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full mb-8 shadow-sm transition-transform hover:scale-105 cursor-default">
                <Sparkles className="w-4 h-4 text-white/90" />
                <span className="text-[0.6875rem] font-bold text-white tracking-[0.15em] uppercase font-mono">
                  ENTERPRISE CONTROL CENTER
                </span>
              </div>

              <h1 className="text-[2.6rem] font-bold text-white leading-[1.1] tracking-tight drop-shadow-lg">
                Manage subscriptions,<br />
                invoices, and revenue<br />
                in one place.
              </h1>
            </div>

            <div className="text-[0.75rem] text-white/60 font-mono">
              © 2026 Brightloop Enterprise Systems Pvt Ltd.
            </div>
          </div>

          {/* Right Side (Form) */}
          <div className="w-[48%] p-10 flex flex-col justify-between relative bg-white/40 backdrop-blur-sm overflow-y-auto">
            <div className="max-w-[22.5rem] w-full mx-auto my-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[0.6875rem] font-bold text-gray-500 tracking-[0.2em] uppercase mb-1 font-mono">
                    ACCESS PORTAL
                  </div>
                  <h2 className="text-[2rem] font-bold text-[#4A3043] tracking-tight">
                    Sign in
                  </h2>
                </div>
                <div className="w-11 h-11 border-[1.5px] border-black rounded-xl flex items-center justify-center text-[#714B67] bg-white shadow-[2px_2px_0_#000]">
                  <Shield className="w-5 h-5" />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-[1.5px] border-black text-red-700 text-xs font-mono rounded-xl shadow-[2px_2px_0_#000]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-[0.1em] uppercase mb-1.5 font-mono">
                    WORK EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="admin@brightloop.dev"
                    className="input-focus w-full px-4 py-3 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-[#4A3043] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[0.6875rem] font-bold text-gray-800 tracking-[0.1em] uppercase mb-1.5 font-mono">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="input-focus w-full px-4 py-3 bg-white border-[1.5px] border-black rounded-xl text-[0.875rem] font-medium text-[#4A3043] shadow-sm pr-11 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#714B67] transition-colors focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white font-bold text-[0.9375rem] py-3.5 rounded-xl btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Account Quick-Fill Badges */}
              <div className="mt-6 pt-4 border-t border-black/10">
                <span className="block text-[0.625rem] font-bold uppercase tracking-wider text-gray-500 mb-2 font-mono text-center">
                  QUICK FILL DEMO CREDENTIALS
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fillCreds('admin@brightloop.dev', 'Admin#2026')}
                    className="py-1.5 px-2 bg-white hover:bg-gray-50 border-[1.5px] border-black rounded-lg text-[0.6875rem] font-bold text-[#4A3043] transition-all hover:shadow-[2px_2px_0_#000] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillCreds('staff@brightloop.dev', 'Staff#2026')}
                    className="py-1.5 px-2 bg-white hover:bg-gray-50 border-[1.5px] border-black rounded-lg text-[0.6875rem] font-bold text-[#4A3043] transition-all hover:shadow-[2px_2px_0_#000] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => fillCreds('customer@brightloop.dev', 'Cust#2026')}
                    className="py-1.5 px-2 bg-white hover:bg-gray-50 border-[1.5px] border-black rounded-lg text-[0.6875rem] font-bold text-[#4A3043] transition-all hover:shadow-[2px_2px_0_#000] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
