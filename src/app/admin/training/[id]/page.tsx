import { notFound } from 'next/navigation'
import { getTrainingCourseById } from '@/lib/actions/training'
import TrainingDetailClient from './TrainingDetailClient'

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getTrainingCourseById(id)

  if (!result.success) {
    notFound()
  }

  return <TrainingDetailClient course={result.data} />
}
