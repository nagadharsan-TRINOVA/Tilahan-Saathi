import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CropRecommendationResult } from '../types';
import { recommendationService } from '../services/recommendationService';
import { RecommendationResult } from '../components/recommendation/RecommendationResult';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/common/Button';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const RecommendationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<CropRecommendationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useApp();

  useEffect(() => {
    if (id) {
      recommendationService.getRecommendationById(id).then((res) => {
        if (res) {
          setResult(res);
        } else {
          recommendationService.getRecommendations().then((list) => {
            if (list.length > 0) setResult(list[0]);
          });
        }
        setLoading(false);
      });
    } else {
      recommendationService.getRecommendations().then((list) => {
        if (list.length > 0) setResult(list[0]);
        setLoading(false);
      });
    }
  }, [id]);

  const handleSave = () => {
    if (result) {
      recommendationService.saveRecommendation(result);
      addToast({
        type: 'success',
        title: 'Recommendation Saved',
        message: `${result.recommendedCrop} saved to your profile.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-bold text-slate-700">Loading AI Agronomy Recommendation...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-12 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
        <p className="font-bold text-slate-700">No recommendation found.</p>
        <Button variant="primary" onClick={() => navigate('/crop-recommendation')}>
          Run New AI Recommendation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => navigate('/crop-recommendation')}
        >
          Back to AI Form
        </Button>
      </div>

      <RecommendationResult result={result} onSave={handleSave} />
    </div>
  );
};
