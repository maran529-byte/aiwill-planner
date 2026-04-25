import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // 清除所有会话cookie
  response.cookies.delete('session')
  response.cookies.delete('user_id')
  
  return response
}
