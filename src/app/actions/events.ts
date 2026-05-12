'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const name = formData.get('name') as string
  const dateStr = formData.get('date') as string

  if (!name || !dateStr) {
    throw new Error('Missing fields')
  }

  const event = await prisma.event.create({
    data: {
      name,
      date: new Date(dateStr),
      ownerId: user.id
    }
  })

  revalidatePath('/photographer/dashboard')
}

export async function getEvents() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  try {
    return await prisma.event.findMany({
      where: {
        ownerId: user.id
      },
      orderBy: {
        date: 'desc'
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export async function getEventById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  try {
    return await prisma.event.findFirst({
      where: {
        id,
        ownerId: user.id
      },
      include: {
        images: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching event by id:', error)
    return null
  }
}
