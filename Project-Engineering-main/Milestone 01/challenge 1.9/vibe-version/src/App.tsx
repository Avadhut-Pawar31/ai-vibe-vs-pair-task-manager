import { useState, useMemo, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Check,
  Calendar,
  Layers,
  Circle
} from 'lucide-react';
import { Task, FilterStatus } from './types';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    const remaining = tasks.filter((t) => !t.completed).length;
    return { total, completed, progress, remaining };
  }, [tasks]);

  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-12 font-sans transition-colors duration-500">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Section */}
        <header className="bg-indigo-700 p-8 text-white relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-end relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-5 h-5 text-indigo-300" />
                <h1 className="text-3xl font-bold tracking-tight">Daily Focus</h1>
              </div>
              <p className="text-indigo-100 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 opacity-70" />
                {formattedDate}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">{stats.progress}%</div>
              <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold">Daily Progress</p>
            </div>
          </div>

          <div className="w-full bg-indigo-900/30 h-1.5 mt-6 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 1, ease: "circOut" }}
              className="bg-white h-full shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            />
          </div>
        </header>

        {/* Input Control */}
        <section className="p-6 border-b border-slate-100 bg-white">
          <form onSubmit={addTask} className="flex gap-3">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
                <Plus className="h-5 w-5 text-slate-400 group-focus-within:text-inherit" />
              </div>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400 outline-none" 
                placeholder="Add a new objective..."
              />
            </div>
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 whitespace-nowrap"
            >
              Add Task
            </button>
          </form>
        </section>

        {/* Filter Bar */}
        <nav className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-1">
            {(['all', 'active', 'completed'] as FilterStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                  filter === s 
                    ? "bg-indigo-100 text-indigo-700 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
            {stats.remaining} Tasks Remaining
          </span>
        </nav>

        {/* Task List */}
        <main className="flex-grow overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <ul className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <motion.li 
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`group flex items-center px-8 py-4 transition-colors ${
                      task.completed ? 'bg-slate-50/30' : 'hover:bg-slate-50/80 cursor-default'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-slate-300 hover:border-indigo-500'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3px]" />}
                    </button>
                    
                    <span className={`ml-4 font-medium transition-all text-sm ${
                      task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}>
                      {task.title}
                    </span>

                    <div className="ml-auto flex items-center gap-2">
                      <AnimatePresence>
                        {task.completed && (
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded uppercase tracking-wider border border-emerald-100"
                          >
                            Done
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.li>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-slate-400"
                >
                  <div className="p-4 bg-slate-50 rounded-full mb-3 shrink-0">
                    <Plus className="w-6 h-6 rotate-45 opacity-20" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">No Objectives Found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </ul>
        </main>

        {/* Footer / Status */}
        <footer className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <div>Version 1.0.4 Stable</div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
              Cloud Sync Ready
            </span>
            {tasks.some(t => t.completed) && (
              <button 
                onClick={clearCompleted}
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Clear Completed
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
