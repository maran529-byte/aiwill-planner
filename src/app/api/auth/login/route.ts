import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码必填' },
        { status: 400 }
      )
    }

    // 如果配置了Supabase，使用真实登录
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        return NextResponse.json(
          { error: '邮箱或密码错误' },
          { status: 401 }
        )
      }

      // 生成会话token
      const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
      })
      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      response.cookies.set('user_id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })

      return response
    }

    // 无Supabase配置时的内存登录（仅开发用）
    const sessionToken = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({
      success: true,
      user: { id: 'dev-user-id', email, name: '' },
      note: '开发模式',
    })
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    response.cookies.set('user_id', 'dev-user-id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
