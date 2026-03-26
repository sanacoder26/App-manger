/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  Trash2, 
  Edit2, 
  Plus, 
  Search, 
  LogOut, 
  Calendar as CalendarIcon, 
  AlertCircle,
  Clock,
  User,
  Monitor,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Icons ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// --- Types ---
type Priority = 'High' | 'Medium' | 'Low';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  createdAt: number;
  completed: boolean;
}

type FilterType = 'All' | 'High' | 'Medium' | 'Low';

// --- Mock Auth ---
const MOCK_USER_KEY = 'taskmaster_mock_user';
const TASKS_STORAGE_KEY = 'taskmaster_tasks';

export default function App() {
  const [user, setUser] = useState<{ email: string, name: string } | null>(() => {
    const stored = localStorage.getItem(MOCK_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  if (!user) {
    return <AuthScreen onLogin={(email, name) => {
      const newUser = { email, name };
      setUser(newUser);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
    }} />;
  }

  return (
    <TaskManager 
      user={user} 
      onLogout={() => {
        setUser(null);
        localStorage.removeItem(MOCK_USER_KEY);
      }} 
    />
  );
}

// --- Auth Screen Component ---
function AuthScreen({ onLogin }: { onLogin: (email: string, name: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    onLogin(email, isLogin ? email.split('@')[0] : name);
  };

  const handleSocialLogin = (provider: string) => {
    onLogin(`${provider.toLowerCase()}@example.com`, `${provider} User`);
  };

  return (
    <div className="min-h-screen bg-[#E0F7FA] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl shadow-cyan-900/10 overflow-hidden"
      >
        {/* Illustration Header */}
        <div className="bg-gradient-to-b from-[#40e0d0] to-[#48c6ef] h-64 rounded-b-[40px] relative flex flex-col items-center justify-center p-6 text-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-8 left-8 w-8 h-6 bg-white/20 rounded-md backdrop-blur-sm flex items-center justify-center">
            <div className="w-4 h-0.5 bg-white/80 rounded-full"></div>
          </div>
          <div className="absolute top-12 right-10 w-10 h-8 bg-white/20 rounded-md backdrop-blur-sm flex flex-col items-center justify-center gap-1">
            <div className="w-6 h-0.5 bg-white/80 rounded-full"></div>
            <div className="w-4 h-0.5 bg-white/80 rounded-full"></div>
          </div>
          <div className="absolute top-6 right-6 text-white/40">
            <Monitor size={24} />
          </div>
          
          {/* Main Character Illustration */}
          <div className="relative z-10 mt-8">
            <div className="w-24 h-24 bg-[#FF8A65] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <User size={48} className="text-white" />
            </div>
            {/* Laptop shape */}
            <div className="absolute -bottom-6 -left-4 w-32 h-16 bg-white rounded-t-xl shadow-inner flex items-center justify-center">
               <div className="w-4 h-4 rounded-full bg-[#40e0d0]"></div>
            </div>
          </div>
        </div>
        
        <div className="px-8 pt-10 pb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
            Manage your<br />daily task
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Organize your workflow and boost your productivity.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-2xl text-sm flex items-center justify-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-3.5 rounded-full border border-slate-100 bg-slate-50 text-center text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#40e0d0] focus:border-transparent outline-none transition-all"
                placeholder="Full Name"
              />
            )}
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-3.5 rounded-full border border-slate-100 bg-slate-50 text-center text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#40e0d0] focus:border-transparent outline-none transition-all"
              placeholder="username@email.com"
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-3.5 rounded-full border border-slate-100 bg-slate-50 text-center text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#40e0d0] focus:border-transparent outline-none transition-all"
              placeholder="password"
            />
            <button 
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#40e0d0] to-[#48c6ef] hover:opacity-90 text-white rounded-full font-semibold shadow-lg shadow-cyan-200 transition-all transform active:scale-[0.98]"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-xs text-slate-400 font-medium uppercase">Or continue with</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button 
              onClick={() => handleSocialLogin('Google')}
              type="button"
              className="w-full py-3 px-4 border border-slate-200 rounded-full flex justify-center items-center gap-3 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
            >
              <GoogleIcon /> Connect with Google
            </button>
            <button 
              onClick={() => handleSocialLogin('GitHub')}
              type="button"
              className="w-full py-3 px-4 border border-slate-200 rounded-full flex justify-center items-center gap-3 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
            >
              <GitHubIcon /> Connect with GitHub
            </button>
          </div>
          
          <div className="mt-8 text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-[#40e0d0] font-semibold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Task Manager Component ---
function TaskManager({ user, onLogout }: { user: { email: string, name: string }, onLogout: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Filters & Sorting
  const [filter, setFilter] = useState<FilterType>('All');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load tasks from local storage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Failed to parse tasks", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // Handlers
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    } else {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        completed: false
      };
      setTasks([newTask, ...tasks]);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Generate Calendar Days (5 days around selected date)
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  // Derived State
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by category
    if (filter !== 'All') {
      result = result.filter(t => t.priority === filter);
    }

    // Sort by newest
    result.sort((a, b) => b.createdAt - a.createdAt);

    return result;
  }, [tasks, filter]);

  // Format current date display
  const formattedDate = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    year: 'numeric' 
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E0F7FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40e0d0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F7FA] text-slate-800 font-sans pb-24">
      <div className="max-w-md mx-auto bg-[#E0F7FA] min-h-screen relative shadow-2xl sm:rounded-[40px] sm:my-8 overflow-hidden border-x border-white/40">
        
        {/* Header */}
        <div className="px-8 pt-12 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-medium text-slate-600">hi,</h2>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">{user.name}</h1>
          </div>
          <button 
            onClick={onLogout}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#40e0d0] to-[#48c6ef] flex items-center justify-center text-white shadow-lg shadow-cyan-200 hover:opacity-90 transition-opacity"
            title="Logout"
          >
            <LogOut size={20} className="ml-1" />
          </button>
        </div>

        {/* Date & Calendar */}
        <div className="px-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-slate-500 font-medium">{formattedDate.split(',')[0]},</p>
              <p className="text-slate-800 font-semibold">{formattedDate.split(',')[1]}</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#40e0d0]">
              <CalendarIcon size={20} />
            </div>
          </div>

          <div className="flex justify-between items-center gap-2">
            {calendarDays.map((date, i) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center w-14 h-20 rounded-2xl transition-all ${
                    isSelected 
                      ? 'bg-gradient-to-b from-[#40e0d0] to-[#48c6ef] text-white shadow-lg shadow-cyan-200 scale-110 z-10' 
                      : 'bg-white text-slate-600 shadow-sm hover:bg-cyan-50'
                  }`}
                >
                  <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-cyan-50' : 'text-slate-400'}`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="px-8 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Categories</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {(['All', 'High', 'Medium', 'Low'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === f 
                    ? 'bg-[#40e0d0] text-white shadow-md shadow-cyan-200' 
                    : 'bg-white text-slate-400 hover:bg-cyan-50'
                }`}
              >
                {f === 'All' ? 'All Tasks' : `${f} Priority`}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="px-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Daily Watch</h3>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={() => handleToggleComplete(task.id)}
                    onEdit={() => openEditForm(task)}
                    onDelete={() => handleDelete(task.id)}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10 bg-white/50 rounded-3xl border border-white"
                >
                  <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Check size={24} className="text-[#40e0d0]" />
                  </div>
                  <p className="text-slate-500 font-medium">No tasks found.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => { setEditingTask(null); setIsFormOpen(true); }}
          className="absolute bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#40e0d0] to-[#48c6ef] rounded-full shadow-xl shadow-cyan-300 flex items-center justify-center text-white hover:scale-105 transition-transform z-20"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <TaskFormModal 
            task={editingTask} 
            onClose={() => setIsFormOpen(false)} 
            onSave={handleSaveTask} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Task Item Component ---
function TaskItem({ task, onToggle, onEdit, onDelete }: { task: Task, onToggle: () => void, onEdit: () => void, onDelete: () => void }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white p-5 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between gap-4 transition-all hover:shadow-md"
    >
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold text-base truncate transition-colors ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
          {task.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={12} />
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            task.priority === 'High' ? 'bg-red-50 text-red-500' :
            task.priority === 'Medium' ? 'bg-amber-50 text-amber-500' :
            'bg-emerald-50 text-emerald-500'
          }`}>
            {task.priority}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          <button onClick={onEdit} className="p-1.5 text-slate-300 hover:text-[#40e0d0] transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-300 hover:text-red-400 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
        
        <button 
          onClick={onToggle}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-[#40e0d0] text-white shadow-md shadow-cyan-200' 
              : 'bg-cyan-50 border-2 border-[#40e0d0] text-transparent hover:bg-cyan-100'
          }`}
        >
          <Check size={16} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
}

// --- Task Form Modal Component ---
function TaskFormModal({ task, onClose, onSave }: { task: Task | null, onClose: () => void, onSave: (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-8 py-6 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="px-8 pb-8 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-2xl text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          <form id="task-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Task Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-[#40e0d0] focus:border-transparent outline-none transition-all"
                placeholder="What needs to be done?"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-[#40e0d0] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Add some details..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-[#40e0d0] focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-[#40e0d0] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </form>
        </div>
        
        <div className="px-8 py-6 bg-slate-50 mt-auto shrink-0">
          <button 
            type="submit"
            form="task-form"
            className="w-full py-4 bg-gradient-to-r from-[#40e0d0] to-[#48c6ef] hover:opacity-90 text-white rounded-full font-bold text-lg shadow-lg shadow-cyan-200 transition-all transform active:scale-[0.98]"
          >
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
