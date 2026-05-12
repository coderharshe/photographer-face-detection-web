'use server'

import { revalidatePath } from 'next/cache'

// This action is called when a photographer wants to start processing an event
export async function triggerProcessing(eventId: string) {
  console.log(`📡 Triggering GPU processing for event: ${eventId}`)

  // In production, this would be your Beam.cloud or Modal webhook URL
  const CLOUD_WORKER_URL = process.env.CLOUD_WORKER_URL

  if (!CLOUD_WORKER_URL) {
    console.warn('⚠️ CLOUD_WORKER_URL not set. Skipping cloud trigger.')
    return { success: false, message: 'Cloud worker not configured' }
  }

  try {
    const response = await fetch(CLOUD_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: eventId }),
    })

    if (response.ok) {
      console.log('✅ GPU processing triggered successfully')
      revalidatePath(`/photographer/dashboard/events/${eventId}`)
      return { success: true }
    } else {
      console.error('❌ Failed to trigger GPU processing')
      return { success: false, message: 'Failed to contact GPU server' }
    }
  } catch (error) {
    console.error('💥 Error triggering processing:', error)
    return { success: false, message: 'Connection error' }
  }
}
