import { Cloud, CheckCircle2, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import type { DriveSyncStatus } from '../types';

interface HeaderProps {
  currentMonthName: string;
  onOpenMonthSelector: () => void;
  syncStatus: DriveSyncStatus;
  onSyncClick: () => void;
  onNewTransaction: () => void;
}

export function Header({
  currentMonthName,
  onOpenMonthSelector,
  syncStatus,
  onSyncClick,
  onNewTransaction,
}: HeaderProps) {
  const getSyncBadge = () => {
    if (syncStatus.status === 'syncing') {
      return (
        <button
          onClick={onSyncClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span className="hidden xs:inline">Sincronizzo...</span>
        </button>
      );
    }
    if (syncStatus.userEmail) {
      return (
        <button
          onClick={onSyncClick}
          title={`Sincronizzato con ${syncStatus.userEmail}`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100 transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline font-mono text-[11px]">Drive OK</span>
          <span className="sm:hidden">Drive</span>
        </button>
      );
    }
    return (
      <button
        onClick={onSyncClick}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 transition-colors"
      >
        <Cloud className="w-3.5 h-3.5 text-slate-500" />
        <span className="hidden xs:inline">Collega Drive</span>
        <span className="xs:hidden">Drive</span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-emerald-500/20">
            €
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
              Risparmio Famigliare
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>dreiu89@gmail.com</span>
            </p>
          </div>
        </div>

        {/* Center/Right Month Selector & Drive Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMonthSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{currentMonthName}</span>
          </button>

          {getSyncBadge()}
        </div>
      </div>
    </header>
  );
}
