import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const location = useLocation()

  // Generate a clean breadcrumb based on current path
  const pathParts = location.pathname.split('/').filter(Boolean)
  const currentSection = pathParts[pathParts.length - 1] || 'Dashboard'
  const breadcrumb = currentSection.replace('-', ' ')

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f7f5f8] relative text-gray-900 select-none">
      <div className="bg-layer" />
      <div className="bg-glow" />

      {/* Sidebar with Neo-Brutalist Glass Styling */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <Topbar breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-[81.25rem] mx-auto space-y-8 pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
