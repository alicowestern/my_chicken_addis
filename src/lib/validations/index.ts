import { z } from 'zod/v4'

// ============================================================
// SHARED SCHEMAS
// ============================================================

export const phoneSchema = z.string().min(9, 'Phone number is required').max(20)
export const emailSchema = z.email('Invalid email address')
export const optionalEmail = z.email('Invalid email address').optional().or(z.literal(''))

// ============================================================
// FARMER SCHEMAS
// ============================================================

export const createFarmerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: phoneSchema,
  email: optionalEmail,
  location: z.string().optional(),
  farmLocation: z.string().optional(),
  experience: z.string().optional(),
  farmSize: z.string().optional(),
  birdCapacity: z.coerce.number().int().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT', 'ARCHIVED']).default('PROSPECT'),
})

export const updateFarmerSchema = createFarmerSchema.partial()

// ============================================================
// BIRD PRODUCT SCHEMAS
// ============================================================

export const createBirdProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  birdType: z.string().min(1, 'Bird type is required'),
  description: z.string().optional(),
  age: z.string().optional(),
  weight: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive').optional(),
  availableQuantity: z.coerce.number().int().min(0).default(0),
  minimumOrder: z.coerce.number().int().positive().optional(),
  status: z.enum(['AVAILABLE', 'LIMITED', 'SOLD_OUT', 'UPCOMING', 'ARCHIVED']).default('AVAILABLE'),
  pickupInfo: z.string().optional(),
  deliveryInfo: z.string().optional(),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export const updateBirdProductSchema = createBirdProductSchema.partial()

// ============================================================
// FEED PRODUCT SCHEMAS
// ============================================================

export const createFeedProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional(),
  category: z.enum(['STARTER', 'GROWER', 'FINISHER', 'LAYER', 'OTHER_INPUTS']).default('STARTER'),
  suitableStage: z.string().optional(),
  packageSize: z.string().optional(),
  purchasePrice: z.coerce.number().positive().optional(),
  sellingPrice: z.coerce.number().positive().optional(),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  reorderLevel: z.coerce.number().int().min(0).default(10),
  supplier: z.string().optional(),
  status: z.enum(['AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED', 'ARCHIVED']).default('AVAILABLE'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export const updateFeedProductSchema = createFeedProductSchema.partial()

export const addFeedInventorySchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  type: z.enum(['RECEIVED', 'SOLD', 'ADJUSTMENT']),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
})

// ============================================================
// ORDER SCHEMAS
// ============================================================

export const birdOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().int().positive('Quantity must be positive'),
})

export const submitBirdOrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: phoneSchema,
  customerEmail: optionalEmail,
  customerLocation: z.string().optional(),
  preferredDate: z.string().optional(),
  deliveryMethod: z.enum(['PICKUP', 'DELIVERY']).default('PICKUP'),
  experience: z.string().optional(),
  message: z.string().optional(),
  items: z.array(birdOrderItemSchema).min(1, 'At least one item is required'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['NEW', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED']),
  notes: z.string().optional(),
})

// ============================================================
// TRAINING SCHEMAS
// ============================================================

export const createTrainingCourseSchema = z.object({
  name: z.string().min(2, 'Course name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  duration: z.string().optional(),
  trainer: z.string().optional(),
  location: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  capacity: z.coerce.number().int().positive().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'COMPLETED', 'ARCHIVED']).default('DRAFT'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export const updateTrainingCourseSchema = createTrainingCourseSchema.partial()

export const submitTrainingRegistrationSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  eventId: z.string().optional(),
  registrantName: z.string().min(2, 'Name is required'),
  registrantPhone: phoneSchema,
  registrantEmail: optionalEmail,
  notes: z.string().optional(),
})

// ============================================================
// FINANCING SCHEMAS
// ============================================================

export const submitFinancingApplicationSchema = z.object({
  applicantName: z.string().min(2, 'Name is required'),
  applicantPhone: phoneSchema,
  applicantEmail: optionalEmail,
  applicantLocation: z.string().optional(),
  farmLocation: z.string().optional(),
  experience: z.string().optional(),
  currentBirds: z.coerce.number().int().min(0).optional(),
  plannedBirds: z.coerce.number().int().positive().optional(),
  requestedAmount: z.coerce.number().positive('Amount must be positive').optional(),
  estimatedInvestment: z.coerce.number().positive().optional(),
  purpose: z.string().optional(),
  farmInfo: z.string().optional(),
  existingFarm: z.boolean().default(false),
  message: z.string().optional(),
})

// ============================================================
// LEAD / CONTACT SCHEMAS
// ============================================================

export const submitContactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: phoneSchema,
  email: optionalEmail,
  subject: z.string().optional(),
  message: z.string().min(5, 'Message is required'),
})

export const updateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'ARCHIVED']).optional(),
  assignedStaffId: z.string().optional(),
  notes: z.string().optional(),
})

// ============================================================
// BLOG SCHEMAS
// ============================================================

export const createBlogPostSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const updateBlogPostSchema = createBlogPostSchema.partial()

// ============================================================
// EVENT SCHEMAS
// ============================================================

export const createEventSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  eventType: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  organizer: z.string().optional(),
  featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).default('UPCOMING'),
})

export const updateEventSchema = createEventSchema.partial()

export const submitEventRegistrationSchema = z.object({
  eventId: z.string().min(1, 'Event is required'),
  name: z.string().min(2, 'Name is required'),
  phone: phoneSchema,
  email: optionalEmail,
  organization: z.string().optional(),
  location: z.string().optional(),
  participants: z.coerce.number().int().positive().default(1),
  message: z.string().optional(),
})

// ============================================================
// FAQ SCHEMAS
// ============================================================

export const createFAQSchema = z.object({
  question: z.string().min(5, 'Question is required'),
  answer: z.string().min(5, 'Answer is required'),
  category: z.enum(['BIRDS', 'FEED', 'TRAINING', 'FINANCING', 'GENERAL']).default('GENERAL'),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
})

export const updateFAQSchema = createFAQSchema.partial()

// ============================================================
// TESTIMONIAL SCHEMAS
// ============================================================

export const createTestimonialSchema = z.object({
  farmerName: z.string().min(2, 'Name is required'),
  location: z.string().optional(),
  content: z.string().min(10, 'Testimonial content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

// ============================================================
// WEBSITE SETTINGS SCHEMA
// ============================================================

export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
})
