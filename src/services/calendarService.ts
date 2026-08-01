import { CalendarTask } from '../types';
import { initialCalendarTasks } from '../data/mockCalendar';
import { getCurrentUserEmail } from './farmerService';

export const calendarService = {
  getTasks: async (userEmail?: string): Promise<CalendarTask[]> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const key = `tilahan_saathi_calendar_tasks_${email}`;
    const data = localStorage.getItem(key);

    if (data) {
      try {
        return JSON.parse(data);
      } catch (_e) {
        // Fallback
      }
    }

    if (email === 'farmer@tilahansaathi.in' || email === 'ramesh@gmail.com') {
      localStorage.setItem(key, JSON.stringify(initialCalendarTasks));
      return initialCalendarTasks;
    }

    // New registered account starts with 0 / clean tasks list
    const emptyTasks: CalendarTask[] = [];
    localStorage.setItem(key, JSON.stringify(emptyTasks));
    return emptyTasks;
  },

  toggleTaskCompletion: async (taskId: string, userEmail?: string): Promise<CalendarTask> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const tasks = await calendarService.getTasks(email);
    let updatedTask: CalendarTask | null = null;
    const updatedList = tasks.map((t) => {
      if (t.id === taskId) {
        updatedTask = { ...t, isCompleted: !t.isCompleted };
        return updatedTask;
      }
      return t;
    });

    if (!updatedTask) throw new Error('Task not found');
    const key = `tilahan_saathi_calendar_tasks_${email}`;
    localStorage.setItem(key, JSON.stringify(updatedList));
    return updatedTask;
  },

  addTask: async (task: Omit<CalendarTask, 'id'>, userEmail?: string): Promise<CalendarTask> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const tasks = await calendarService.getTasks(email);
    const created: CalendarTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    const updated = [created, ...tasks];
    const key = `tilahan_saathi_calendar_tasks_${email}`;
    localStorage.setItem(key, JSON.stringify(updated));
    return created;
  },

  deleteTask: async (taskId: string, userEmail?: string): Promise<boolean> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const tasks = await calendarService.getTasks(email);
    const filtered = tasks.filter((t) => t.id !== taskId);
    const key = `tilahan_saathi_calendar_tasks_${email}`;
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  },
};
