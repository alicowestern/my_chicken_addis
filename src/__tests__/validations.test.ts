import { describe, it, expect } from 'vitest'
import { phoneSchema, emailSchema, submitContactFormSchema, submitBirdOrderSchema } from '@/lib/validations'

describe('Zod Validations', () => {
  describe('Shared Schemas', () => {
    it('validates correct phone numbers', () => {
      expect(phoneSchema.safeParse('+251911123456').success).toBe(true)
      expect(phoneSchema.safeParse('0911123456').success).toBe(true)
    })

    it('rejects invalid phone numbers', () => {
      expect(phoneSchema.safeParse('123').success).toBe(false)
      expect(phoneSchema.safeParse('').success).toBe(false)
    })

    it('validates correct emails', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(emailSchema.safeParse('not-an-email').success).toBe(false)
    })
  })

  describe('Form Schemas', () => {
    it('validates contact form correctly', () => {
      const validData = {
        name: 'John Doe',
        phone: '0911123456',
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'Hello, I have a question.',
      }
      expect(submitContactFormSchema.safeParse(validData).success).toBe(true)

      const invalidData = {
        name: 'J', // too short
        phone: '0911123456',
        message: 'Hi', // too short
      }
      expect(submitContactFormSchema.safeParse(invalidData).success).toBe(false)
    })

    it('validates bird order correctly', () => {
      const validOrder = {
        customerName: 'Alice',
        customerPhone: '0911123456',
        deliveryMethod: 'PICKUP',
        items: [{ productId: 'prod_1', quantity: 100 }]
      }
      expect(submitBirdOrderSchema.safeParse(validOrder).success).toBe(true)

      const emptyItems = {
        ...validOrder,
        items: [] // invalid, must have at least one item
      }
      expect(submitBirdOrderSchema.safeParse(emptyItems).success).toBe(false)
    })
  })
})
