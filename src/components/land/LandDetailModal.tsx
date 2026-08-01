import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { LandRecord } from '../../types';
import { MapPin, Droplets, Layers, Calendar, Sparkles, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LandDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  land: LandRecord | null;
}

export const LandDetailModal: React.FC<LandDetailModalProps> = ({
  isOpen,
  onClose,
  land,
}) => {
  const navigate = useNavigate();
  if (!land) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={land.farmName}
      subtitle={`Plot Area: ${land.areaAcres} Acres • ${land.village}, ${land.district}, ${land.state}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Status Header Strip */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Status:</span>
            <Badge
              variant={
                land.status === 'Sown'
                  ? 'green'
                  : land.status === 'Active'
                  ? 'blue'
                  : 'amber'
              }
              size="md"
            >
              {land.status}
            </Badge>
          </div>

          <Button
            variant="accent"
            size="sm"
            icon={Sparkles}
            onClick={() => {
              onClose();
              navigate('/crop-recommendation');
            }}
          >
            Run Oilseed AI Recommendation
          </Button>
        </div>

        {/* Soil & Water Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px]">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Soil Parameters</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 font-serif">
              {land.soilType}
            </p>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-600">
              <span>Soil pH Index:</span>
              <span className="font-extrabold text-slate-900 font-serif">
                {land.phLevel || 7.2} (Ideal for Mustard)
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Organic Carbon:</span>
              <span className="font-extrabold text-slate-900 font-serif">
                {land.organicCarbonPercentage || 0.6}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px]">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>Irrigation Infrastructure</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 font-serif">
              {land.waterSource}
            </p>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-600">
              <span>Previous Harvest:</span>
              <span className="font-bold text-slate-900">
                {land.previousCrop}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Current Crop:</span>
              <span className="font-bold text-emerald-800">
                {land.currentCrop || 'Field Ready / Fallow'}
              </span>
            </div>
          </div>
        </div>

        {/* Soil Health Card (NPK parameters) */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FFB300]">
              <Activity className="w-4 h-4" />
              <span>National Soil Health Card Data (Kg/Ha)</span>
            </div>
            <span className="text-[10px] text-emerald-300">
              Updated {land.lastUpdated}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1 text-center">
            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-300 block">Nitrogen (N)</span>
              <span className="text-lg font-extrabold font-serif text-emerald-400">
                {land.nitrogenKgHa || 210}
              </span>
              <span className="text-[9px] text-slate-400 block">Medium</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-300 block">Phosphorus (P)</span>
              <span className="text-lg font-extrabold font-serif text-amber-400">
                {land.phosphorusKgHa || 28}
              </span>
              <span className="text-[9px] text-slate-400 block">Optimal</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-300 block">Potassium (K)</span>
              <span className="text-lg font-extrabold font-serif text-sky-400">
                {land.potassiumKgHa || 310}
              </span>
              <span className="text-[9px] text-slate-400 block">High</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
