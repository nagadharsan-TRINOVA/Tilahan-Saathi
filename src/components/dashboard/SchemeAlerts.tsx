import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { GovernmentScheme } from '../../types';
import { schemeService } from '../../services/schemeService';
import { Building2, ArrowRight, Award, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SchemeAlerts: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    schemeService.getSchemes().then(setSchemes);
  }, []);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
            <Building2 className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base font-serif">
              Government Scheme & Subsidy Alerts
            </h3>
            <p className="text-xs text-slate-500">
              National Mission on Edible Oils & PM Kisan Grants
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/government-schemes')}
          className="text-xs font-semibold text-[#2E7D32] hover:underline flex items-center gap-1"
        >
          <span>All Schemes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {schemes.slice(0, 2).map((scheme) => (
          <div
            key={scheme.id}
            onClick={() => navigate('/government-schemes')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200/80 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" />
                {scheme.category}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {scheme.nodalAgency.slice(0, 20)}...
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-1 mb-1">
              {scheme.schemeName}
            </h4>

            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2">
              {scheme.benefits}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs font-bold text-emerald-800">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#FFB300]" />
                Max Subsidy:
              </span>
              <span>{scheme.subsidyAmountMax}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
