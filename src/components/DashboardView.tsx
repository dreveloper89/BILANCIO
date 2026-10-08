import {
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Percent,
  Plus,
  ChevronRight,
  Scale,
  Calendar,
  Split,
} from 'lucide-react';
import type { MonthStats, AverageStats, Transaction } from '../types';
import { CATEGORIES_CONFIG, type ExpenseCategory } from '../types';
import { formatCurrency } from '../services/storage';
import { CategoryIcon } from './CategoryIcon';

interface DashboardViewProps {
  currentStats: MonthStats;
  averageStats: AverageStats;
  recentTransactions: Transaction[];
  onViewAllMonths: () => void;
  onViewAverages: () => void;
  onNewTransaction: () => void;
  onSelectTransaction: (tx: Transaction) => void;
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

const CATEGORY_STYLES: Record<
  string,
  { bg?: string; percentColor?: string; percentBorder?: string }
> = {};

export function DashboardView({
  currentStats,
  averageStats,
  recentTransactions,
  onViewAllMonths,
  onViewAverages,
  onNewTransaction,
  onSelectTransaction,
}: DashboardViewProps) {
  // Compare current month expenses with historical average
  const expenseDiffFromAvg = currentStats.totalExpense - averageStats.avgMonthlyExpense;
  const isSpendingBelowAvg = expenseDiffFromAvg <= 0;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Hero Card: Net Savings & Savings Rate */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-emerald-900/50">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-32 h-32 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300/80 flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4 text-emerald-400" />
              Risparmio Netto del Mese ({currentStats.monthName})
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                currentStats.netSavings >= 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              <Percent className="w-3 h-3" />
              {currentStats.savingsRate}% risparmiato
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                currentStats.netSavings >= 0 ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {formatCurrency(currentStats.netSavings)}
            </h2>
            <span className="text-xs text-slate-400">
              {currentStats.netSavings >= 0 ? 'risparmiati' : 'in disavanzo'}
            </span>
          </div>

          {/* Two Pillars: Entrate & Uscite */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80">
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="font-semibold">Entrate</span>
              </div>
              <p className="text-lg font-bold text-slate-100">
                {formatCurrency(currentStats.totalIncome)}
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mb-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span className="font-semibold">Uscite</span>
              </div>
              <p className="text-lg font-bold text-slate-100">
                {formatCurrency(currentStats.totalExpense)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison with Monthly Average Card */}
      <div
        onClick={onViewAverages}
        className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs cursor-pointer hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Confronto Media Mensile
              </h3>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Media spese:{' '}
              <span className="font-bold">{formatCurrency(averageStats.avgMonthlyExpense)}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isSpendingBelowAvg ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Risparmi {formatCurrency(Math.abs(expenseDiffFromAvg))} rispetto alla media mensile
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  + {formatCurrency(expenseDiffFromAvg)} oltre la media mensile
                </span>
              )}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
      </div>

      {/* Extra Incomes 12-Month Distribution Card */}
      {averageStats.extraIncomesSummary && averageStats.extraIncomesSummary.totalExtraAnnual > 0 && (
        <div
          onClick={onViewAverages}
          className="bg-gradient-to-r from-indigo-50/80 via-emerald-50/70 to-teal-50/80 dark:from-indigo-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-4 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs cursor-pointer hover:border-indigo-400 transition-all flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                Entrate Extra Spalate sui 12 Mesi
              </span>
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                +{formatCurrency(averageStats.extraIncomesSummary.monthlyAverageExtra)}{' '}
                <span className="text-xs font-normal text-slate-500">/ mese al budget familiare</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Da bonus lavoro, assegno figli e regali ({formatCurrency(averageStats.extraIncomesSummary.totalExtraAnnual)} annui)
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-indigo-400 shrink-0" />
        </div>
      )}

