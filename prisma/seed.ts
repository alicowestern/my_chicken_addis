import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ---- Super Admin ----
  const hashedPassword = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mychickenaddis.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@mychickenaddis.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // ---- Demo Farmers ----
  const farmers = await Promise.all([
    prisma.farmer.upsert({
      where: { farmerId: 'FARMER-001' },
      update: {},
      create: {
        farmerId: 'FARMER-001',
        fullName: 'Abebe Kebede',
        phone: '+251911000001',
        email: 'abebe@example.com',
        location: 'Bole, Addis Ababa',
        farmLocation: 'Sendafa',
        experience: '2 years',
        farmSize: 'Small',
        birdCapacity: 500,
        status: 'ACTIVE',
      },
    }),
    prisma.farmer.upsert({
      where: { farmerId: 'FARMER-002' },
      update: {},
      create: {
        farmerId: 'FARMER-002',
        fullName: 'Tigist Haile',
        phone: '+251911000002',
        email: 'tigist@example.com',
        location: 'Kirkos, Addis Ababa',
        experience: 'Beginner',
        farmSize: 'Planning',
        birdCapacity: 200,
        status: 'PROSPECT',
      },
    }),
    prisma.farmer.upsert({
      where: { farmerId: 'FARMER-003' },
      update: {},
      create: {
        farmerId: 'FARMER-003',
        fullName: 'Solomon Tekle',
        phone: '+251911000003',
        location: 'Yeka, Addis Ababa',
        farmLocation: 'Sululta',
        experience: '5 years',
        farmSize: 'Medium',
        birdCapacity: 2000,
        status: 'ACTIVE',
      },
    }),
  ])
  console.log(`✅ ${farmers.length} demo farmers created`)

  // ---- Bird Products ----
  const birdProducts = await Promise.all([
    prisma.birdProduct.create({
      data: {
        name: 'Broiler - 45 Day',
        birdType: 'Broiler',
        description: 'Quality broiler chickens raised for 45 days, ready for market. [DEMO DATA]',
        age: '45 days',
        weight: '1.8-2.2 kg',
        availableQuantity: 0,
        minimumOrder: 50,
        status: 'AVAILABLE',
      },
    }),
    prisma.birdProduct.create({
      data: {
        name: 'Day-Old Chicks',
        birdType: 'Day-Old',
        description: 'Day-old broiler chicks for farmers who want to raise from day one. [DEMO DATA]',
        age: '1 day',
        availableQuantity: 0,
        minimumOrder: 100,
        status: 'UPCOMING',
      },
    }),
  ])
  console.log(`✅ ${birdProducts.length} bird products created`)

  // ---- Feed Products ----
  const feedProducts = await Promise.all([
    prisma.feedProduct.create({
      data: {
        name: 'Starter Feed',
        description: 'Starter feed for chicks from day 1 to day 14. [DEMO DATA]',
        category: 'STARTER',
        suitableStage: '0-14 days',
        packageSize: '50 kg',
        stockQuantity: 0,
        status: 'AVAILABLE',
      },
    }),
    prisma.feedProduct.create({
      data: {
        name: 'Grower Feed',
        description: 'Grower feed for birds from day 15 to day 28. [DEMO DATA]',
        category: 'GROWER',
        suitableStage: '15-28 days',
        packageSize: '50 kg',
        stockQuantity: 0,
        status: 'AVAILABLE',
      },
    }),
    prisma.feedProduct.create({
      data: {
        name: 'Finisher Feed',
        description: 'Finisher feed for birds from day 29 to market. [DEMO DATA]',
        category: 'FINISHER',
        suitableStage: '29-45 days',
        packageSize: '50 kg',
        stockQuantity: 0,
        status: 'AVAILABLE',
      },
    }),
  ])
  console.log(`✅ ${feedProducts.length} feed products created`)

  // ---- Training Courses ----
  const courses = await Promise.all([
    prisma.trainingCourse.create({
      data: {
        name: 'Poultry Farming Introduction',
        description: 'A beginner-friendly course covering the basics of poultry farming. [DEMO DATA]',
        category: 'Beginner',
        duration: '2 days',
        location: 'Addis Ababa',
        status: 'ACTIVE',
      },
    }),
    prisma.trainingCourse.create({
      data: {
        name: 'Farm Setup & Housing',
        description: 'Learn how to set up your poultry farm, including housing, equipment, and biosecurity. [DEMO DATA]',
        category: 'Setup',
        duration: '1 day',
        location: 'Addis Ababa',
        status: 'ACTIVE',
      },
    }),
    prisma.trainingCourse.create({
      data: {
        name: 'Poultry Business Management',
        description: 'Advanced course on managing a profitable poultry business, including financial planning and record keeping. [DEMO DATA]',
        category: 'Business',
        duration: '3 days',
        location: 'Addis Ababa',
        status: 'DRAFT',
      },
    }),
  ])
  console.log(`✅ ${courses.length} training courses created`)

  // ---- Blog Categories ----
  const categories = await Promise.all([
    prisma.blogCategory.create({ data: { name: 'News', slug: 'news', description: 'Company news and updates' } }),
    prisma.blogCategory.create({ data: { name: 'Events', slug: 'events', description: 'Event announcements and reports' } }),
    prisma.blogCategory.create({ data: { name: 'Farmer Stories', slug: 'farmer-stories', description: 'Success stories from our farmers' } }),
    prisma.blogCategory.create({ data: { name: 'Poultry Education', slug: 'poultry-education', description: 'Educational content about poultry farming' } }),
    prisma.blogCategory.create({ data: { name: 'Announcements', slug: 'announcements', description: 'Important announcements' } }),
    prisma.blogCategory.create({ data: { name: 'Community', slug: 'community', description: 'Community activities and engagement' } }),
  ])
  console.log(`✅ ${categories.length} blog categories created`)

  // ---- Sample Blog Post ----
  await prisma.blogPost.create({
    data: {
      title: 'Welcome to My Chicken Addis',
      slug: 'welcome-to-my-chicken-addis',
      excerpt: 'We are excited to launch our new website and digital platform for poultry farmers.',
      content: 'Welcome to My Chicken Addis! We are building a digital platform that connects poultry farmers with quality birds, feed, knowledge, financing, and farm-management tools. Stay tuned for updates. [DEMO CONTENT]',
      categoryId: categories[0].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      seoTitle: 'Welcome to My Chicken Addis — Poultry Farming Platform',
      seoDescription: 'My Chicken Addis launches its digital platform for Ethiopian poultry farmers.',
    },
  })
  console.log('✅ Sample blog post created')

  // ---- Financing Partner ----
  await prisma.financingPartner.create({
    data: {
      name: 'Life Saving Credit',
      description: 'Our financing partner providing access to credit opportunities for poultry farmers. [PARTNER INFORMATION TO BE UPDATED]',
      status: 'ACTIVE',
    },
  })
  console.log('✅ Financing partner created')

  // ---- FAQs ----
  const faqs = await Promise.all([
    prisma.fAQ.create({ data: { question: 'What are 45-day birds?', answer: 'These are broiler chickens raised to reach market weight within approximately 45 days.', category: 'BIRDS', displayOrder: 1 } }),
    prisma.fAQ.create({ data: { question: 'How do I order birds?', answer: 'You can request birds through our website or by contacting us via phone or WhatsApp.', category: 'BIRDS', displayOrder: 2 } }),
    prisma.fAQ.create({ data: { question: 'What types of feed do you offer?', answer: 'We offer starter, grower, and finisher feeds suitable for different stages of bird growth.', category: 'FEED', displayOrder: 1 } }),
    prisma.fAQ.create({ data: { question: 'Who can attend training?', answer: 'Our training is open to new and existing farmers, youth entrepreneurs, and anyone interested in poultry farming.', category: 'TRAINING', displayOrder: 1 } }),
    prisma.fAQ.create({ data: { question: 'Does My Chicken Addis provide loans?', answer: 'We do not directly provide loans. We help connect farmers with financing opportunities through our collaboration with Life Saving Credit. The financing partner makes all final decisions.', category: 'FINANCING', displayOrder: 1 } }),
    prisma.fAQ.create({ data: { question: 'Where are you located?', answer: 'We are based in Addis Ababa, Ethiopia. Contact us for our exact address.', category: 'GENERAL', displayOrder: 1 } }),
  ])
  console.log(`✅ ${faqs.length} FAQs created`)

  // ---- Website Settings ----
  const settings = [
    { key: 'company_name', value: 'My Chicken Addis', group: 'general' },
    { key: 'company_phone', value: '[COMPANY PHONE]', group: 'contact' },
    { key: 'company_email', value: '[COMPANY EMAIL]', group: 'contact' },
    { key: 'company_address', value: 'Addis Ababa, Ethiopia', group: 'contact' },
    { key: 'company_whatsapp', value: '[WHATSAPP NUMBER]', group: 'contact' },
    { key: 'facebook_url', value: '', group: 'social' },
    { key: 'telegram_url', value: '', group: 'social' },
    { key: 'tiktok_url', value: '', group: 'social' },
    { key: 'instagram_url', value: '', group: 'social' },
    { key: 'youtube_url', value: '', group: 'social' },
    { key: 'hero_headline', value: 'Grow Your Poultry Business With Confidence', group: 'homepage' },
    { key: 'hero_subheadline', value: 'Quality 45-day birds, poultry feed, practical farmer training, and access to financing opportunities — all designed to help farmers start and grow successful poultry businesses.', group: 'homepage' },
  ]

  for (const setting of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log(`✅ ${settings.length} website settings created`)

  // ---- Demo Testimonials ----
  await Promise.all([
    prisma.testimonial.create({
      data: {
        farmerName: 'Demo Farmer 1',
        location: 'Addis Ababa',
        content: '[DEMO TESTIMONIAL — Replace with a real farmer story] This is a placeholder testimonial for development purposes.',
        status: 'DRAFT',
      },
    }),
    prisma.testimonial.create({
      data: {
        farmerName: 'Demo Farmer 2',
        location: 'Addis Ababa',
        content: '[DEMO TESTIMONIAL — Replace with a real farmer story] This is a placeholder testimonial for development purposes.',
        status: 'DRAFT',
      },
    }),
  ])
  console.log('✅ Demo testimonials created (marked as DRAFT)')

  console.log('\n🎉 Seed completed successfully!')
  console.log('📧 Admin login: admin@mychickenaddis.com / Admin@123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
