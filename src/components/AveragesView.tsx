import {
  TrendingUp,
  BarChart3,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Shield,
  Lightbulb,
  Split,
  Gift,
  Sun,
  Award,
  Baby,
  RotateCcw,
  Info,
} from 'lucide-react';
import type { AverageStats, MonthStats } from '../types';
import { CATEGORIES_CONFIG, type ExpenseCategory } from '../types';
import { formatCurrency } from '../services/storage';
import { CategoryIcon } from './CategoryIcon';

interface AveragesViewProps {
  averageStats: AverageStats;
  allMonthStats: MonthStats[];
  onSelectMonth: (monthKey: string) => void;
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

export function AveragesView({ averageStats, allMonthStats, onSelectMonth }: AveragesViewProps) {
  // Annual projection
  const estimatedAnnualSavings = averageStats.avgMonthlySavings * 12;

  // Monthly provision needed for recurring lump-sum expenses (Bollo auto + Assicurazioni)
  const annualLumpSumMonthlyProvision =
    (averageStats.avgByCategory.assicurazioni || 0) + (averageStats.avgByCategory.bollo_auto || 0);

  // Extra incomes summary divided over 12 months (bonus lavoro, assegno figli, regali)
  const extraSummary = averageStats.extraIncomesSummary || {
    totalBonusLavoro: 0,
    totalAssegnoFigli: 0,
    totalRegali: 0,
    totalExtraAnnual: 0,
    monthlyAverageExtra: 0,
  };

  // Periodic expenses summary divided over 12 months (bollo auto, tari, assicurazione auto, tagliando auto)
  const periodicSummary = averageStats.periodicExpensesSummary || {
    totalBolloAuto: 0,
    totalTari: 0,
    totalAssicurazioneAuto: 0,
    totalTagliandoAuto: 0,
    totalPeriodicAnnual: 0,
    monthlyAveragePeriodic: 0,
  };

  const periodicCategories = [
    {
      name: 'Bollo auto',
      total: periodicSummary.totalBolloAuto,
      icon: Shield,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-200 dark:border-rose-800',
      description: 'Tassa automobilistica',
    },
    {
      name: 'TARI (Rifiuti)',
      total: periodicSummary.totalTari,
      icon: Lightbulb,
      color: 'text-emerald-700 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      description: 'Tassa rifiuti comunali',
    },
    {
      name: 'Assicurazione auto',
      total: periodicSummary.totalAssicurazioneAuto,
      icon: Shield,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/40',
      borderColor: 'border-violet-200 dark:border-violet-800',
      description: 'Polizze veicoli e RCA',
    },
    {
      name: 'Tagliando auto',
      total: periodicSummary.totalTagliandoAuto,
      icon: Calculator,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-800',
      description: 'Manutenzione e revisione',
    },
  ];

  // Maximum expense/income in any month to scale the SVG chart
  const maxBarValue = Math.max(
    ...allMonthStats.map((m) => Math.max(m.totalIncome, m.totalExpense, 1)),
    2000
  );

  const extraCategories = [
    {
      name: 'Bonus lavoro',
      total: extraSummary.totalBonusLavoro,
      icon: Award,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-200 dark:border-teal-800',
      description: 'Premi produzione e incentivi',
    },
    {
      name: 'Assegno figli',
      total: extraSummary.totalAssegnoFigli,
      icon: Baby,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950/40',
      borderColor: 'border-pink-200 dark:border-pink-800',
      description: 'Assegno Unico INPS figli a carico',
    },
    {
      name: 'Regali',
      total: extraSummary.totalRegali,
      icon: Gift,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-200 dark:border-rose-800',
      description: 'Regali monetari, compleanni e festività',
    },
  ];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Hero Banner: Media Risparmio Mensile */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Media Mensile Storica ({averageStats.monthsCount} {averageStats.monthsCount === 1 ? 'Mese' : 'Mesi'})
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            Tasso medio: {averageStats.avgSavingsRate}%
          </span>
        </div>

        <div className="mb-4">
          <span className="text-xs text-slate-300">Risparmio Netto Medio al Mese</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-300 tracking-tight">
            {formatCurrency(averageStats.avgMonthlySavings)}
            <span className="text-sm font-normal text-slate-300"> / mese</span>
          </h2>
        </div>

        {/* 2 Sub-metrics: Entrate Medie & Uscite Medie */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-teal-800/60">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-teal-700/30">
            <div className="flex items-center gap-1 text-xs text-emerald-400 mb-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Media Entrate</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-white">
              {formatCurrency(averageStats.avgMonthlyIncome)}
            </p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-teal-700/30">
            <div className="flex items-center gap-1 text-xs text-rose-400 mb-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Media Uscite</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-white">
              {formatCurrency(averageStats.avgMonthlyExpense)}
            </p>
          </div>
        </div>
      </div>

      {/* Ripartizione Entrate Straordinarie sui 12 Mesi */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Ripartizione Entrate Extra sui 12 Mesi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bonus lavoro, assegno figli e regali divisi per 12 mesi
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Quota Mensile
            </span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(extraSummary.monthlyAverageExtra)}/m
            </span>
          </div>
        </div>

        {/* Info notice about 13esima, 14esima, and 730 */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Nota:</strong> 13esima, 14esima e rimborso 730 sono registrati direttamente come valore unico nella voce <em>Stipendio</em>.
          </span>
        </div>

        {/* Highlight Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Totale Entrate Straordinarie Annuali:
            </span>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(extraSummary.totalExtraAnnual)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              Spalmato sui 12 mesi:
            </span>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(extraSummary.monthlyAverageExtra)} / mese
            </p>
          </div>
        </div>

        {/* Breakdown for each extra income category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {extraCategories.map((item) => {
            const Icon = item.icon;
            const monthlyShare = item.total > 0 ? item.total / 12 : 0;

            return (
              <div
                key={item.name}
                className={`p-3 rounded-xl border ${item.bgColor} ${item.borderColor} flex items-center justify-between gap-2.5`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 ${item.color} shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {formatCurrency(item.total)}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.total > 0 ? `+${formatCurrency(monthlyShare)}/m` : '0 €'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ripartizione Spese Periodiche sui 12 Mesi (Bollo, TARI, Assicurazione, Tagliando) */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Spese Periodiche Spalate sui 12 Mesi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bollo auto, TARI, assicurazione auto e tagliando divisi per 12 mesi
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Quota Mensile
            </span>
            <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
              -{formatCurrency(periodicSummary.monthlyAveragePeriodic)}/m
            </span>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border border-rose-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Totale Spese Periodiche Annuali:
            </span>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(periodicSummary.totalPeriodicAnnual)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-rose-700 dark:text-rose-300 font-medium">
              Da accantonare ogni mese:
            </span>
            <p className="text-base font-black text-rose-600 dark:text-rose-400">
              {formatCurrency(periodicSummary.monthlyAveragePeriodic)} / mese
            </p>
          </div>
        </div>

        {/* Breakdown for each periodic expense category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {periodicCategories.map((item) => {
            const Icon = item.icon;
            const monthlyShare = item.total > 0 ? item.total / 12 : 0;

            return (
              <div
                key={item.name}
                className={`p-3 rounded-xl border ${item.bgColor} ${item.borderColor} flex items-center justify-between gap-2.5`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 ${item.color} shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {formatCurrency(item.total)}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                    {item.total > 0 ? `-${formatCurrency(monthlyShare)}/m` : '0 €'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Media Mensile per Categoria Richiesta */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Media Mensile per Categoria di Spesa
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Costo medio mensile calcolato sui mesi registrati da Gennaio 2026
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {PRIMARY_EXPENSE_CATEGORIES.map((catKey) => {
            const conf = CATEGORIES_CONFIG[catKey];
            const avgAmount = averageStats.avgByCategory[catKey] || 0;
            const percentOfAvgExpense =
              averageStats.avgMonthlyExpense > 0
                ? Math.round((avgAmount / averageStats.avgMonthlyExpense) * 100)
                : 0;

            return (
              <div
                key={catKey}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${conf.bgColor} ${conf.color}`}>
                      <CategoryIcon category={catKey} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {conf.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {conf.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {formatCurrency(avgAmount)}
                    </span>
                    <span className="text-[10px] block font-semibold text-slate-500">
                      {percentOfAvgExpense}% delle uscite
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      catKey === 'spesa_generica'
                        ? 'bg-amber-500'
                        : catKey === 'bollette'
                        ? 'bg-sky-500'
                        : catKey === 'assicurazioni'
                        ? 'bg-violet-500'
                        : catKey === 'bollo_auto'
                        ? 'bg-rose-500'
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(100, percentOfAvgExpense)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consiglio Risparmio e Accantonamento Spese Ricorrenti */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
            Consiglio Bilancio: Accantonamento Spese Ricorrenti
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
            Per spese annuali come <strong>Assicurazioni ({formatCurrency(averageStats.avgByCategory.assicurazioni || 0)}/m)</strong> e <strong>Bollo auto ({formatCurrency(averageStats.avgByCategory.bollo_auto || 0)}/m)</strong>, accantona circa{' '}
            <strong className="underline decoration-amber-500">
              {formatCurrency(annualLumpSumMonthlyProvision)} ogni mese
            </strong>{' '}
            in modo da non subire picchi imprevisti quando arrivano le scadenze.
          </p>
        </div>
      </div>

      {/* Confronto Mese per Mese (Grafico e Storico) */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Storico Mese per Mese (da Gennaio 2026)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Tocca per aprire</span>
        </div>

        {/* Visual Bar Comparison */}
        <div className="space-y-3 pt-1">
          {allMonthStats.map((m) => {
            const incomePct = (m.totalIncome / maxBarValue) * 100;
            const expensePct = (m.totalExpense / maxBarValue) * 100;

            return (
              <div
                key={m.monthKey}
                onClick={() => onSelectMonth(m.monthKey)}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-900 dark:text-slate-100">{m.monthName}</span>
                  <span
                    className={`font-extrabold ${
                      m.netSavings >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {m.netSavings >= 0 ? '+' : ''}
                    {formatCurrency(m.netSavings)}
                  </span>
                </div>

                <div className="space-y-1">
                  {/* Income bar */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-400 text-right shrink-0">Entrate</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(3, incomePct))}%` }}
                      />
                    </div>
                    <span className="w-16 font-mono text-slate-600 dark:text-slate-300 text-right">
                      {formatCurrency(m.totalIncome)}
                    </span>
                  </div>

                  {/* Expense bar */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-400 text-right shrink-0">Uscite</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(3, expensePct))}%` }}
                      />
                    </div>
                    <span className="w-16 font-mono text-slate-600 dark:text-slate-300 text-right">
                      {formatCurrency(m.totalExpense)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Previsione Annuale Card */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300">
              Proiezione Risparmio su 12 Mesi
            </h4>
            <p className="text-lg font-extrabold text-emerald-300">
              {formatCurrency(estimatedAnnualSavings)}
            </p>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
          Basato sulla media
        </span>
      </div>
    </div>
  );
}
