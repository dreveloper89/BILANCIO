import { X, Calendar, Check } from 'lucide-react';
import { formatMonthKey } from '../services/storage';

interface MonthSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMonths: string[];
  selectedMonth: string;
  onSelectMonth: (monthKey: string) => void;
  onAddNewMonth: () => void;
}

export function MonthSelectorModal({
  isOpen,
  onClose,
  availableMonths,
  selectedMonth,
  onSelectMonth,
  onAddNewMonth,
}: MonthSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Seleziona Mese</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3 max-h-72 overflow-y-auto space-y-1.5">
          {availableMonths.map((mKey) => {
            const isSelected = mKey === selectedMonth;
            return (
              <button
                key={mKey}
                onClick={() => {
                  onSelectMonth(mKey);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{formatMonthKey(mKey)}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onAddNewMonth();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            + Inserisci spesa per un nuovo mese
          </button>
        </div>
      </div>
    </div>
  );
}
