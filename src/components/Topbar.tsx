import { Search, Plus, Clock, LogOut } from 'lucide-react'
import { useAuth } from '../auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Topbar({ breadcrumb }: { breadcrumb?: string }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  return (
    <header className="h-20 bg-white/60 backdrop-blur-xl border-b-[1.5px] border-black flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[0.8125rem] font-medium text-gray-500">
        <span onClick={() => navigate('/dashboard')} className="hover:text-[#714B67] cursor-pointer transition-colors">
          Home
        </span>
        <span className="text-gray-400">/</span>
        <span className="text-[#4A3043] font-bold capitalize">{breadcrumb || 'Dashboard'}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 anim-fade">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search records (⌘K)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-focus pl-9 pr-4 py-2 text-[0.8125rem] bg-white border-[1.5px] border-black rounded-xl text-[#4A3043] placeholder:text-gray-400 w-52 shadow-xs"
          />
        </div>

        {/* Tactile Action Button */}
        <button
          onClick={() => navigate('/subscriptions')}
          className="btn-primary text-white px-5 py-2.5 rounded-xl text-[0.8125rem] font-bold flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>New Subscription</span>
        </button>

        {/* Quick Clock / Log trigger */}
        <button
          onClick={() => navigate('/activity')}
          title="Audit Trail"
          className="w-10 h-10 bg-white border-[1.5px] border-black rounded-xl flex items-center justify-center text-[#714B67] hover:text-[#4A3043] transition-all hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
        >
          <Clock size={16} />
        </button>

        <div className="h-8 w-px bg-black/20 mx-1"></div>

        {/* Profile + Role Pill */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[0.8125rem] font-bold text-[#4A3043] leading-tight truncate max-w-[140px]">
                {user.name}
              </span>
              <span className="text-[0.5625rem] font-bold bg-white text-[#714B67] border-[1.5px] border-black px-2 py-0.5 rounded uppercase tracking-wider mt-1 shadow-sm font-mono">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="w-10 h-10 bg-white border-[1.5px] border-black rounded-xl flex items-center justify-center text-[#714B67] hover:text-[#4A3043] transition-all hover:shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
