import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CropRecommendationInput, SoilType, WaterSource } from '../../types';
import { Sparkles, Sprout, ShieldAlert, ArrowRight, Layers, Droplets } from 'lucide-react';

interface RecommendationFormProps {
  onSubmit: (input: CropRecommendationInput) => void;
  isLoading?: boolean;
}

const indianStates = [
  'Rajasthan',
  'Madhya Pradesh',
  'Gujarat',
  'Maharashtra',
  'Haryana',
  'Punjab',
  'Uttar Pradesh',
  'Karnataka',
  'Telangana',
  'Andhra Pradesh',
];

const soilTypes: SoilType[] = [
  'Sandy Loam',
  'Loamy',
  'Black Soil (Regur)',
  'Clay Loam',
  'Alluvial',
  'Red & Yellow',
  'Laterite',
  'Saline / Alkaline',
];

const waterSources: WaterSource[] = [
  'Tube Well / Borewell',
  'Canal',
  'Drip Irrigation',
  'Sprinkler System',
  'Rainfed',
  'Pond / Farm Pond',
];

export const RecommendationForm: React.FC<RecommendationFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { register, handleSubmit } = useForm<CropRecommendationInput>({
    defaultValues: {
      state: 'Rajasthan',
      district: 'Jaipur',
      village: 'Chomu',
      farmSizeAcres: 5.5,
      budgetRupees: 90000,
      soilType: 'Sandy Loam',
      waterAvailability: 'Tube Well / Borewell',
      previousCrop: 'Pearl Millet (Bajra)',
      season: 'Rabi (Winter)',
    },
  });

  return (
    <Card className="max-w-4xl mx-auto space-y-6 p-6 sm:p-8 border border-emerald-900/10 shadow-lg">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2E7D32] to-[#66BB6A] text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-6 h-6 text-[#FFB300]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            AI Oilseed Crop Recommendation
          </h2>
          <p className="text-xs text-slate-500">
            Provide your land specs to calculate the highest yield & oil content variety
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Location Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-[#2E7D32]" />
            <span>1. Farm Location & Region</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State *
              </label>
              <select
                {...register('state')}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white"
              >
                {indianStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District *
              </label>
              <input
                type="text"
                required
                {...register('district')}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Village / Tehsil
              </label>
              <input
                type="text"
                {...register('village')}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>
        </div>

        {/* Soil & Water Section */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#2E7D32]" />
            <span>2. Soil Type & Water Resource</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Soil Classification *
              </label>
              <select
                {...register('soilType')}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white"
              >
                {soilTypes.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Water Availability *
              </label>
              <select
                {...register('waterAvailability')}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white"
              >
                {waterSources.map((ws) => (
                  <option key={ws} value={ws}>
                    {ws}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Cultivation Season *
              </label>
              <select
                {...register('season')}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white"
              >
                <option value="Rabi (Winter)">Rabi (Winter - Oct to Mar)</option>
                <option value="Kharif (Monsoon)">Kharif (Monsoon - Jun to Oct)</option>
                <option value="Zaid (Summer)">Zaid (Summer - Mar to Jun)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget & Crop Economics */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-[#2E7D32]" />
            <span>3. Farm Area & Investment Capital</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farm Size (Acres) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                {...register('farmSizeAcres', { valueAsNumber: true })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Budget (₹ INR) *
              </label>
              <input
                type="number"
                step="1000"
                required
                {...register('budgetRupees', { valueAsNumber: true })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previous Crop Harvested
              </label>
              <input
                type="text"
                placeholder="e.g. Bajra, Wheat, Cotton"
                {...register('previousCrop')}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Trained on ICAR & National Mission on Edible Oils agronomy datasets.
            </span>
          </p>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            icon={Sparkles}
            iconPosition="right"
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Generate AI Recommendation
          </Button>
        </div>
      </form>
    </Card>
  );
};
