import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: '爱的延续 - AI人生规划平台',
  description: '用爱守护家人，30分钟完成一生最重要的安排',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-cream antialiased">
        {children}
      </body>
    </html>
  )
}
