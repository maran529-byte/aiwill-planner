import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码必填' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少6位' },
        { status: 400 }
      )
    }

    // 如果配置了Supabase，使用真实注册
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      // 检查邮箱是否已注册
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        return NextResponse.json(
          { error: '该邮箱已注册' },
          { status: 400 }
        )
      }

      // 创建用户
      const { data: user, error } = await supabase
        .from('users')
        .insert({ email, name })
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: '注册失败: ' + error.message },
          { status: 500 }
        )
      }

      // 生成简单的会话token（实际生产应该用JWT）
      const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
      })
      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7天
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

    // 无Supabase配置时的内存注册（仅开发用）
    const userId = crypto.randomUUID()
    const sessionToken = Buffer.from(`${userId}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({
      success: true,
      user: { id: userId, email, name },
      note: '开发模式 - 数据存储在内存中',
    })
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    response.cookies.set('user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
