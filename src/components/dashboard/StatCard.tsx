import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../common/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendType?: 'positive' | 'neutral' | 'negative';
  icon: LucideIcon;
  iconBgColor?: string;
  accentBorderColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendType = 'positive',
  icon: Icon,
  iconBgColor = 'bg-emerald-100 text-[#2E7D32]',
  accentBorderColor = 'border-l-4 border-[#2E7D32]',
}) => {
  return (
    <Card hoverEffect className={`relative overflow-hidden bg-white p-5 rounded-2xl shadow-sm ${accentBorderColor}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-1 text-[#2E7D32]">
            {value}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 font-normal">{subtitle}</p>}
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${iconBgColor}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium">
          <span
            className={
              trendType === 'positive'
                ? 'text-emerald-600 font-medium'
                : trendType === 'negative'
                ? 'text-rose-600 font-medium'
                : 'text-amber-600 font-medium'
            }
          >
            {trend}
          </span>
          <span className="text-slate-400 font-normal text-[11px]">vs last season</span>
        </div>
      )}
    </Card>
  );
};
