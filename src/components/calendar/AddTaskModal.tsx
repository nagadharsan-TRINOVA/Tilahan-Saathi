import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CalendarTask, TaskCategory } from '../../types';
import { useForm } from 'react-hook-form';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<CalendarTask, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

interface FormValues {
  cropName: string;
  title: string;
  category: TaskCategory;
  dueDate: string;
  dayNumber: number;
  description: string;
  quantityPerAcre?: string;
  recommendedProducts?: string;
  priority: 'High' | 'Medium' | 'Low';
}

const categories: TaskCategory[] = [
  'Soil Preparation',
  'Sowing',
  'Irrigation',
  'Fertilizer',
  'Pest Monitoring',
  'Harvest',
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      cropName: 'Yellow Mustard (Pusa Bold)',
      title: 'Top Dressing Urea Application',
      category: 'Fertilizer',
      dueDate: new Date().toISOString().split('T')[0],
      dayNumber: 30,
      description: 'Apply Neem coated Urea with Sulphur 90% WDG @ 10kg/acre.',
      quantityPerAcre: '35 kg Urea / acre',
      recommendedProducts: 'Neem Coated Urea, Sulphur 90%',
      priority: 'High',
    },
  });

  const onSubmitForm = async (data: FormValues) => {
    const products = data.recommendedProducts
      ? data.recommendedProducts.split(',').map((p) => p.trim())
      : [];

    await onSave({
      cropName: data.cropName,
      title: data.title,
      category: data.category,
      dueDate: data.dueDate,
      dayNumber: Number(data.dayNumber),
      description: data.description,
      recommendedProducts: products,
      quantityPerAcre: data.quantityPerAcre,
      priority: data.priority,
      isCompleted: false,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Crop Calendar Task"
      subtitle="Schedule field activities, fertilizer dosage, and pest checks"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Task Name / Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Sowing & Imidacloprid Seed Treatment"
            {...register('title', { required: true })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Crop Name *
            </label>
            <input
              type="text"
              required
              {...register('cropName', { required: true })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Category *
            </label>
            <select
              {...register('category')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              required
              {...register('dueDate', { required: true })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity / Dosage per Acre
            </label>
            <input
              type="text"
              placeholder="e.g. 10 kg / acre"
              {...register('quantityPerAcre')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recommended Products
            </label>
            <input
              type="text"
              placeholder="e.g. Sulphur 90%, Neem Urea"
              {...register('recommendedProducts')}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Task Instructions & Details
          </label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Describe field steps, precautions, spray parameters..."
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Add Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
