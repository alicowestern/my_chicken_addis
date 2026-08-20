import { getFarmerById } from '@/lib/actions/farmers'
import { notFound } from 'next/navigation'
import FarmerDetailClient from './FarmerDetailClient'

export const metadata = {
  title: 'Farmer Detail',
}

export default async function FarmerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getFarmerById(id)

  if (!result.success) {
    notFound()
  }

  return <FarmerDetailClient farmer={result.data} />
}
