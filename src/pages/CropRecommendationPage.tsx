import React, { useState } from 'react';
import { RecommendationForm } from '../components/recommendation/RecommendationForm';
import { CropRecommendationInput } from '../types';
import { recommendationService } from '../services/recommendationService';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export const CropRecommendationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useApp();

  const handleGenerate = async (input: CropRecommendationInput) => {
    setIsLoading(true);
    try {
      const result = await recommendationService.generateRecommendation(input);
      addToast({
        type: 'success',
        title: 'AI Recommendation Ready!',
        message: `Optimal crop: ${result.recommendedCrop}`,
      });
      navigate(`/recommendation-result/${result.id}`);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Computation Failed',
        message: 'Could not compute AI recommendation.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <RecommendationForm onSubmit={handleGenerate} isLoading={isLoading} />
    </div>
  );
};
