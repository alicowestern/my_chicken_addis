// ============================================================
// MY CHICKEN ADDIS — APPLICATION CONSTANTS
// Centralized source of truth for company info & site metadata
// ============================================================

export const COMPANY = {
  name: 'My Chicken Addis',
  tagline: 'Grow Your Poultry Business With Confidence',
  description:
    'Quality 45-day birds, poultry feed, practical farmer training, and access to financing opportunities. Helping farmers start and grow successful poultry businesses in Addis Ababa, Ethiopia.',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+251 911 123 456',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@mychickenaddis.com',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '251911123456',
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Addis Ababa, Ethiopia',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://mychickenaddis.com',
} as const

export const SOCIAL_LINKS = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || '',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
} as const

export const SITE_META = {
  title: {
    default: `${COMPANY.name} — Poultry Farming & Farmer Services`,
    template: `%s | ${COMPANY.name}`,
  },
  keywords: [
    'poultry farming',
    '45-day birds',
    'poultry feed',
    'poultry training',
    'poultry financing',
    'Addis Ababa',
    'Ethiopia',
    'chicken farming',
    'broiler chicken',
    'My Chicken Addis',
  ],
} as const
