import React, { useState, useEffect } from 'react'; // ĐÃ THÊM useEffect
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { LearningPathwayGenerator } from './components/LearningPathwayGenerator';
import { Tutor } from './components/Tutor';
import { Solver } from './components/Solver';
import { Settings } from './components/Settings';
import { Logs } from './components/Logs';
import { Progress } from './components/Progress';
import { Pomodoro } from './components/Pomodoro';
import { FloatingPomodoro } from './components/FloatingPomodoro';
import { Practice } from './components/Practice';
import { Login } from './components/Login';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Construction } from 'lucide-react';
import { cn } from './lib/utils';
import { Toaster } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const session = localStorage.getItem('eduai_session');
    return session ? JSON.parse(session).loggedIn : false;
  });

  // ==========================================
  // VỊ TRÍ 1: GẮN TIẾP BIẾN VÀ BỘ NHỚ (Dưới isLoggedIn)
  // ==========================================
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([]);
  const quickTags = ["Định khoản", "Luật 2005", "Thuế TNCN"];

  // Tự động tải dữ liệu cũ khi mở trang
  useEffect(() => {
    const saved = localStorage.getItem('edu_logs');
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  // Tự động lưu dữ liệu mới mỗi khi nhật ký thay đổi
  useEffect(() => {
    localStorage.setItem('edu_logs', JSON.stringify(logs));
  }, [logs]);
  // ==========================================

  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Login onLogin={() => setIsLoggedIn(true)} />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'pathway':
        return <LearningPathwayGenerator />;
      case 'tutor':
        return <Tutor />;
      case 'practice':
        return <Practice />;
      case 'solver':
        return <Solver />;
      case 'logs':
        // Gắn thêm logs vào component Logs để hiển thị
        return <Logs setActiveTab={setActiveTab} logs={logs} setLogs={setLogs} />;
      case 'progress':
        return <Progress />;
      case 'pomodoro':
        return <Pomodoro />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />
      <FloatingPomodoro />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AnimatePresence>
          {activeTab !== 'tutor' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 64, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden z-30"
            >
              <TopBar setActiveTab={setActiveTab} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <main className={cn(
          "flex-1 overflow-y-auto transition-all duration-300",
          activeTab === 'tutor' ? "p-0" : "p-8 lg:p-12"
        )}>
          <div className={cn(
            "mx-auto transition-all duration-300",
            activeTab === 'tutor' ? "max-w-none h-full" : "max-w-6xl"
          )}>

            {/* ========================================== */}
            {/* VỊ TRÍ 2: GẮN THANH TRA CỨU NHANH (Trên AnimatePresence) */}
            {/* ========================================== */}
            {activeTab !== 'tutor' && (
              <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex gap-2 mb-3">
                  {quickTags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setInput(tag)}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tra cứu nhanh Luật & Kế toán..." 
                    className="flex-1 text-sm p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Hỏi AI</button>
                </div>
              </div>
            )}
            {/* ========================================== */}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}