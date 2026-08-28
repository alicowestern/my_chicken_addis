export default function FarmerPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <main>{children}</main>
    </div>
  )
}
