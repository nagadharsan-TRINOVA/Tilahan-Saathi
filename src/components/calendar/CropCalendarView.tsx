import React, { useState } from 'react';
import { CalendarTask, TaskCategory } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  ListFilter,
  Check,
  Clock,
  Droplets,
  Sprout,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface CropCalendarViewProps {
  tasks: CalendarTask[];
  onToggleTask: (taskId: string) => Promise<void>;
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => Promise<void>;
}

const categories: (TaskCategory | 'ALL')[] = [
  'ALL',
  'Soil Preparation',
  'Sowing',
  'Irrigation',
  'Fertilizer',
  'Pest Monitoring',
  'Harvest',
];

export const CropCalendarView: React.FC<CropCalendarViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'month'>('timeline');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'ALL'>('ALL');
  const { addToast } = useApp();

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter(
    (t) => categoryFilter === 'ALL' || t.category === categoryFilter
  );

  const getCategoryColor = (cat: TaskCategory) => {
    switch (cat) {
      case 'Sowing':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Irrigation':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Fertilizer':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Pest Monitoring':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Harvest':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress Card */}
      <Card className="p-6 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white relative overflow-hidden shadow-xl border-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#FFB300] uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              Agronomic Field Schedule
            </span>
            <h2 className="text-2xl font-extrabold font-serif text-white">
              Yellow Mustard & Groundnut Crop Calendar
            </h2>
            <p className="text-xs text-emerald-200">
              {completedCount} of {totalCount} agronomic tasks completed ({progressPercent}%)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="accent" icon={Plus} onClick={onAddTask}>
              Add Custom Task
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-emerald-800/80">
          <div className="w-full h-3 bg-emerald-950/80 rounded-full overflow-hidden p-0.5 border border-emerald-700/50">
            <div
              className="h-full bg-gradient-to-r from-[#FFB300] to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'timeline'
                ? 'bg-white text-[#2E7D32] shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'month'
                ? 'bg-white text-[#2E7D32] shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Monthly Grid</span>
          </button>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <Card
              key={task.id}
              className={`relative transition-all border ${
                task.isCompleted
                  ? 'bg-slate-50/80 border-slate-200 opacity-75'
                  : 'bg-white border-emerald-900/10 shadow-xs hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Completion Checkbox */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-1 transition-transform hover:scale-110 shrink-0"
                  aria-label="Toggle completed"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 hover:text-[#2E7D32]" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                          task.category
                        )}`}
                      >
                        {task.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {task.cropName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300/80">
                        Day {task.dayNumber} • {task.dueDate}
                      </span>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3
                    className={`text-base font-bold font-serif ${
                      task.isCompleted
                        ? 'line-through text-slate-500'
                        : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Quantity & Products */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
                    {task.quantityPerAcre && (
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        Dosage: {task.quantityPerAcre}
                      </span>
                    )}
                    {task.recommendedProducts && task.recommendedProducts.length > 0 && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <span className="font-medium">Products:</span>
                        <span className="font-semibold text-slate-800">
                          {task.recommendedProducts.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredTasks.length === 0 && (
            <Card className="p-12 text-center text-slate-500 space-y-2">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">No tasks in this category.</p>
            </Card>
          )}
        </div>
      )}

      {/* Monthly Grid View */}
      {viewMode === 'month' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 font-serif text-base">
              August 2026 Agronomic Calendar
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Mustard & Groundnut Cycle
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-500 uppercase pb-2 border-b border-slate-100">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const dayStr = `2026-08-${day < 10 ? '0' + day : day}`;
              const dayTasks = tasks.filter((t) => t.dueDate === dayStr);

              return (
                <div
                  key={day}
                  className={`min-h-[70px] sm:min-h-[85px] p-1.5 rounded-xl border flex flex-col justify-between ${
                    dayTasks.length > 0
                      ? 'bg-emerald-50/80 border-emerald-200'
                      : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <span className="font-extrabold text-slate-700 text-[11px]">
                    {day}
                  </span>

                  <div className="space-y-1">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onToggleTask(t.id)}
                        className={`text-[9px] p-1 rounded font-bold truncate cursor-pointer ${
                          t.isCompleted
                            ? 'bg-emerald-200 text-emerald-900 line-through'
                            : 'bg-amber-400 text-amber-950'
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
