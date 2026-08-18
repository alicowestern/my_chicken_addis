import { StatCard } from '@/components/ui/index'
import { Users, Bird, Wheat, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold font-heading text-brand-white mb-2 text-center">Dashboard Overview</h1>
        <p className="text-brand-muted text-center">Welcome back to the My Chicken Addis admin portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Farmers"
          value="1,245"
          change="+12.5%"
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="Active Bird Orders"
          value="45"
          change="3 pending"
          changeType="neutral"
          icon={<Bird className="w-5 h-5" />}
        />
        <StatCard
          label="Feed Stock (Bags)"
          value="850"
          change="-20 from yesterday"
          changeType="negative"
          icon={<Wheat className="w-5 h-5" />}
        />
        <StatCard
          label="Financing Apps"
          value="12"
          change="Requires review"
          changeType="warning"
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Tables Placeholder */}
      <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[rgba(255,255,255,0.05)] bg-brand-dark">
          <h3 className="text-lg font-bold text-brand-white">Recent Activity</h3>
        </div>
        <div className="p-6">
          <p className="text-brand-muted text-sm text-center py-8">No recent activity to display.</p>
        </div>
      </div>
    </div>
  )
}
