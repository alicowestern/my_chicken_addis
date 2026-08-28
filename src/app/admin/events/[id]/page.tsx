import { notFound } from 'next/navigation'
import { getEventById } from '@/lib/actions/events'
import EditEventClient from './EditEventClient'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getEventById(id)

  if (!result.success) {
    notFound()
  }

  return <EditEventClient event={result.data} />
}
