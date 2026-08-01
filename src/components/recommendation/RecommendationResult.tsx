import React, { useState } from 'react';
import { CropRecommendationResult } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CheckoutModal } from '../orders/CheckoutModal';
import {
  Sparkles,
  TrendingUp,
  Droplets,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  BookmarkCheck,
  Share2,
  ShoppingBag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

interface RecommendationResultProps {
  result: CropRecommendationResult;
  onSave?: () => void;
}

export const RecommendationResult: React.FC<RecommendationResultProps> = ({
  result,
  onSave,
}) => {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Tilahan Saathi AI Crop Result: ${result.recommendedCrop}`,
        text: `AI recommended ${result.recommendedCrop} with ${result.confidenceScore}% match, yielding ${result.expectedYieldQuintalPerAcre} Qtl/Acre.`,
        url: window.location.href,
      });
    } else {
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Recommendation summary copied to clipboard.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <Card className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 sm:p-8 relative overflow-hidden shadow-2xl border-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB300]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Badge variant="amber" size="md" className="bg-[#FFB300] text-amber-950 font-bold border-none">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI Matched Oilseed Crop
          </Badge>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {onSave && (
              <Button variant="secondary" size="sm" icon={BookmarkCheck} onClick={onSave}>
                Save Result
              </Button>
            )}
          </div>
        </div>

        {/* Title & Score */}
        <div className="space-y-2 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              {result.recommendedCrop}
            </h1>

            <div className="flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/50 px-3 py-1.5 rounded-2xl w-fit">
              <Award className="w-5 h-5 text-[#FFB300]" />
              <span className="text-sm font-bold text-emerald-100">
                {result.confidenceScore}% AI Confidence
              </span>
            </div>
          </div>
          <p className="text-emerald-200/90 text-xs sm:text-sm leading-relaxed">
            {result.reason}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-800/80">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] text-emerald-300 font-medium uppercase tracking-wider block">
              Expected Yield
            </span>
            <p className="text-lg sm:text-xl font-extrabold font-serif text-white mt-0.5">
              {result.expectedYieldQuintalPerAcre} Qtl
            </p>
            <span className="text-[10px] text-emerald-200">Per Acre Harvest</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] text-amber-300 font-medium uppercase tracking-wider block">
              Estimated Net Profit
            </span>
            <p className="text-lg sm:text-xl font-extrabold font-serif text-[#FFB300] mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              ₹{result.expectedProfitPerAcreRupees.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-200">Per Acre / Season</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] text-amber-300 font-medium uppercase tracking-wider block">
              Oil Recovery Rate
            </span>
            <p className="text-lg sm:text-xl font-extrabold font-serif text-white mt-0.5 flex items-center gap-1">
              <Droplets className="w-4 h-4 text-amber-400" />
              {result.oilContentPercentage}%
            </p>
            <span className="text-[10px] text-emerald-200">Mandi Premium Grade</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] text-emerald-300 font-medium uppercase tracking-wider block">
              Growth Duration
            </span>
            <p className="text-lg sm:text-xl font-extrabold font-serif text-white mt-0.5">
              {result.growthDurationDays} Days
            </p>
            <span className="text-[10px] text-emerald-200">{result.suitableSeason}</span>
          </div>
        </div>
      </Card>

      {/* Advantages & Precautions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advantages */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base font-serif">
              Key Agronomic Advantages
            </h3>
          </div>

          <div className="space-y-3">
            {result.advantages.map((adv, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
                <h4 className="font-bold text-xs text-emerald-950 mb-0.5">
                  {adv.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Precautions */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base font-serif">
              Critical Precautions & Safeguards
            </h3>
          </div>

          <div className="space-y-3">
            {result.precautions.map((prec, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-bold text-xs text-amber-950">
                    {prec.title}
                  </h4>
                  <Badge variant={prec.severity === 'High' ? 'red' : 'amber'}>
                    {prec.severity} Priority
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {prec.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Action Footer Card */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 via-white to-amber-50 flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-200">
        <div>
          <h4 className="font-bold text-slate-900 text-base font-serif">
            Ready to Cultivate {result.recommendedCrop}?
          </h4>
          <p className="text-xs text-slate-600">
            Order NMEO 50% subsidized certified seeds directly or generate your 120-day schedule
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="lg"
            icon={ShoppingBag}
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full sm:w-auto shadow-md"
          >
            Order Certified Seeds (Supabase DB)
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={Calendar}
            iconPosition="right"
            onClick={() => navigate('/crop-calendar')}
            className="w-full sm:w-auto shadow-md"
          >
            Generate Calendar
          </Button>
        </div>
      </Card>

      {/* Supabase Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cropRecommendationId={result.id}
        initialItem={{
          name: `${result.recommendedCrop} Certified Seeds`,
          category: 'Certified Seeds',
          unitPriceRupees: 900,
          subsidyPercent: 50,
          quantity: 2,
        }}
      />
    </div>
  );
};
