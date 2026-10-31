import { Search, Plus } from 'lucide-react'
import { useAuth } from '../auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Topbar({ breadcrumb }: { breadcrumb?: string }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  return (
    <header className="h-16 bg-white border-b border-[#E4DEE3] flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[#746F75]">
        <span>Home</span>
        <span className="text-[#E4DEE3]">/</span>
        <span className="font-medium text-[#29242B] capitalize">{breadcrumb || 'Dashboard'}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#746F75]" />
          <input
            type="text"
            placeholder="Search (⌘K)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-sm border border-[#E4DEE3] rounded-sm bg-[#F7F5F7] text-[#29242B] placeholder:text-[#746F75] focus:border-[#724B68] focus:bg-white focus:outline-none w-56 transition-colors"
          />
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/subscriptions')}
          className="bg-[#724B68] hover:bg-[#36283B] text-white text-xs font-medium px-3.5 py-2 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus size={13} />
          <span>New Subscription</span>
        </button>

        {/* User Badge */}
        {user && (
          <div className="w-8 h-8 bg-[#F7F5F7] border border-[#E4DEE3] rounded-full flex items-center justify-center text-sm font-medium text-[#746F75]">
            {user.name.charAt(0)}
          </div>
        )}
      </div>
    </header>
  )
}
