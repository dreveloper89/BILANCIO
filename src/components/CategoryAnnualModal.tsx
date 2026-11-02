import { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Split,
  ChevronRight,
  PieChart,
  Wallet,
} from 'lucide-react';
import {
  CATEGORIES_CONFIG,
  getCategoryConfig,
  type Transaction,
  type TransactionCategory,
  type CategoryInfo,
} from '../types';
import { formatCurrency, MONTH_NAMES_IT } from '../services/storage';
import { CategoryIcon } from './CategoryIcon';

interface CategoryAnnualModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: TransactionCategory | null;
  transactions: Transaction[];
  initialYear?: number;
  customCategories?: CategoryInfo[];
  onSelectTransaction?: (tx: Transaction) => void;
  onNewTransactionForCategory?: (cat: TransactionCategory) => void;
  onGoToMonth?: (monthKey: string) => void;
}

export function CategoryAnnualModal({
  isOpen,
  onClose,
  category,
  transactions,
  initialYear = 2026,
  customCategories,
  onSelectTransaction,
  onNewTransactionForCategory,
  onGoToMonth,
}: CategoryAnnualModalProps) {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all distinct years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(2026);
    transactions.forEach((tx) => {
      if (tx.date && tx.date.length >= 4) {
        const y = parseInt(tx.date.substring(0, 4), 10);
        if (!isNaN(y)) years.add(y);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  // Keep selectedYear valid
  const currentYear = availableYears.includes(selectedYear)
    ? selectedYear
    : availableYears[0] || 2026;

  // Filter transactions for category and year
  const categoryTransactions = useMemo(() => {
    if (!category) return [];
    const prefix = `${currentYear}-`;
    return transactions
      .filter((tx) => tx.category === category && tx.date.startsWith(prefix))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [category, currentYear, transactions]);

  // Total annual amount for this category
  const totalCategoryAmount = useMemo(() => {
    return categoryTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [categoryTransactions]);

  // Total annual amount for ALL categories of the same type (expense or income)
  const totalSameTypeAnnualAmount = useMemo(() => {
    if (!category) return 0;
    const conf = getCategoryConfig(category, customCategories);
    const targetType = conf ? conf.type : 'expense';
    const prefix = `${currentYear}-`;

    return transactions
      .filter((tx) => tx.type === targetType && tx.date.startsWith(prefix))
      .reduce((acc, tx) => acc + tx.amount, 0);
  }, [category, currentYear, transactions, customCategories]);

  // Percentage of total annual expenses / incomes
  const percentageOfTotal =
    totalSameTypeAnnualAmount > 0
      ? Math.round((totalCategoryAmount / totalSameTypeAnnualAmount) * 100)
      : 0;

  // Monthly breakdown for all 12 months
  const monthlyBreakdown = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthNum = String(i + 1).padStart(2, '0');
      const monthKey = `${currentYear}-${monthNum}`;
      const monthTx = categoryTransactions.filter((tx) =>
        tx.date.startsWith(monthKey)
      );
      const total = monthTx.reduce((sum, tx) => sum + tx.amount, 0);
      return {
        monthIndex: i,
        monthKey,
        monthName: MONTH_NAMES_IT[i],
        shortName: MONTH_NAMES_IT[i].substring(0, 3),
        total,
        count: monthTx.length,
      };
    });

    return months;
  }, [categoryTransactions, currentYear]);

  // Max month amount for scaling bars
  const maxMonthAmount = useMemo(() => {
    return Math.max(...monthlyBreakdown.map((m) => m.total), 1);
  }, [monthlyBreakdown]);

  // Month with highest spending
  const peakMonth = useMemo(() => {
    let peak = monthlyBreakdown[0];
    monthlyBreakdown.forEach((m) => {
      if (m.total > peak.total) peak = m;
    });
    return peak.total > 0 ? peak : null;
  }, [monthlyBreakdown]);

  // Filtered transactions by search query
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return categoryTransactions;
    const q = searchQuery.toLowerCase();
    return categoryTransactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(q) ||
        (tx.payer && tx.payer.toLowerCase().includes(q)) ||
        (tx.notes && tx.notes.toLowerCase().includes(q)) ||
        tx.date.includes(q)
    );
  }, [categoryTransactions, searchQuery]);

  if (!isOpen || !category) return null;

  const conf = getCategoryConfig(category, customCategories);
  const isIncome = conf.type === 'income';
  const monthlyAverage = totalCategoryAmount / 12;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${conf.bgColor} ${conf.color} shadow-xs`}>
              <CategoryIcon category={category} iconName={conf.icon} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {conf.name}
                </h2>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isIncome
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {isIncome ? 'Entrata' : 'Spesa'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {conf.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors shrink-0"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Year Selector Tabs */}
        {availableYears.length > 1 && (
          <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-50 dark:bg-slate-850/60 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Anno:
            </span>
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentYear === yr
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-4">
          {/* Hero Card: Totale Annuale */}
          <div
            className={`p-4 rounded-2xl border text-white relative overflow-hidden shadow-lg ${
              isIncome
                ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 border-emerald-700/50'
                : 'bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-slate-700/80'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Totale Annuale ({currentYear})
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-xs font-semibold text-slate-200">
                {conf.name}
              </span>
            </div>

            <div className="my-2">
              <h3
                className={`text-3xl sm:text-4xl font-black tracking-tight ${
                  isIncome ? 'text-emerald-300' : 'text-white'
                }`}
              >
                {formatCurrency(totalCategoryAmount)}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Totale accumulato per questa spesa nell&apos;intero anno {currentYear}
              </p>
            </div>

            {/* Sub-Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
              <div className="bg-white/5 rounded-xl p-2 backdrop-blur-xs">
                <span className="text-[10px] text-slate-400 block font-medium">
                  Media mensile
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  {formatCurrency(monthlyAverage)}/m
                </span>
              </div>

              <div className="bg-white/5 rounded-xl p-2 backdrop-blur-xs">
                <span className="text-[10px] text-slate-400 block font-medium">
                  Incidenza annuale
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-400">
                  {percentageOfTotal}% {isIncome ? 'entrate' : 'uscite'}
                </span>
              </div>

              <div className="bg-white/5 rounded-xl p-2 backdrop-blur-xs">
                <span className="text-[10px] text-slate-400 block font-medium">
                  Registrazioni
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  {categoryTransactions.length} {categoryTransactions.length === 1 ? 'voce' : 'voci'}
                </span>
              </div>
            </div>
          </div>

          {/* 12-Month Distribution Chart */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Ripartizione nei 12 Mesi ({currentYear})
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Andamento mese per mese da Gennaio a Dicembre
                </p>
              </div>
              {peakMonth && (
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
                  Picco: {peakMonth.monthName} ({formatCurrency(peakMonth.total)})
                </span>
              )}
            </div>

            {/* Visual Bars for all 12 Months */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-2">
              {monthlyBreakdown.map((m) => {
                const heightPct =
                  maxMonthAmount > 0 ? Math.round((m.total / maxMonthAmount) * 100) : 0;
                const hasValue = m.total > 0;

                return (
                  <div
                    key={m.monthIndex}
                    onClick={() => {
                      if (onGoToMonth) {
                        onGoToMonth(m.monthKey);
                        onClose();
                      }
                    }}
                    className={`flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer ${
                      hasValue
                        ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-emerald-500 hover:scale-105'
                        : 'bg-slate-100/60 dark:bg-slate-800/40 opacity-60'
                    }`}
                    title={`${m.monthName} ${currentYear}: ${formatCurrency(m.total)}`}
                  >
                    {/* Amount top */}
                    <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                      {hasValue ? `€${Math.round(m.total)}` : '—'}
                    </span>

                    {/* Vertical bar container */}
                    <div className="w-3.5 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex flex-col justify-end p-0.5 my-1 overflow-hidden">
                      <div
                        style={{ height: `${Math.max(hasValue ? 8 : 0, heightPct)}%` }}
                        className={`w-full rounded-full transition-all duration-300 ${
                          isIncome
                            ? 'bg-emerald-500'
                            : m.total === peakMonth?.total && peakMonth?.total > 0
                            ? 'bg-rose-500 shadow-xs'
                            : 'bg-emerald-600'
                        }`}
                      />
                    </div>

                    {/* Month Label */}
                    <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400">
                      {m.shortName}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 12-Month Split Notice if applicable */}
            {conf.canSplit12Months && (
              <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <Split className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Questa voce è <strong>spalmabile sui 12 mesi</strong>: la quota ideale da accantonare è di{' '}
                  <strong>{formatCurrency(monthlyAverage)}/mese</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Transactions List */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Voci Registrate nel {currentYear} ({filteredList.length})
              </h4>
              {onNewTransactionForCategory && (
                <button
                  type="button"
                  onClick={() => {
                    onNewTransactionForCategory(category);
                    onClose();
                  }}
                  className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Aggiungi
                </button>
              )}
            </div>

            {/* Search if more than 3 transactions */}
            {categoryTransactions.length > 3 && (
              <input
                type="text"
                placeholder="Filtra per descrizione o persona..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            )}

            {filteredList.length === 0 ? (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                Nessuna voce registrata per questa categoria nel {currentYear}.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto pr-1">
                {filteredList.map((tx) => (
                  <div
                    key={tx.id}
                    className="py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl px-1.5 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {tx.description}
                        </p>
                        {tx.isSplitOver12Months && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
                            1/12
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-mono">{tx.date}</span>
                        {tx.payer && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400">{tx.payer}</span>
                          </>
                        )}
                        {tx.notes && (
                          <>
                            <span>•</span>
                            <span className="italic text-slate-400 truncate max-w-[120px]">
                              {tx.notes}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-sm font-extrabold ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {formatCurrency(tx.amount)}
                      </span>

                      {onSelectTransaction && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTransaction(tx);
                            onClose();
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Modifica"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Chiudi
          </button>

          {onNewTransactionForCategory && (
            <button
              type="button"
              onClick={() => {
                onNewTransactionForCategory(category);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuova spesa in {conf.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
