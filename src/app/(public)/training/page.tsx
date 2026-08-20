import { SectionHeader } from '@/components/ui/index'
import Card from '@/components/ui/Card'
import { getActiveTrainingCourses } from '@/lib/actions/public'
import TrainingRegistrationForm from './TrainingRegistrationForm'
import { GraduationCap, MapPin, Calendar, BookOpen, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Farmer Training',
  description: 'Practical, hands-on poultry training programs for beginners and experienced farmers in Ethiopia.',
}

export default async function TrainingPage() {
  const result = await getActiveTrainingCourses()
  const courses = result.success ? result.data : []

  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
              label="Knowledge & Empowerment"
              title="Farmer Training Programs"
              description="Gain the practical skills and theoretical knowledge required to run a highly profitable poultry business."
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          {courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-brand-muted text-lg mb-4">No active training courses available right now.</p>
              <p className="text-brand-muted text-sm">Please check back later or contact us to express your interest.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              {courses.map((course) => (
                <Card key={course.id} className="bg-brand-surface p-10 border-[rgba(255,255,255,0.05)] flex flex-col justify-between h-full hover:border-brand-cyan/30 transition-colors group">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center group-hover:bg-brand-cyan group-hover:text-brand-dark transition-colors">
                        {course.name.toLowerCase().includes('advanced') ? (
                          <GraduationCap className="w-7 h-7" />
                        ) : (
                          <BookOpen className="w-7 h-7" />
                        )}
                      </div>
                      {course.price ? (
                        <div className="bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full text-brand-cyan font-bold text-sm">
                          {Number(course.price)} ETB
                        </div>
                      ) : (
                        <div className="bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full text-brand-cyan font-bold text-sm">
                          Free
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-brand-white mb-4">{course.name}</h3>
                    {course.description && (
                      <p className="text-brand-light-gray leading-relaxed mb-8">
                        {course.description}
                      </p>
                    )}
                    <div className="flex flex-col gap-3 mb-8">
                      {course.duration && (
                        <div className="flex items-center text-sm text-brand-muted">
                          <Clock className="w-4 h-4 mr-3 text-brand-cyan" /> {course.duration}
                        </div>
                      )}
                      {course.location && (
                        <div className="flex items-center text-sm text-brand-muted">
                          <MapPin className="w-4 h-4 mr-3 text-brand-cyan" /> {course.location}
                        </div>
                      )}
                      {/* Upcoming events for this course */}
                      {course.events && course.events.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                          <p className="text-xs font-bold text-brand-cyan uppercase tracking-wider mb-3">Upcoming Sessions</p>
                          <ul className="space-y-2 text-sm text-brand-muted">
                            {course.events.map((e) => (
                              <li key={e.id} className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-brand-cyan/70" />
                                {new Date(e.date).toLocaleDateString()} {e.startTime ? `at ${e.startTime}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <a href={`#register-${course.id}`} className="mt-auto">
                    <Button className="w-full rounded-full">Register Interest</Button>
                  </a>
                </Card>
              ))}
            </div>
          )}

          {courses.length > 0 && (
            <div className="max-w-3xl mx-auto bg-brand-surface rounded-2xl p-8 md:p-10 border border-[rgba(255,255,255,0.05)] shadow-card">
              <h3 className="text-2xl font-bold font-heading text-brand-white mb-2">Register for Training</h3>
              <p className="text-brand-muted text-sm mb-8">Select a course to register. Our training coordinator will contact you to confirm the schedule.</p>
              <TrainingRegistrationForm courses={courses} />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
