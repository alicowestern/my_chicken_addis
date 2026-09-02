export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-brand-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  )
}
