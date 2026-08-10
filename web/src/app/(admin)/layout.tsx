import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-muted/20 font-sans">
      <AdminSidebar />
      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 bg-muted/20 w-full transition-all">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
