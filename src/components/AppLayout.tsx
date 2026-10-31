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
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

