
import React, { useState, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Zap, Target, BarChart, ArrowRight, History, Search, Filter, Briefcase } from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';

interface WeeklyArchive {
  weekNumber: number;
  kpiRate: number;
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  topDept: string;
  bahrainTime: string;
  projectId?: string; // ربط الأسبوع بمشروع معين للفلترة
}

interface MonthlyArchive {
  id: string;
  monthName: string;
  monthValue: number; // 1-12
  year: number;
  avgKpi: number;
  totalTasks: number;
  weeks: WeeklyArchive[];
}

const ArchivePage: React.FC = () => {
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);
  
  // States for filters
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  // Mock data for archives
  const archives: MonthlyArchive[] = useMemo(() => [
    {
      id: '2024-05',
      monthName: 'مايو',
      monthValue: 5,
      year: 2024,
      avgKpi: 92,
      totalTasks: 145,
      weeks: [
        { weekNumber: 1, kpiRate: 88, completionRate: 90, totalTasks: 35, completedTasks: 32, topDept: 'قسم المعماري', bahrainTime: 'GMT+3 (08:30)', projectId: 'proj-1' },
        { weekNumber: 2, kpiRate: 94, completionRate: 95, totalTasks: 40, completedTasks: 38, topDept: 'قسم الإنشائي', bahrainTime: 'GMT+3 (09:15)', projectId: 'proj-1' },
        { weekNumber: 3, kpiRate: 91, completionRate: 88, totalTasks: 32, completedTasks: 28, topDept: 'قسم التصميم الداخلي', bahrainTime: 'GMT+3 (10:00)', projectId: 'proj-2' },
        { weekNumber: 4, kpiRate: 95, completionRate: 98, totalTasks: 38, completedTasks: 37, topDept: 'قسم التسويق', bahrainTime: 'GMT+3 (11:45)', projectId: 'proj-2' },
      ]
    },
    {
      id: '2024-04',
      monthName: 'أبريل',
      monthValue: 4,
      year: 2024,
      avgKpi: 87,
      totalTasks: 120,
      weeks: [
        { weekNumber: 1, kpiRate: 85, completionRate: 82, totalTasks: 30, completedTasks: 25, topDept: 'قسم المعماري', bahrainTime: 'GMT+3 (08:00)', projectId: 'proj-1' },
        { weekNumber: 2, kpiRate: 89, completionRate: 90, totalTasks: 30, completedTasks: 27, topDept: 'الموارد البشرية', bahrainTime: 'GMT+3 (09:30)', projectId: 'proj-3' },
        { weekNumber: 3, kpiRate: 84, completionRate: 85, totalTasks: 30, completedTasks: 26, topDept: 'المحاسبة', bahrainTime: 'GMT+3 (10:15)', projectId: 'proj-3' },
        { weekNumber: 4, kpiRate: 91, completionRate: 92, totalTasks: 30, completedTasks: 28, topDept: 'قسم الإنشائي', bahrainTime: 'GMT+3 (11:00)', projectId: 'proj-1' },
      ]
    }
  ], []);

  // Filtered logic
  const filteredArchives = useMemo(() => {
    return archives.filter(month => {
      const yearMatch = filterYear === 'all' || month.year.toString() === filterYear;
      const monthMatch = filterMonth === 'all' || month.monthValue.toString() === filterMonth;
      
      // إذا تم اختيار مشروع معين، نتحقق مما إذا كان الشهر يحتوي على بيانات لهذا المشروع في أي من أسابيعه
      const projectMatch = filterProject === 'all' || month.weeks.some(w => w.projectId === filterProject);
      
      return yearMatch && monthMatch && projectMatch;
    });
  }, [archives, filterYear, filterMonth, filterProject]);

  const selectedMonth = archives.find(m => m.id === selectedMonthId);
  
  // عرض الأسابيع المفلترة فقط إذا كان هناك مشروع مختار
  const visibleWeeks = useMemo(() => {
    if (!selectedMonth) return [];
    if (filterProject === 'all') return selectedMonth.weeks;
    return selectedMonth.weeks.filter(w => w.projectId === filterProject);
  }, [selectedMonth, filterProject]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <History className="text-blue-600" size={24} />
             <h2 className="text-3xl font-black text-slate-800 dark:text-white">الأرشيف الشهري</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">مراجعة سجلات الأداء التاريخية (توقيت البحرين المحلي)</p>
        </div>
        
        {selectedMonthId && (
          <button 
            onClick={() => setSelectedMonthId(null)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
          >
            <ChevronRight size={16} /> العودة للأرشيف الرئيسي
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <Filter size={18} />
          <span className="text-xs font-black uppercase tracking-widest">تصفية البحث</span>
        </div>

        {/* Year Filter */}
        <div className="relative flex-1 min-w-[120px]">
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="all">كل السنوات</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>

        {/* Month Filter */}
        <div className="relative flex-1 min-w-[120px]">
          <select 
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="all">كل الأشهر</option>
            <option value="1">يناير</option>
            <option value="2">فبراير</option>
            <option value="3">مارس</option>
            <option value="4">أبريل</option>
            <option value="5">مايو</option>
            <option value="6">يونيو</option>
            {/* ... بقية الأشهر */}
          </select>
        </div>

        {/* Project Filter */}
        <div className="relative flex-[2] min-w-[200px]">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Briefcase size={16} />
          </div>
          <select 
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pr-12 pl-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="all">كل المشاريع الهندسية</option>
            {MOCK_PROJECTS.map(proj => (
              <option key={proj.id} value={proj.id}>{proj.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main View */}
      {!selectedMonthId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArchives.map(month => (
            <div 
              key={month.id}
              onClick={() => setSelectedMonthId(month.id)}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                    <CalendarDays size={24} />
                  </div>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase tracking-widest">{month.year}</span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{month.monthName}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">إحصائيات الشهر الإجمالية</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">متوسط KPI</p>
                    <p className="text-lg font-black text-emerald-600">{month.avgKpi}%</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">المهام</p>
                    <p className="text-lg font-black text-blue-600">{month.totalTasks}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                  <span>استعراض الـ 4 أسابيع</span>
                  <ArrowRight size={16} className="group-hover:translate-x-[-4px] transition-transform" />
                </div>
              </div>
            </div>
          ))}
          
          {filteredArchives.length === 0 && (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] bg-white/50 dark:bg-slate-900/50">
               <Search size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
               <h4 className="text-lg font-bold text-slate-400">لا توجد سجلات تطابق فلاتر البحث الحالية</h4>
               <button 
                 onClick={() => { setFilterYear('all'); setFilterMonth('all'); setFilterProject('all'); }}
                 className="mt-4 text-blue-600 font-bold text-sm hover:underline"
               >
                 إعادة تعيين الفلاتر
               </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Monthly Detail Banner */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden mb-10">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
             <div className="relative z-10">
                <h3 className="text-3xl font-black mb-2">سجل إنجازات {selectedMonth?.monthName} {selectedMonth?.year}</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                   <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                      <Target size={16} />
                      <span className="text-xs font-bold">متوسط الإنجاز الشهري: {selectedMonth?.avgKpi}%</span>
                   </div>
                   <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                      <Clock size={16} />
                      <span className="text-xs font-bold">مرجع زمن: البحرين (AST)</span>
                   </div>
                   {filterProject !== 'all' && (
                     <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                        <Briefcase size={16} />
                        <span className="text-xs font-bold">مشروع: {MOCK_PROJECTS.find(p => p.id === filterProject)?.name}</span>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* Weekly Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleWeeks.map(week => {
              const weekProject = MOCK_PROJECTS.find(p => p.id === week.projectId);
              return (
                <div 
                  key={week.weekNumber}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 font-black">
                        {week.weekNumber}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white">الأسبوع {week.weekNumber}</h4>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Clock size={10} /> {week.bahrainTime}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md tracking-tighter">سجل أسبوعي</span>
                      {weekProject && (
                        <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">{weekProject.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold text-slate-400">
                           <span>معدل KPI الأسبوعي</span>
                           <span>{week.kpiRate}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500" style={{ width: `${week.kpiRate}%` }}></div>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold text-slate-400">
                           <span>نسبة الإنجاز</span>
                           <span>{week.completionRate}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600" style={{ width: `${week.completionRate}%` }}></div>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div>
                         <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">القسم الأكثر نشاطاً</p>
                         <p className="text-xs font-black text-slate-800 dark:text-white">{week.topDept}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">المهام المكتملة</p>
                         <p className="text-xs font-black text-emerald-600">{week.completedTasks} / {week.totalTasks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {visibleWeeks.length === 0 && (
              <div className="col-span-full py-16 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-400">لا توجد بيانات لهذا المشروع في هذا الشهر المحدد</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
