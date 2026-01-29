import { Header } from '@/components/layout/header'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { DashboardCharts } from '@/components/dashboard/charts'
import { RecentDocuments } from '@/components/dashboard/recent-documents'
import { mockStats, mockMonthlyData, mockTopProviders, mockDocuments } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Dashboard" 
        subtitle="Vision general del sistema de gestion documental"
      />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={mockStats} />

        {/* Charts */}
        <DashboardCharts 
          stats={mockStats} 
          monthlyData={mockMonthlyData}
          topProviders={mockTopProviders}
        />

        {/* Recent Documents */}
        <RecentDocuments documents={mockDocuments} />
      </div>
    </div>
  )
}
