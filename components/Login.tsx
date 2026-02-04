
import React, { useState, useEffect, useRef } from 'react';
import { LogIn, UserPlus, Clock, Mail, ShieldCheck, ArrowRight, KeyRound, CheckCircle2, AlertCircle, Sparkles, Inbox, BellRing, Lock, Shield, Info, Copy, Check } from 'lucide-react';
import { Employee, Role } from '../types';

interface LoginProps {
  onLogin: (user: Employee) => void;
  employees: Employee[];
  onRegister: (name: string, email: string) => Employee;
}

type LoginStep = 'EMAIL' | 'OTP' | 'ADMIN_PASS' | 'REGISTER' | 'PENDING';

const Login: React.FC<LoginProps> = ({ onLogin, employees, onRegister }) => {
  const [step, setStep] = useState<LoginStep>('EMAIL');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVirtualEmail, setShowVirtualEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const ADMIN_EMAIL = 'alzowayed.job@gmail.com';
  const ADMIN_PASSWORD = 'Takween@2026';

  const generateAndSendOtp = () => {
    setIsLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    setTimeout(() => {
      setGeneratedOtp(code);
      if (email.toLowerCase() !== ADMIN_EMAIL) {
        setShowVirtualEmail(true);
        setStep('OTP');
      } else {
        setStep('ADMIN_PASS');
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    generateAndSendOtp();
  };

  const handleAdminPassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      const admin = employees.find(emp => emp.email.toLowerCase() === ADMIN_EMAIL);
      if (admin) onLogin(admin);
    } else {
      setError('كلمة المرور الإدارية غير صحيحة.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === generatedOtp) {
      const user = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
      if (user) {
        if (user.status === 'PENDING') {
          setStep('PENDING');
        } else {
          onLogin(user);
        }
      } else {
        setStep('REGISTER');
      }
      setShowVirtualEmail(false);
    } else {
      setError('كود التحقق غير صحيح.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (step === 'OTP' && otp.every(digit => digit !== '')) {
      verifyOtp();
    }
  }, [otp]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>

      {/* Virtual Mailbox Simulation */}
      {showVirtualEmail && email.toLowerCase() !== ADMIN_EMAIL && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4 animate-in slide-in-from-top duration-500">
          <div className="bg-slate-900 border-2 border-blue-500/50 text-white p-6 rounded-[2.5rem] shadow-2xl flex items-start gap-4 backdrop-blur-2xl">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shrink-0">
              <Inbox size={28} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">بريد وارد جديد</p>
              <p className="text-sm font-black mb-1">Takween System • كود الدخول</p>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center justify-center gap-4 mt-2">
                 <span className="text-2xl font-black text-white tracking-[0.3em]">{generatedOtp}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Left: Partner Access Information (The "Guide" for partners) */}
        <div className="hidden lg:flex flex-col max-w-sm space-y-6">
           <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2.5 bg-blue-600 rounded-2xl text-white"><Info size={20} /></div>
                 <h3 className="text-lg font-black text-white">دليل دخول الشركاء</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">مرحباً بك في النسخة التجريبية لنظام تكوين. لتجربة الصلاحيات الكاملة (المدير العام)، يرجى استخدام البيانات التالية:</p>
              
              <div className="space-y-4">
                 <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 group-hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-black text-slate-500 uppercase">بريد المدير العام</span>
                       <button onClick={() => copyToClipboard(ADMIN_EMAIL)} className="text-blue-400 hover:text-white transition-colors">{copied ? <Check size={12}/> : <Copy size={12}/>}</button>
                    </div>
                    <p className="text-xs font-bold text-white tabular-nums">{ADMIN_EMAIL}</p>
                 </div>
                 <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 group-hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-black text-slate-500 uppercase">كلمة المرور السرية</span>
                       <button onClick={() => copyToClipboard(ADMIN_PASSWORD)} className="text-blue-400 hover:text-white transition-colors">{copied ? <Check size={12}/> : <Copy size={12}/>}</button>
                    </div>
                    <p className="text-xs font-bold text-white tabular-nums">{ADMIN_PASSWORD}</p>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                 <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">صلاحية وصول كاملة</span>
                 </div>
                 <p className="text-[9px] text-slate-500 mt-2 italic">ملاحظة: الموظفون العاديون يحصلون على كود OTP عبر "البريد الافتراضي" الظاهر أعلى الشاشة.</p>
              </div>
           </div>

           <div className="flex items-center gap-4 px-6">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-blue-500"><Sparkles size={20} /></div>
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">تم تصميم هذا النظام لشركة تكوين الهندسية لعام 2026</p>
           </div>
        </div>

        {/* Right: Login Card */}
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center gap-2 mb-10 lg:hidden">
            <div className="p-4 bg-white rounded-3xl">
              <svg width="40" height="40" viewBox="0 0 100 120" fill="none">
                <path d="M50 5L20 35V115H35V75H45V115H65V100H80V115H95V55L80 40V30L50 5Z" fill="#2563eb" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white">تـكـويـن الهندسية</h1>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/10 p-3 ring-8 ring-white/5">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[3rem]">
              
              {step === 'EMAIL' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">الدخول المركزي</h2>
                    <p className="text-xs text-slate-500 mt-1">أدخل بريدك الإلكتروني للتحقق</p>
                  </div>
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase mr-2 tracking-widest">البريد الإلكتروني المهني</label>
                      <div className="relative">
                        <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          type="email" 
                          placeholder="alzowayed.job@gmail.com" 
                          className="w-full pr-14 pl-6 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[1.8rem] font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all dark:text-white"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <button 
                      disabled={isLoading}
                      type="submit" 
                      className="w-full bg-blue-600 text-white py-5 rounded-[1.8rem] font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      {isLoading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <><LogIn size={20} /> متابعة الدخول</>}
                    </button>
                  </form>
                </div>
              )}

              {step === 'ADMIN_PASS' && (
                <div className="space-y-8 animate-in zoom-in duration-500">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-amber-100 shadow-inner">
                      <Shield size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">هوية المدير العام</h2>
                    <p className="text-xs text-slate-500 mt-1">مرحباً بك يا مدير، يرجى تأكيد هويتك</p>
                  </div>
                  <form onSubmit={handleAdminPassSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase mr-2 tracking-widest">كلمة المرور السرية</label>
                      <div className="relative">
                        <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          className="w-full pr-14 pl-6 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[1.8rem] font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all dark:text-white"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required 
                          autoFocus
                        />
                      </div>
                    </div>
                    {error && <p className="text-[10px] text-rose-500 font-bold text-center">{error}</p>}
                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                      <ShieldCheck size={20} /> تأكيد الهوية والدخول
                    </button>
                  </form>
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 lg:hidden">
                     <p className="text-[9px] text-amber-700 font-bold leading-relaxed text-center italic">كلمة المرور للمدير العام هي: <span className="font-black underline">Takween@2026</span></p>
                  </div>
                </div>
              )}

              {step === 'OTP' && (
                <div className="space-y-8 animate-in slide-in-from-left duration-500">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 shadow-inner">
                      <BellRing size={40} className="animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">تحقق من الكود</h2>
                    <p className="text-xs text-slate-500 mt-1">أدخل الرمز الظاهر في الإشعار العلوي</p>
                  </div>
                  
                  <div className="flex gap-2 justify-center" dir="ltr">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => otpRefs.current[idx] = el}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        className="w-12 h-16 text-center text-2xl font-black bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-blue-600 outline-none transition-all dark:text-white"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* REGISTER and PENDING logic preserved... */}
              {step === 'REGISTER' && (
                <div className="space-y-8 animate-in zoom-in duration-500">
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">إكمال ملف الانضمام</h2>
                    <p className="text-xs text-slate-500 mt-1">البريد محقق. أدخل اسمك لتقديم الطلب</p>
                  </div>
                  <form onSubmit={e => { e.preventDefault(); onRegister(name, email); setStep('PENDING'); }} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase mr-2 tracking-widest">الاسم الكامل</label>
                      <input 
                        type="text" 
                        placeholder="م. أحمد محمد" 
                        className="w-full px-6 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[1.8rem] font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all dark:text-white"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required 
                      />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                      <UserPlus size={20} /> إرسال طلب الانضمام
                    </button>
                  </form>
                </div>
              )}

              {step === 'PENDING' && (
                <div className="text-center space-y-8 animate-in zoom-in duration-500 py-10">
                  <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto border-4 border-amber-100 relative shadow-inner">
                     <Clock size={48} className="text-amber-500 animate-spin-slow" />
                     <div className="absolute -top-1 -right-1 bg-white p-2 rounded-full shadow-lg border border-amber-50">
                        <Sparkles size={20} className="text-amber-400" />
                     </div>
                  </div>
                  <div className="space-y-3 px-4">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">طلبك قيد المراجعة</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">يرجى الانتظار حتى يقوم المدير العام بالموافقة على حسابك.</p>
                  </div>
                  <button onClick={() => setStep('EMAIL')} className="text-xs font-black text-slate-400 hover:text-blue-600 underline underline-offset-4">العودة لشاشة الدخول</button>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="mt-20 flex flex-col items-center gap-6 opacity-40">
        <div className="flex items-center gap-8">
           <svg width="30" height="30" viewBox="0 0 100 120" fill="none">
             <path d="M50 5L20 35V115H35V75H45V115H65V100H80V115H95V55L80 4