import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'SUPER_ADMIN') {
    redirect('/admin/dashboard')
  }

  return <>{children}</>
}
