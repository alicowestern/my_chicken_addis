'use server'

import { prisma } from '@/lib/database/prisma'
import { type ActionResult, handleActionError } from '@/lib/actions/utils'
import {
  submitContactFormSchema,
  submitBirdOrderSchema,
  submitTrainingRegistrationSchema,
  submitFinancingApplicationSchema,
  submitEventRegistrationSchema,
} from '@/lib/validations'
import type { Lead, BirdOrder, TrainingRegistration, FinancingApplication, EventRegistration } from '@prisma/client'
import { sendEmail } from '@/lib/email/resend'
import OrderConfirmationEmail from '@/lib/email/templates/OrderConfirmationEmail'

// ============================================================
// CONTACT FORM → Creates a Lead
// ============================================================

export async function submitContactForm(formData: FormData): Promise<ActionResult<Lead>> {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = submitContactFormSchema.parse(raw)

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        subject: data.subject || null,
        message: data.message,
        type: 'GENERAL_CONTACT',
        status: 'NEW',
      },
    })

    return { success: true, data: lead }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// BIRD ORDER → Creates BirdOrder + Items + Lead
// ============================================================

export async function submitBirdOrder(formData: FormData): Promise<ActionResult<BirdOrder>> {
  try {
    const raw = Object.fromEntries(formData.entries())

    // Parse items from JSON string
    const itemsRaw = formData.get('items')
    let items: { productId: string; quantity: number }[] = []
    if (typeof itemsRaw === 'string') {
      items = JSON.parse(itemsRaw)
    }

    const data = submitBirdOrderSchema.parse({ ...raw, items })

    // Fetch products for pricing
    const products = await prisma.birdProduct.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    const order = await prisma.$transaction(async (tx) => {
      // Calculate order items
      const orderItems = data.items.map((item) => {
        const product = productMap.get(item.productId)
        const unitPrice = product?.price ? Number(product.price) : 0
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          total: unitPrice * item.quantity,
        }
      })

      const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0)

      // Create the order
      const birdOrder = await tx.birdOrder.create({
        data: {
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          customerLocation: data.customerLocation || null,
          preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
          deliveryMethod: data.deliveryMethod,
          experience: data.experience || null,
          message: data.message || null,
          totalAmount,
          items: {
            create: orderItems,
          },
        },
      })

      // Create a lead for follow-up
      await tx.lead.create({
        data: {
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail || null,
          type: 'BIRD_INQUIRY',
          subject: `Bird Order Request`,
          message: data.message || `Order for ${data.items.length} products`,
          status: 'NEW',
          birdOrderId: birdOrder.id,
        },
      })

      return birdOrder
    })

    // Send Email Notification
    if (data.customerEmail) {
      await sendEmail({
        to: data.customerEmail,
        subject: `Order Received - ${order.orderNumber}`,
        react: OrderConfirmationEmail({
          customerName: data.customerName,
          orderNumber: order.orderNumber,
          totalAmount: Number(order.totalAmount),
        }),
      })
    }

    return { success: true, data: order }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// TRAINING REGISTRATION
// ============================================================

export async function submitTrainingRegistration(formData: FormData): Promise<ActionResult<TrainingRegistration>> {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = submitTrainingRegistrationSchema.parse(raw)

    const registration = await prisma.trainingRegistration.create({
      data: {
        courseId: data.courseId,
        eventId: data.eventId || null,
        registrantName: data.registrantName,
        registrantPhone: data.registrantPhone,
        registrantEmail: data.registrantEmail || null,
        notes: data.notes || null,
        attendance: 'REGISTERED',
      },
    })

    return { success: true, data: registration }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// FINANCING APPLICATION
// ============================================================

export async function submitFinancingApplication(formData: FormData): Promise<ActionResult<FinancingApplication>> {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = submitFinancingApplicationSchema.parse({
      ...raw,
      existingFarm: raw.existingFarm === 'true',
    })

    const application = await prisma.financingApplication.create({
      data: {
        applicantName: data.applicantName,
        applicantPhone: data.applicantPhone,
        applicantEmail: data.applicantEmail || null,
        applicantLocation: data.applicantLocation || null,
        farmLocation: data.farmLocation || null,
        experience: data.experience || null,
        currentBirds: data.currentBirds || null,
        plannedBirds: data.plannedBirds || null,
        requestedAmount: data.requestedAmount || null,
        estimatedInvestment: data.estimatedInvestment || null,
        purpose: data.purpose || null,
        farmInfo: data.farmInfo || null,
        existingFarm: data.existingFarm,
        message: data.message || null,
        status: 'SUBMITTED',
      },
    })

    return { success: true, data: application }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// EVENT REGISTRATION
// ============================================================

export async function submitEventRegistration(formData: FormData): Promise<ActionResult<EventRegistration>> {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = submitEventRegistrationSchema.parse(raw)

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: data.eventId,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        organization: data.organization || null,
        location: data.location || null,
        participants: data.participants,
        message: data.message || null,
        attendance: 'REGISTERED',
      },
    })

    return { success: true, data: registration }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// PUBLIC DATA FETCHERS (No auth)
// ============================================================

export async function getPublishedBlogPosts(page: number = 1, limit: number = 9) {
  try {
    const skip = (page - 1) * limit
    const where = { status: 'PUBLISHED' as const, deletedAt: null }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          author: { select: { name: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    return { success: true as const, data: { posts, total, totalPages: Math.ceil(total / limit), page } }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getUpcomingEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: { in: ['UPCOMING', 'ONGOING'] },
        deletedAt: null,
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 20,
    })

    return { success: true as const, data: events }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getActiveFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
    })

    return { success: true as const, data: faqs }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getActiveTrainingCourses() {
  try {
    const courses = await prisma.trainingCourse.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      include: {
        events: {
          where: { status: { in: ['UPCOMING', 'ONGOING'] } },
          orderBy: { date: 'asc' },
          take: 3,
        },
      },
      orderBy: { name: 'asc' },
    })

    return { success: true as const, data: courses }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getPublishedTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayDate: 'desc' },
      take: 10,
    })

    return { success: true as const, data: testimonials }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getGalleryMedia(category?: string) {
  try {
    const where: Record<string, unknown> = {}
    if (category && category !== 'ALL') {
      where.category = category
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return { success: true as const, data: media }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getAvailableBirdProducts() {
  try {
    const products = await prisma.birdProduct.findMany({
      where: {
        status: { in: ['AVAILABLE', 'LIMITED', 'SOLD_OUT', 'UPCOMING'] },
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true as const, data: products }
  } catch (error) {
    return handleActionError(error)
  }
}
