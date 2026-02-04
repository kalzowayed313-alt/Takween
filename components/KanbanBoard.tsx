
import React, { useState, useMemo } from 'react';
import { 
  Paperclip, MessageSquare, AlertCircle, Filter, FileCode, 
  Calendar, ChevronRight, Zap, MoreHorizontal, Plus, Eye
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { TaskStatus, TaskPriority, Task, Employee, Role } from '../types';
import { DEPARTMENTS } from '../constants';
import { notificationService } from '../services/notificationService';

interface KanbanBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskClick: (task: Task) => void;
  currentUser: Employee;
  employees: Employee[];
}

const STATUS_LABELS: Record<TaskStatus, { color: string, label: string, borderColor: string, iconColor: string }> = {
  [TaskStatus.NEW]: { color: 'bg-slate-500', label: 'جديد', borderColor: 'border-slate-200', iconColor: 'text-slate-500' },
  [TaskStatus.IN_PROGRESS]: { color: 'bg-blue-600', label: 'قيد التنفيذ', borderColor: 'border-blue-200', iconColor: 'text-blue-600' },
  [TaskStatus.REVIEW]: { color: 'bg-purple-600', label: 'قيد المراجعة', borderColor: 'border-purple-200', iconColor: 'text-purple-600' },
  [TaskStatus.PENDING]: { color: 'bg-amber-600', label: 'معلق', borderColor: 'border-amber-200', iconColor: 'text-amber-600' },
  [TaskStatus.COMPLETED]: { color: 'bg-emerald-600', label: 'مكتمل', borderColor: 'border-emerald-200', iconColor: 'text-emerald-600' }
};

const PRIORITY_THEMES: Record<TaskPriority, { bg: string, text: string, dot: string, glow: string }> = {
  [TaskPriority.HIGH]: { 
    bg: 'bg-rose-50 dark:bg-rose-950/40', 
    text: 'text-rose-600 dark:text-rose-400', 
    dot: 'bg-rose-500 animate-pulse',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)] border-rose-100 dark:border-rose-900/30'
  },
  [TaskPriority.MEDIUM]: { 
    bg: 'bg-amber-50 dark:bg-amber-950/40', 
    text: 'text-amber-600 dark:text-amber-400', 
    dot: 'bg-amber-500',
    glow: 'border-amber-100 dark:border-amber-900/30'
  },
  [TaskPriority.LOW]: { 
    bg: 'bg-emerald-50 dark:bg-emerald-950/40', 
    text: 'text-emerald-600 dark:text-emerald-400', 
    dot: 'bg-emerald-500',
    glow: 'border-emerald-100 dark:border-emerald-900/30'
  }
};

