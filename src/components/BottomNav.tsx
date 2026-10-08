import { LayoutDashboard, CalendarDays, TrendingUp, Cloud, Plus } from 'lucide-react';

export type NavTab = 'dashboard' | 'months' | 'averages' | 'drive';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNewTransaction: () => void;
}

export function BottomNav({ currentTab, onTabChange, onNewTransaction }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'months' as NavTab, label: 'Mesi', icon: CalendarDays },
    { id: 'averages' as NavTab, label: 'Medie', icon: TrendingUp },
    { id: 'drive' as NavTab, label: 'Drive', icon: Cloud },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe pt-1 shadow-lg">
      <div className="max-w-md mx-auto px-4 flex items-center justify-around h-16 relative">
        {/* Left Tabs */}
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}

        {/* Center Floating Action Button (+ Nuova Spesa / Entrata) */}
        <div className="relative -top-5">
          <button
            onClick={onNewTransaction}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all focus:outline-hidden ring-4 ring-white dark:ring-slate-900"
            aria-label="Aggiungi nuova spesa o entrata"
          >
            <Plus className="w-7 h-7 stroke-[2.5px]" />
          </button>
        </div>

        {/* Right Tabs */}
        {tabs.slice(2).map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
