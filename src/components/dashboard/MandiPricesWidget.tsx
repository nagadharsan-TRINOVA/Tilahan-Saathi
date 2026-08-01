import React from 'react';
import { Card } from '../common/Card';
import { MandiPrice } from '../../types';
import { initialMandiPrices } from '../../data/mockNotifications';
import { TrendingUp, TrendingDown, Store } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const priceHistoryData = [
  { month: 'May', mustard: 5200, groundnut: 6100, soybean: 4400 },
  { month: 'Jun', mustard: 5350, groundnut: 6250, soybean: 4500 },
  { month: 'Jul', mustard: 5600, groundnut: 6300, soybean: 4620 },
  { month: 'Aug (Cur)', mustard: 5850, groundnut: 6420, soybean: 4780 },
];

export const MandiPricesWidget: React.FC = () => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base font-serif">
              Live Mandi Oilseed Prices (Molar / Quintal)
            </h3>
            <p className="text-xs text-slate-500">
              Real-time APMC Mandi rates across India
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-full uppercase">
          Live NAFED Feed
        </span>
      </div>

      {/* Mini Chart */}
      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="mustardGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB300" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FFB300" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="groundnutGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[4000, 7000]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="mustard"
              name="Mustard (₹/Qtl)"
              stroke="#FFB300"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#mustardGrad)"
            />
            <Area
              type="monotone"
              dataKey="groundnut"
              name="Groundnut (₹/Qtl)"
              stroke="#2E7D32"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#groundnutGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mandi Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {initialMandiPrices.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50/50 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="font-medium truncate">{item.mandiName}</span>
              <span>{item.state}</span>
            </div>
            <p className="text-xs font-bold text-slate-800 truncate mb-1">
              {item.commodity}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-slate-900 font-serif">
                ₹{item.modalPricePerQuintal.toLocaleString('en-IN')}
              </span>
              <span
                className={`flex items-center gap-0.5 text-xs font-bold ${
                  item.priceChangeRupees >= 0
                    ? 'text-emerald-700'
                    : 'text-rose-600'
                }`}
              >
                {item.priceChangeRupees >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {item.priceChangeRupees >= 0 ? '+' : ''}
                  {item.priceChangeRupees}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
