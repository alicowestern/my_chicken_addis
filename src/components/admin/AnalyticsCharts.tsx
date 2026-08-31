'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import type { SalesChartData, FarmerChartData } from '@/lib/actions/dashboard'

interface AnalyticsChartsProps {
  salesData: SalesChartData[]
  farmerData: FarmerChartData[]
}

const COLORS = ['#14b8a6', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

export default function AnalyticsCharts({ salesData, farmerData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Sales Chart */}
      <div className="bg-brand-surface border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-brand-white mb-6">Revenue (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fill: 'rgba(255,255,255,0.5)' }} 
                  tickFormatter={(val) => {
                    const date = new Date(val);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: '#14b8a6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex h-full items-center justify-center text-brand-muted">No sales data available for this period.</div>
          )}
        </div>
      </div>

      {/* Farmers Chart */}
      <div className="bg-brand-surface border border-[rgba(255,255,255,0.05)] rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-brand-white mb-6">Farmers by Status</h3>
        <div className="h-[300px] w-full">
          {farmerData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={farmerData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="status" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {farmerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-brand-muted">No farmer data available.</div>
          )}
        </div>
      </div>
    </div>
  )
}
