import { Suspense } from 'react'
import { getWebsiteSettings } from '@/lib/actions/admin'
import SettingsPageClient from './SettingsPageClient'

export default async function SettingsAdminPage() {
  const result = await getWebsiteSettings()
  const settings = result.success ? result.data : []

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPageClient initialSettings={settings} />
    </Suspense>
  )
}
