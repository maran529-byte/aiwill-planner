import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value
    const session = request.cookies.get('session')?.value

    if (!userId || !session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // 如果配置了Supabase，验证用户
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !user) {
        return NextResponse.json({ user: null }, { status: 401 })
      }

      return NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name },
      })
    }

    // 开发模式
    return NextResponse.json({
      user: { id: userId, email: 'dev@example.com', name: '开发用户' },
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
