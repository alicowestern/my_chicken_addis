import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '@/lib/auth/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || (session.user?.role === 'FARMER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Ignore if directory already exists
    }

    const ext = file.name.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${ext}`
    const path = join(uploadDir, uniqueFilename)

    await writeFile(path, buffer)

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${uniqueFilename}` 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}
