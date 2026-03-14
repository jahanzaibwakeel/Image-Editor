import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Canvas Image Editor',
  description: 'A full-featured browser-based image editor built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark-900 text-white h-screen overflow-hidden">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a24',
              color: '#e2e2f0',
              border: '1px solid #3d3d52',
              borderRadius: '8px',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}