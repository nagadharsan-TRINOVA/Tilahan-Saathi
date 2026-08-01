import React, { useEffect, useState } from 'react';
import { CalendarTask } from '../types';
import { calendarService } from '../services/calendarService';
import { CropCalendarView } from '../components/calendar/CropCalendarView';
import { AddTaskModal } from '../components/calendar/AddTaskModal';
import { useApp } from '../contexts/AppContext';

export const CropCalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useApp();

  const loadTasks = async () => {
    const list = await calendarService.getTasks();
    setTasks(list);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggle = async (taskId: string) => {
    await calendarService.toggleTaskCompletion(taskId);
    await loadTasks();
  };

  const handleSaveTask = async (task: Omit<CalendarTask, 'id'>) => {
    setIsSaving(true);
    try {
      await calendarService.addTask(task);
      addToast({
        type: 'success',
        title: 'Task Created',
        message: `${task.title} scheduled for ${task.dueDate}`,
      });
      await loadTasks();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not create task.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await calendarService.deleteTask(taskId);
    addToast({
      type: 'info',
      title: 'Task Removed',
      message: 'Task deleted from schedule.',
    });
    await loadTasks();
  };

  return (
    <div className="space-y-6">
      <CropCalendarView
        tasks={tasks}
        onToggleTask={handleToggle}
        onAddTask={() => setIsAddOpen(true)}
        onDeleteTask={handleDeleteTask}
      />

      <AddTaskModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleSaveTask}
        isLoading={isSaving}
      />
    </div>
  );
};