const TaskCard: React.FC<{ task: Task, employees: Employee[], index: number, onClick: () => void }> = ({ task, employees, index, onClick }) => {
  const assignee = employees.find(e => e.id === task.assignedTo);
  const dept = DEPARTMENTS.find(d => d.id === task.departmentId);
  const priorityTheme = PRIORITY_THEMES[task.priority];
  const hasBlueprint = task.attachments?.some(a => ['autocad', '3dmax', 'blueprint'].includes(a.type.toLowerCase()));
  const commentCount = task.comments?.length || 0;
  const attachmentCount = task.attachments?.length || 0;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white dark:bg-slate-900 p-5 rounded-[2rem] border-2 transition-all duration-300 mb-4 group relative overflow-hidden cursor-grab active:cursor-grabbing ${
            snapshot.isDragging 
              ? 'shadow-2xl ring-8 ring-blue-500/10 scale-[1.05] rotate-1 z-50 border-blue-500' 
              : `border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 hover:border-blue-200 dark:hover:border-blue-900/50`
          }`}
        >
          {/* Vertical Department Indicator */}
          <div 
            className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all duration-500 group-hover:w-1.5" 
            style={{ backgroundColor: dept?.color || '#cbd5e1' }}
          ></div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${priorityTheme.bg} ${priorityTheme.text} ${priorityTheme.glow}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${priorityTheme.dot}`}></div>
                <span className="text-[10px] font-black uppercase tracking-wider leading-none">{task.priority}</span>
              </div>
              {hasBlueprint && (
                <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 shadow-sm">
                  <FileCode size={12} />
                  <span className="text-[9px] font-black uppercase tracking-tighter">Blueprint</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
               <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <Eye size={14} />
               </div>
            </div>
          </div>
          
          <h4 className="font-extrabold text-slate-800 dark:text-white text-sm mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 px-1">
            {task.title}
          </h4>
          
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-5 leading-relaxed font-medium px-1">
            {task.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
               <div className="relative group/avatar">
                  <img 
                    src={assignee?.avatar} 
                    alt="" 
                    className="w-8 h-8 rounded-xl border-2 border-white dark:border-slate-800 object-cover shadow-sm transition-transform group-hover/avatar:scale-110" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{assignee?.name.split(' ').slice(0, 2).join(' ')}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{dept?.name.replace('قسم ', '')}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 transition-all ${commentCount > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-700'}`}>
                 <MessageSquare size={14} fill={commentCount > 0 ? 'currentColor' : 'none'} className={commentCount > 0 ? 'fill-opacity-10' : ''} />
                 <span className="text-[10px] font-black tabular-nums">{commentCount}</span>
              </div>
              <div className={`flex items-center gap-1 transition-all ${attachmentCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-700'}`}>
                 <Paperclip size={14} className={attachmentCount > 0 ? 'rotate-12' : ''} />
                 <span className="text-[10px] font-black tabular-nums">{attachmentCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <Calendar size={12} className="text-blue-500" />
                <span className="tabular-nums tracking-tight">{task.dueDate}</span>
             </div>
             <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm transition-transform group-hover:scale-105">
                <Zap size={12} fill="currentColor" className="animate-pulse" />
                <span>{task.kpiPoints} PTS</span>
             </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, setTasks, onTaskClick, currentUser, employees }) => {
  const [viewMode, setViewMode] = useState<'DEPARTMENT' | 'PERSONAL'>('DEPARTMENT');
  const isGeneralAdmin = currentUser.role === Role.ADMIN;

  const filteredTasks = useMemo(() => {
    let pool = isGeneralAdmin ? tasks : tasks.filter(t => t.departmentId === currentUser.departmentId);
    if (viewMode === 'PERSONAL') pool = pool.filter(t => t.assignedTo === currentUser.id);
    return pool;
  }, [tasks, viewMode, currentUser, isGeneralAdmin]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskToUpdate = tasks.find(t => t.id === draggableId);
    
    const updatedTasks = tasks.map(task => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId as TaskStatus };
      }
      return task;
    });

    setTasks(updatedTasks);

    if (taskToUpdate) {
      notificationService.broadcast('TASK_STATUS_UPDATED', {
        taskId: draggableId,
        taskTitle: taskToUpdate.title,
        newStatus: destination.droppableId,
        updatedBy: currentUser.name
      });
    }
  };

  return (
    <div className="h-full flex flex-col space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-4">
             <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] text-white shadow-2xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform">
               <Zap size={26} fill="currentColor" />
             </div>
             لوحة المسار الهندسي
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mr-2">
            {isGeneralAdmin 
              ? (viewMode === 'DEPARTMENT' ? 'نظرة شاملة على نبض إنجازات الشركة' : 'متابعة جدول أعمالك الشخصي')
              : (viewMode === 'DEPARTMENT' ? `متابعة إنجازات فريق ${DEPARTMENTS.find(d => d.id === currentUser.departmentId)?.name}` : 'متابعة جدول أعمالك الشخصي')
            }
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-xl ring-1 ring-slate-100 dark:ring-slate-800">
            <button 
              onClick={() => setViewMode('DEPARTMENT')}
              className={`px-8 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 ${viewMode === 'DEPARTMENT' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
            >
              {isGeneralAdmin ? 'الشركة' : 'القسم'}
            </button>
            <button 
              onClick={() => setViewMode('PERSONAL')}
              className={`px-8 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 ${viewMode === 'PERSONAL' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
            >
              مهامي
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-black text-xs shadow-lg transition-all active:scale-95 group">
            <Filter size={18} className="group-hover:rotate-180 transition-transform duration-500" /> تصفية النتائج
          </button>
        </div>
      </div>

      {/* Board Container */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-10 overflow-x-auto pb-12 custom-scrollbar min-h-[750px] items-start px-2 scroll-smooth">
          {Object.values(TaskStatus).map((status) => (
            <div key={status} className="flex-shrink-0 w-[350px] flex flex-col group/col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-8 px-6">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${STATUS_LABELS[status].color} shadow-lg shadow-current/20 ring-4 ring-current/10 animate-pulse`}></div>
                  <h3 className="text-base font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    {STATUS_LABELS[status].label}
                  </h3>
                  <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-black text-slate-500 tabular-nums">
                      {filteredTasks.filter(t => t.status === status).length}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all opacity-0 group-hover/col:opacity-100">
                  <Plus size={20} />
                </button>
              </div>

              {/* Droppable Column Body */}
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-4 max-h-[850px] overflow-y-auto custom-scrollbar px-4 py-4 min-h-[550px] transition-all duration-500 rounded-[3rem] border-2 border-dashed ${
                      snapshot.isDraggingOver 
                        ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-400/50 shadow-2xl scale-[1.01]' 
                        : 'bg-slate-50/40 dark:bg-slate-900/30 border-transparent'
                    }`}
                  >
                    {filteredTasks
                      .filter(t => t.status === status)
                      .map((task, index) => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          employees={employees} 
                          index={index}
                          onClick={() => onTaskClick(task)} 
                        />
                    ))}
                    {provided.placeholder}

                    {/* Empty State Illustration for Column */}
                    {filteredTasks.filter(t => t.status === status).length === 0 && !snapshot.isDraggingOver && (
                      <div className="py-32 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white/40 dark:bg-slate-950/20 flex flex-col items-center gap-4 transition-opacity hover:opacity-100 opacity-60">
                        <div className={`p-5 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl ${STATUS_LABELS[status].iconColor}`}>
                           <AlertCircle size={40} />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 italic leading-relaxed">
                          المسار شاغر حالياً<br/>في هذا القسم
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
