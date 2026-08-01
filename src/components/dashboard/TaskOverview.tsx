import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { CalendarTask } from '../../types';
import { calendarService } from '../../services/calendarService';
import { CalendarDays, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

export const TaskOverview: React.FC = () => {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const { addToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    calendarService.getTasks().then(setTasks);
  }, []);

  const handleToggle = async (id: string, currentTitle: string, isCompletedNow: boolean) => {
    await calendarService.toggleTaskCompletion(id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
    addToast({
      type: isCompletedNow ? 'info' : 'success',
      title: isCompletedNow ? 'Task Marked Uncompleted' : 'Task Completed!',
      message: `${currentTitle}`,
    });
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
            <CalendarDays className="w-5 h-5 text-[#2E7D32]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base font-serif">
              Upcoming Field Calendar Tasks
            </h3>
            <p className="text-xs text-slate-500">
              Agronomic schedule for optimum oilseed growth
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/crop-calendar')}
          className="text-xs font-semibold text-[#2E7D32] hover:underline flex items-center gap-1"
        >
          <span>Full Calendar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {tasks.slice(0, 4).map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
              task.isCompleted
                ? 'bg-slate-50 border-slate-200/80 opacity-60'
                : 'bg-emerald-50/40 border-emerald-900/10 hover:border-emerald-300 shadow-2xs'
            }`}
          >
            <button
              onClick={() => handleToggle(task.id, task.title, task.isCompleted)}
              className="mt-0.5 text-[#2E7D32] hover:scale-110 transition-transform"
              aria-label="Toggle task"
            >
              {task.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 hover:text-[#2E7D32]" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-bold truncate ${
                    task.isCompleted
                      ? 'line-through text-slate-500'
                      : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 shrink-0">
                  {task.dueDate}
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">
                {task.cropName} • {task.category}
              </p>
              {task.quantityPerAcre && (
                <p className="text-[11px] font-semibold text-emerald-800 mt-1">
                  Dosage: {task.quantityPerAcre}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
