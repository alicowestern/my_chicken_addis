'use client'

import React, { useState } from 'react'
import { Settings, Save, Building2, Phone, Globe, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { updateWebsiteSettingsBatch } from '@/lib/actions/admin'

type SettingItem = {
  id: string
  key: string
  value: string
  group: string
}

// Defaults for initial setup if no settings exist yet
const SETTING_GROUPS = [
  {
    key: 'company',
    title: 'Company Information',
    icon: <Building2 className="w-5 h-5" />,
    fields: [
      { key: 'company_name', label: 'Company Name', type: 'text', placeholder: 'My Chicken Addis' },
      { key: 'company_tagline', label: 'Tagline', type: 'text', placeholder: 'Premium Poultry Solutions' },
      { key: 'company_description', label: 'Description', type: 'textarea', placeholder: 'Brief company description...' },
      { key: 'company_address', label: 'Address', type: 'text', placeholder: 'Addis Ababa, Ethiopia' },
      { key: 'company_registration', label: 'Business Registration #', type: 'text', placeholder: '' },
    ],
  },
  {
    key: 'contact',
    title: 'Contact Details',
    icon: <Phone className="w-5 h-5" />,
    fields: [
      { key: 'contact_phone', label: 'Phone Number', type: 'text', placeholder: '+251...' },
      { key: 'contact_phone_alt', label: 'Alt Phone Number', type: 'text', placeholder: '+251...' },
      { key: 'contact_email', label: 'Email', type: 'email', placeholder: 'info@mychickenaddis.com' },
      { key: 'contact_whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '+251...' },
    ],
  },
  {
    key: 'social',
    title: 'Social Media',
    icon: <Globe className="w-5 h-5" />,
    fields: [
      { key: 'social_facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/...' },
      { key: 'social_instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...' },
      { key: 'social_telegram', label: 'Telegram Channel', type: 'url', placeholder: 'https://t.me/...' },
      { key: 'social_tiktok', label: 'TikTok URL', type: 'url', placeholder: 'https://tiktok.com/@...' },
      { key: 'social_youtube', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/...' },
      { key: 'social_linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/company/...' },
    ],
  },
  {
    key: 'operations',
    title: 'Operations',
    icon: <MessageCircle className="w-5 h-5" />,
    fields: [
      { key: 'ops_working_hours', label: 'Working Hours', type: 'text', placeholder: 'Mon-Sat: 8:00 AM - 6:00 PM' },
      { key: 'ops_delivery_areas', label: 'Delivery Areas', type: 'text', placeholder: 'Addis Ababa, Debre Berhan, Bishoftu...' },
      { key: 'ops_min_order_birds', label: 'Min Bird Order Quantity', type: 'number', placeholder: '50' },
      { key: 'ops_min_order_feed', label: 'Min Feed Order (kg)', type: 'number', placeholder: '100' },
    ],
  },
]

export default function SettingsPageClient({
  initialSettings,
}: {
  initialSettings: SettingItem[]
}) {
  const settingsMap = Object.fromEntries(initialSettings.map((s) => [s.key, s.value]))
  const [values, setValues] = useState<Record<string, string>>(settingsMap)
  const [savingGroup, setSavingGroup] = useState<string | null>(null)

  const getValue = (key: string) => values[key] || ''
  const setValue = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }))

  const handleSaveGroup = async (groupKey: string, fields: typeof SETTING_GROUPS[0]['fields']) => {
    setSavingGroup(groupKey)
    try {
      const fd = new FormData()
      fd.set('_group', groupKey)
      fields.forEach((f) => fd.set(f.key, getValue(f.key)))

      const result = await updateWebsiteSettingsBatch(fd)
      if (result.success) {
        toast.success('Settings saved')
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setSavingGroup(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-6 h-6 text-brand-cyan" />
          <h1 className="text-2xl font-bold font-heading text-brand-white text-left">Website Settings</h1>
        </div>
        <p className="text-brand-muted text-sm">Configure your website information and operational parameters</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {SETTING_GROUPS.map((group) => (
          <div key={group.key} className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                {group.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-white">{group.title}</h3>
            </div>

            <div className="space-y-4">
              {group.fields.map((field) => (
                field.type === 'textarea' ? (
                  <Textarea
                    key={field.key}
                    label={field.label}
                    value={getValue(field.key)}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : (
                  <Input
                    key={field.key}
                    label={field.label}
                    type={field.type || 'text'}
                    value={getValue(field.key)}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )
              ))}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)]">
              <Button
                icon={<Save className="w-4 h-4" />}
                onClick={() => handleSaveGroup(group.key, group.fields)}
                loading={savingGroup === group.key}
              >
                Save {group.title}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
