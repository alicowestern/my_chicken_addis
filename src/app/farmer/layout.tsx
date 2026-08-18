export default function FarmerPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* TODO: Farmer portal layout - Phase 3 */}
      <main className="p-6">{children}</main>
    </div>
  )
}
