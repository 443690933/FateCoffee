import './globals.css'

export const metadata = {
  title: '咖啡小记',
  description: '管理咖啡豆库存的应用',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="bg-light min-h-screen">
        {children}
      </body>
    </html>
  )
}