import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { MonthStats, Transaction, TransactionCategory, ExpenseCategory } from '../types';
import { CATEGORIES_CONFIG } from '../types';
import { formatCurrency, formatMonthKey } from '../services/storage';
import { CategoryIcon } from './CategoryIcon';

interface MonthlyViewProps {
  availableMonths: string[];
  selectedMonth: string;
  onSelectMonth: (monthKey: string) => void;
  monthStats: MonthStats;
  transactions: Transaction[];
  onNewTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (tx: Transaction) => void;
}

const PRIMARY_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'spesa_generica',
  'bollette',
  'condominio',
  'carburante_pedaggi',
  'scuola',
  'corsi',
  'vestiario_bambini',
  'assicurazioni',
  'bollo_auto',
  'tagliando_auto',
  'tari',
  'extra',
];

const CATEGORY_CARD_STYLES: Record<
  string,
  { bg?: string; descColor?: string; percentColor?: string }
> = {};

export function MonthlyView({
  availableMonths,
  selectedMonth,
  onSelectMonth,
  monthStats,
  transactions,
  onNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
}: MonthlyViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  const currentIdx = availableMonths.indexOf(selectedMonth);
  const hasNext = currentIdx > 0;
  const hasPrev = currentIdx < availableMonths.length - 1;

  const handlePrevMonth = () => {
    if (hasPrev) {
      onSelectMonth(availableMonths[currentIdx + 1]);
    }
  };

  const handleNextMonth = () => {
    if (hasNext) {
      onSelectMonth(availableMonths[currentIdx - 1]);
    }
  };

  // Filter transactions for this month
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    return monthTransactions.filter((tx) => {
      const matchesSearch =
        searchQuery === '' ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.payer && tx.payer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedFilterCategory === 'all' ||
        (selectedFilterCategory === 'income' && tx.type === 'income') ||
        tx.category === selectedFilterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [monthTransactions, searchQuery, selectedFilterCategory]);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Month Navigator Header */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          disabled={!hasPrev}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Mese precedente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            Mese Selezionato
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {formatMonthKey(selectedMonth)}
          </h2>
        </div>

        <button
          onClick={handleNextMonth}
          disabled={!hasNext}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Mese successivo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Month Summary Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 p-3 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Entrate
          </span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-900 dark:text-emerald-200">
            {formatCurrency(monthStats.totalIncome)}
          </span>
        </div>

        <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 p-3 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
            Uscite
          </span>
          <span className="text-sm sm:text-base font-extrabold text-rose-900 dark:text-rose-200">
            {formatCurrency(monthStats.totalExpense)}
          </span>
        </div>

        <div className="bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60 p-3 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
            Risparmio
          </span>
          <span
            className={`text-sm sm:text-base font-extrabold ${
              monthStats.netSavings >= 0
                ? 'text-teal-900 dark:text-teal-200'
                : 'text-rose-700 dark:text-rose-300'
            }`}
          >
            {formatCurrency(monthStats.netSavings)}
          </span>
        </div>
      </div>

      {/* Suddivisione Categorie Richieste per il Mese */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Suddivisione Spese del Mese
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Totale: {formatCurrency(monthStats.totalExpense)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRIMARY_EXPENSE_CATEGORIES.map((catKey) => {
            const conf = CATEGORIES_CONFIG[catKey];
            const amount = monthStats.expenseByCategory[catKey] || 0;
            const percent =
              monthStats.totalExpense > 0
                ? Math.round((amount / monthStats.totalExpense) * 100)
                : 0;

            const customStyle = CATEGORY_CARD_STYLES[catKey];

            return (
              <div
                key={catKey}
                onClick={() => setSelectedFilterCategory(catKey === selectedFilterCategory ? 'all' : catKey)}
                style={customStyle?.bg ? { backgroundColor: customStyle.bg } : undefined}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedFilterCategory === catKey
                    ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-md'
                    : customStyle?.bg
                    ? 'border-white/10 shadow-xs hover:brightness-110'
                    : 'border-slate-100 dark:border-slate-700/60 hover:bg-slate-100/60 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        customStyle?.bg ? 'bg-black/25 text-white' : `${conf.bgColor} ${conf.color}`
                      }`}
                    >
                      <CategoryIcon category={catKey} className="w-4 h-4" />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold ${
                          customStyle?.bg ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {conf.name}
                      </p>
                      <p
                        style={customStyle ? { color: customStyle.descColor } : undefined}
                        className={`text-[10px] ${
                          customStyle?.bg ? 'opacity-90' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {conf.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-extrabold ${
                        customStyle?.bg ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </p>
                    <p
                      style={customStyle ? { color: customStyle.percentColor } : undefined}
                      className={`text-[10px] font-semibold ${
                        customStyle?.bg ? 'opacity-90' : 'text-slate-500'
                      }`}
                    >
                      {percent}% uscite
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Voci Registrate ({filteredTransactions.length})
            </h3>
          </div>
          <button
            onClick={onNewTransaction}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuova Voce
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca per descrizione, persona o note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedFilterCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedFilterCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tutte
            </button>
            <button
              onClick={() => setSelectedFilterCategory('income')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedFilterCategory === 'income'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Entrate
            </button>
            <button
              onClick={() => setSelectedFilterCategory('stipendio')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedFilterCategory === 'stipendio'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Stipendio
            </button>
            <button
              onClick={() => setSelectedFilterCategory('regali')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedFilterCategory === 'regali'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Regali
            </button>
            <button
              onClick={() => setSelectedFilterCategory('bonus_lavoro')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedFilterCategory === 'bonus_lavoro'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Bonus
            </button>
            <button
              onClick={() => setSelectedFilterCategory('assegno_figli')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedFilterCategory === 'assegno_figli'
                  ? 'bg-pink-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Assegno figli
            </button>
            {[
              'spesa_generica',
              'bollette',
              'condominio',
              'carburante_pedaggi',
              'scuola',
              'corsi',
              'vestiario_bambini',
              'assicurazioni',
              'bollo_auto',
              'tagliando_auto',
              'tari',
              'extra',
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  selectedFilterCategory === cat
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {CATEGORIES_CONFIG[cat as ExpenseCategory]?.name || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
            Nessuna voce trovata per i criteri selezionati.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTransactions.map((tx) => {
              const conf = CATEGORIES_CONFIG[tx.category] || CATEGORIES_CONFIG.altre_uscite;
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-850/60 rounded-xl px-1 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`p-2 rounded-xl shrink-0 ${conf.bgColor} ${conf.color}`}>
                      <CategoryIcon category={tx.category} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {tx.description}
                        </p>
                        {tx.isSplitOver12Months && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                              isIncome
                                ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
                                : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            Spalmata 1/12
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-mono">{tx.date}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          {conf.name}
                        </span>
                        {tx.payer && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400">{tx.payer}</span>
                          </>
                        )}
                        {tx.notes && (
                          <>
                            <span>•</span>
                            <span className="italic text-slate-400 truncate max-w-[140px]">
                              {tx.notes}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-sm font-extrabold mr-1 ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                    <button
                      onClick={() => onEditTransaction(tx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Modifica"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(tx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
