import { StatCard } from '@/components/ui/index'
import { Users, Bird, Wheat, DollarSign, MessageSquare, ArrowRight } from 'lucide-react'
import { getDashboardStats, getRecentOrders, getRecentLeads } from '@/lib/actions/dashboard'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default async function AdminDashboard() {
  const [stats, recentOrders, recentLeads] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
    getRecentLeads(),
  ])

  const orderStatusBadge: Record<string, 'success' | 'info' | 'warning' | 'error' | 'draft'> = {
    NEW: 'info',
    CONFIRMED: 'success',
    PREPARING: 'warning',
    READY: 'success',
    DELIVERED: 'success',
    COMPLETED: 'success',
    CANCELLED: 'error',
  }

  const leadStatusBadge: Record<string, 'success' | 'info' | 'warning' | 'error' | 'draft'> = {
    NEW: 'info',
    CONTACTED: 'warning',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    REJECTED: 'error',
    ARCHIVED: 'draft',
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-brand-white mb-1 sm:mb-2 text-left">Dashboard Overview</h1>
        <p className="text-brand-muted text-sm">Welcome back to the My Chicken Addis admin portal.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <Link href="/admin/farmers">
          <StatCard
            label="Total Farmers"
            value={stats.totalFarmers.toLocaleString()}
            icon={<Users className="w-5 h-5" />}
          />
        </Link>
        <Link href="/admin/orders">
          <StatCard
            label="Active Orders"
            value={stats.activeBirdOrders.toString()}
            change={stats.activeBirdOrders > 0 ? `${stats.activeBirdOrders} pending` : 'No pending'}
            changeType={stats.activeBirdOrders > 0 ? 'warning' : 'neutral'}
            icon={<Bird className="w-5 h-5" />}
          />
        </Link>
        <Link href="/admin/feed">
          <StatCard
            label="Feed Stock"
            value={stats.feedStockBags.toLocaleString()}
            change="bags total"
            changeType={stats.feedStockBags < 100 ? 'negative' : 'neutral'}
            icon={<Wheat className="w-5 h-5" />}
          />
        </Link>
        <Link href="/admin/financing">
          <StatCard
            label="Financing Apps"
            value={stats.pendingFinancing.toString()}
            change={stats.pendingFinancing > 0 ? 'Requires review' : 'All reviewed'}
            changeType={stats.pendingFinancing > 0 ? 'warning' : 'positive'}
            icon={<DollarSign className="w-5 h-5" />}
          />
        </Link>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[rgba(255,255,255,0.05)] bg-brand-dark flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-brand-white">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-brand-cyan hover:text-brand-blue flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.03)]">
            {recentOrders.length === 0 ? (
              <div className="p-6 sm:p-8">
                <p className="text-brand-muted text-sm text-center">No orders yet.</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <Link key={order.id} href="/admin/orders" className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-[rgba(79,195,247,0.03)] transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-white truncate">{order.customerName || 'Unknown'}</p>
                    <p className="text-xs text-brand-muted mt-0.5">
                      {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                    {order.totalAmount ? (
                      <span className="text-xs text-brand-light-gray hidden sm:inline">
                        {Number(order.totalAmount as any).toLocaleString()} ETB
                      </span>
                    ) : null}
                    <Badge variant={orderStatusBadge[order.status] || 'draft'}>
                      {order.status}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[rgba(255,255,255,0.05)] bg-brand-dark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-brand-white">New Leads</h3>
              {stats.newLeads > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-cyan/10 text-brand-cyan text-[10px] sm:text-xs font-bold border border-brand-cyan/20">
                  {stats.newLeads}
                </span>
              )}
            </div>
            <Link href="/admin/leads" className="text-xs text-brand-cyan hover:text-brand-blue flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.03)]">
            {recentLeads.length === 0 ? (
              <div className="p-6 sm:p-8">
                <p className="text-brand-muted text-sm text-center">No leads yet.</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <Link key={lead.id} href="/admin/leads" className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-[rgba(79,195,247,0.03)] transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-white truncate">{lead.name}</p>
                    <p className="text-xs text-brand-muted mt-0.5">
                      {lead.type.replace('_', ' ')} • {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant={leadStatusBadge[lead.status] || 'draft'}>
                    {lead.status}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
