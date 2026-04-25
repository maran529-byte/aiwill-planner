import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using in-memory fallback.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

// In-memory fallback for development without Supabase
interface User {
  id: string
  email: string
  name?: string
  created_at: string
}

interface Will {
  id: string
  user_id: string
  will_data: Record<string, unknown>
  will_draft: string
  complexity_score: number
  complexity_level: string
  suggested_tier: string
  generated_at: string
  created_at: string
}

interface Booking {
  id: string
  user_id: string
  will_id: string
  lawyer_name: string
  lawyer_tier: string
  booking_date: string
  booking_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  contact_phone: string
  contact_email: string
  notes: string
  created_at: string
}

class InMemoryDB {
  private users: Map<string, User> = new Map()
  private wills: Map<string, Will> = new Map()
  bookings: Map<string, Booking> = new Map()

  // Users
  async createUser(email: string, name?: string): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      created_at: new Date().toISOString(),
    }
    this.users.set(user.id, user)
    return user
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  // Wills
  async createWill(
    userId: string,
    willData: Record<string, unknown>,
    willDraft: string,
    complexityScore: number,
    complexityLevel: string,
    suggestedTier: string
  ): Promise<Will> {
    const will: Will = {
      id: crypto.randomUUID(),
      user_id: userId,
      will_data: willData,
      will_draft: willDraft,
      complexity_score: complexityScore,
      complexity_level: complexityLevel,
      suggested_tier: suggestedTier,
      generated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    this.wills.set(will.id, will)
    return will
  }

  async getWillsByUserId(userId: string): Promise<Will[]> {
    return Array.from(this.wills.values()).filter(w => w.user_id === userId)
  }

  async getWillById(id: string): Promise<Will | null> {
    return this.wills.get(id) || null
  }

  // Bookings
  async createBooking(
    userId: string,
    willId: string,
    lawyerName: string,
    lawyerTier: string,
    bookingDate: string,
    bookingTime: string,
    contactPhone: string,
    contactEmail: string,
    notes: string
  ): Promise<Booking> {
    const booking: Booking = {
      id: crypto.randomUUID(),
      user_id: userId,
      will_id: willId,
      lawyer_name: lawyerName,
      lawyer_tier: lawyerTier,
      booking_date: bookingDate,
      booking_time: bookingTime,
      status: 'pending',
      contact_phone: contactPhone,
      contact_email: contactEmail,
      notes,
      created_at: new Date().toISOString(),
    }
    this.bookings.set(booking.id, booking)
    return booking
  }

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.user_id === userId)
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    const booking = this.bookings.get(id)
    if (!booking) return null
    booking.status = status
    this.bookings.set(id, booking)
    return booking
  }
}

export const db = new InMemoryDB()
export type { User, Will, Booking }
