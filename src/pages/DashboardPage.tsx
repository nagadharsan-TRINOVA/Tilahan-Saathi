import React from 'react';
import { useApp } from '../contexts/AppContext';
import { StatCard } from '../components/dashboard/StatCard';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { MandiPricesWidget } from '../components/dashboard/MandiPricesWidget';
import { RecentRecommendations } from '../components/dashboard/RecentRecommendations';
import { TaskOverview } from '../components/dashboard/TaskOverview';
import { SchemeAlerts } from '../components/dashboard/SchemeAlerts';
import { MapPin, Sprout, TrendingUp, Award, Sparkles, Plus, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { profile, lands, t } = useApp();
  const navigate = useNavigate();

  const totalArea = lands.reduce((acc, curr) => acc + curr.areaAcres, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB300]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#FFB300] text-amber-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                AI Decision Support
              </span>
              <span className="text-emerald-300 text-xs font-medium">
                Kisan ID: {profile?.kisanId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              {t('welcomeFarmer')}, {profile?.name || 'Farmer'}!
            </h1>

            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
              {t('farmOverview')} in {profile?.district}, {profile?.state}. Optimize yield & oil recovery with AI-guided agronomy.
            </p>
          </div>

          {/* Quick Farmer Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="accent"
              icon={Sparkles}
              onClick={() => navigate('/crop-recommendation')}
              className="shadow-md"
            >
              {t('getRecommendation')}
            </Button>
            <Button
              variant="outline"
              icon={Plus}
              onClick={() => navigate('/land-management')}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              {t('addLand')}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Area"
          value={`${totalArea || 12.5} Acres`}
          subtitle="Across 4 active farm plots"
          trend="+2.5 Acres"
          trendType="positive"
          icon={MapPin}
          iconBgColor="bg-emerald-100 text-[#2E7D32]"
          accentBorderColor="border-l-4 border-[#2E7D32]"
        />

        <StatCard
          title="Est. Yield / Harvest"
          value="840 Kg/ha"
          subtitle="Mustard Premium Grade"
          trend="Pusa-30 & GG-20 varieties"
          trendType="positive"
          icon={Sprout}
          iconBgColor="bg-amber-100 text-amber-900"
          accentBorderColor="border-l-4 border-[#FFB300]"
        />

        <StatCard
          title="Estimated Net Profit"
          value="₹2,66,750"
          subtitle="Projected for Rabi harvest"
          trend="+18% Margin"
          trendType="positive"
          icon={TrendingUp}
          iconBgColor="bg-emerald-100 text-emerald-800"
          accentBorderColor="border-l-4 border-[#66BB6A]"
        />

        <StatCard
          title="Government Subsidies"
          value="2 Approved"
          subtitle="NMEO-Oilseeds mini-kits active"
          trend="₹15,000 / Acre Grant"
          trendType="positive"
          icon={Award}
          iconBgColor="bg-purple-100 text-purple-900"
          accentBorderColor="border-l-4 border-[#1B431E]"
        />
      </div>

      {/* Main Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (2 Columns Wide on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <WeatherWidget />
          <MandiPricesWidget />
          <RecentRecommendations />
        </div>

        {/* Right Col (1 Column Wide) */}
        <div className="space-y-6">
          <TaskOverview />
          <SchemeAlerts />
        </div>
      </div>
    </div>
  );
};