      {/* Periodic Expenses 12-Month Distribution Card */}
      {averageStats.periodicExpensesSummary &&
        averageStats.periodicExpensesSummary.totalPeriodicAnnual > 0 && (
          <div
            onClick={onViewAverages}
            className="bg-gradient-to-r from-rose-50/80 via-amber-50/70 to-indigo-50/80 dark:from-rose-950/30 dark:via-amber-950/30 dark:to-indigo-950/30 rounded-2xl p-4 border border-rose-200/80 dark:border-rose-800/60 shadow-xs cursor-pointer hover:border-rose-400 transition-all flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Split className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 block">
                  Spese Periodiche Spalate sui 12 Mesi
                </span>
                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  -{formatCurrency(averageStats.periodicExpensesSummary.monthlyAveragePeriodic)}{' '}
                  <span className="text-xs font-normal text-slate-500">/ mese da accantonare</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Bollo auto, TARI, assicurazione auto e tagliando ({formatCurrency(averageStats.periodicExpensesSummary.totalPeriodicAnnual)} annui)
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-400 shrink-0" />
          </div>
        )}

      {/* Suddivisione Uscite per Categorie Richieste */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Suddivisione Spese del Mese
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
              {currentStats.monthName}
            </span>
          </div>
          <button
            onClick={onViewAllMonths}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            Dettagli
          </button>
        </div>

        <div className="space-y-2.5">
          {PRIMARY_EXPENSE_CATEGORIES.map((catKey) => {
            const conf = CATEGORIES_CONFIG[catKey];
            const amount = currentStats.expenseByCategory[catKey] || 0;
            const percent =
              currentStats.totalExpense > 0
                ? Math.round((amount / currentStats.totalExpense) * 100)
                : 0;

            const customStyle = CATEGORY_STYLES[catKey];

            return (
              <div
                key={catKey}
                style={customStyle?.bg ? { backgroundColor: customStyle.bg } : undefined}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${conf.bgColor} ${conf.color}`}>
                      <CategoryIcon category={catKey} className="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold ${
                          customStyle?.bg ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {conf.name}
                      </span>
                      <span
                        style={
                          customStyle?.percentColor
                            ? {
                                color: customStyle.percentColor,
                                borderColor: customStyle.percentBorder || undefined,
                              }
                            : undefined
                        }
                        className={`text-[10px] ml-1.5 ${
                          customStyle?.bg ? 'font-semibold' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        ({percent}%)
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-extrabold ${
                      customStyle?.bg ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      catKey === 'spesa_generica'
                        ? 'bg-amber-500'
                        : catKey === 'bollette'
                        ? 'bg-sky-500'
                        : catKey === 'condominio'
                        ? 'bg-cyan-500'
                        : catKey === 'carburante_pedaggi'
                        ? 'bg-orange-500'
                        : catKey === 'scuola'
                        ? 'bg-amber-700'
                        : catKey === 'corsi'
                        ? 'bg-indigo-500'
                        : catKey === 'vestiario_bambini'
                        ? 'bg-pink-500'
                        : catKey === 'assicurazioni'
                        ? 'bg-violet-500'
                        : catKey === 'bollo_auto'
                        ? 'bg-rose-500'
                        : catKey === 'tagliando_auto'
                        ? 'bg-blue-500'
                        : catKey === 'tari'
                        ? 'bg-emerald-600'
                        : 'bg-slate-500'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Altre uscite se presenti */}
          {(currentStats.expenseByCategory.altre_uscite || 0) > 0 && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <CategoryIcon category="altre_uscite" className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Altre uscite
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {formatCurrency(currentStats.expenseByCategory.altre_uscite)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transazioni Recenti */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Ultime Voci Registrate
          </h3>
          <button
            onClick={onNewTransaction}
            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Aggiungi
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
            Nessuna voce registrata per questo mese. Clicca sul + per iniziare!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.slice(0, 5).map((tx) => {
              const conf = CATEGORIES_CONFIG[tx.category] || CATEGORIES_CONFIG.altre_uscite;
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${conf.bgColor} ${conf.color}`}
                    >
                      <CategoryIcon category={tx.category} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{conf.name}</span>
                        {tx.payer && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400">{tx.payer}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-extrabold shrink-0 ${
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
