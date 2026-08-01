import React, { useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { LandRecord, SoilType, WaterSource } from '../../types';
import { useForm } from 'react-hook-form';

interface AddEditLandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (land: Omit<LandRecord, 'id' | 'lastUpdated'>) => Promise<void>;
  initialData?: LandRecord | null;
  isLoading?: boolean;
}

interface FormValues {
  farmName: string;
  state: string;
  district: string;
  village: string;
  areaAcres: number;
  soilType: SoilType;
  waterSource: WaterSource;
  previousCrop: string;
  currentCrop?: string;
  status: LandRecord['status'];
  phLevel?: number;
  organicCarbonPercentage?: number;
}

const soilTypes: SoilType[] = [
  'Loamy',
  'Sandy Loam',
  'Clay Loam',
  'Black Soil (Regur)',
  'Alluvial',
  'Red & Yellow',
  'Laterite',
  'Saline / Alkaline',
];

const waterSources: WaterSource[] = [
  'Tube Well / Borewell',
  'Canal',
  'Rainfed',
  'Drip Irrigation',
  'Sprinkler System',
  'Pond / Farm Pond',
];

export const AddEditLandModal: React.FC<AddEditLandModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (initialData) {
      reset({
        farmName: initialData.farmName,
        state: initialData.state,
        district: initialData.district,
        village: initialData.village,
        areaAcres: initialData.areaAcres,
        soilType: initialData.soilType,
        waterSource: initialData.waterSource,
        previousCrop: initialData.previousCrop,
        currentCrop: initialData.currentCrop || '',
        status: initialData.status,
        phLevel: initialData.phLevel || 7.2,
        organicCarbonPercentage: initialData.organicCarbonPercentage || 0.6,
      });
    } else {
      reset({
        farmName: '',
        state: 'Rajasthan',
        district: 'Jaipur',
        village: 'Chomu',
        areaAcres: 5.0,
        soilType: 'Sandy Loam',
        waterSource: 'Tube Well / Borewell',
        previousCrop: 'Bajra',
        currentCrop: '',
        status: 'Active',
        phLevel: 7.2,
        organicCarbonPercentage: 0.6,
      });
    }
  }, [initialData, isOpen, reset]);

  const onSubmitForm = async (data: FormValues) => {
    await onSave(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Farm Land Profile' : 'Add New Farm Land Record'}
      subtitle="Register soil composition, water supply, and acreage"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farm / Plot Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Surya Mustard Field North"
              {...register('farmName', { required: true })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              State *
            </label>
            <input
              type="text"
              required
              {...register('state', { required: true })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              District *
            </label>
            <input
              type="text"
              required
              {...register('district', { required: true })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Village / Tehsil
            </label>
            <input
              type="text"
              {...register('village')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Plot Area (Acres) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              {...register('areaAcres', { valueAsNumber: true })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Soil Type *
            </label>
            <select
              {...register('soilType')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white"
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
              Primary Water Source *
            </label>
            <select
              {...register('waterSource')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white"
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
              Previous Harvested Crop
            </label>
            <input
              type="text"
              placeholder="e.g. Wheat, Bajra, Cotton"
              {...register('previousCrop')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Cultivated Crop (If Sown)
            </label>
            <input
              type="text"
              placeholder="e.g. Yellow Mustard Pusa-30"
              {...register('currentCrop')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Land Cultivation Status
            </label>
            <select
              {...register('status')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white"
            >
              <option value="Active">Active</option>
              <option value="Sown">Sown</option>
              <option value="Fallow">Fallow</option>
              <option value="Harvesting">Harvesting</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Soil pH Level
            </label>
            <input
              type="number"
              step="0.1"
              {...register('phLevel', { valueAsNumber: true })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            {initialData ? 'Update Land Record' : 'Save Land Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
