import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import FloatingContactButtons from '@/components/public/FloatingContactButtons'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingContactButtons />
    </>
  )
}
