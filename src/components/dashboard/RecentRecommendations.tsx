import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CropRecommendationResult } from '../../types';
import { recommendationService } from '../../services/recommendationService';
import { Sparkles, ArrowRight, TrendingUp, Droplets, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<CropRecommendationResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    recommendationService.getRecommendations().then(setRecommendations);
  }, []);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base font-serif">
              Recent AI Crop Recommendations
            </h3>
            <p className="text-xs text-slate-500">
              Personalized for your soil pH, water availability & budget
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/crop-recommendation')}
          className="text-xs font-semibold text-[#2E7D32] hover:underline flex items-center gap-1"
        >
          <span>Run New Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {recommendations.slice(0, 2).map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/recommendation-result/${item.id}`)}
            className="p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-900/10 transition-all cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="green" size="md">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                  {item.confidenceScore}% Match Confidence
                </Badge>
                <span className="text-xs text-slate-500 font-medium">
                  {item.suitableSeason}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Generated {item.createdAt}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2E7D32] transition-colors font-serif mb-1">
              {item.recommendedCrop}
            </h4>

            <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
              {item.reason}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-900/10 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block font-medium">
                  Expected Yield
                </span>
                <span className="font-extrabold text-slate-900 font-serif">
                  {item.expectedYieldQuintalPerAcre} Qtl / Acre
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-medium">
                  Est. Net Profit
                </span>
                <span className="font-extrabold text-emerald-800 font-serif flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  ₹{item.expectedProfitPerAcreRupees.toLocaleString('en-IN')}/Acre
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-medium">
                  Oil Content
                </span>
                <span className="font-extrabold text-amber-700 font-serif flex items-center gap-0.5">
                  <Droplets className="w-3 h-3 text-amber-500" />
                  {item.oilContentPercentage}% Oil
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
