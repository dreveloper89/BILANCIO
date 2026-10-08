export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'spesa_generica'
  | 'bollette'
  | 'condominio'
  | 'carburante_pedaggi'
  | 'scuola'
  | 'corsi'
  | 'vestiario_bambini'
  | 'assicurazioni'
  | 'bollo_auto'
  | 'tagliando_auto'
  | 'tari'
  | 'extra'
  | 'altre_uscite';

export type IncomeCategory =
  | 'stipendio'
  | 'bonus_lavoro'
  | 'assegno_figli'
  | 'regali'
  | 'rendita'
  | 'altre_entrate';

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export interface CategoryInfo {
  id: TransactionCategory;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  type: TransactionType;
  canSplit12Months?: boolean;
}

export const CATEGORIES_CONFIG: Record<TransactionCategory, CategoryInfo> = {
  spesa_generica: {
    id: 'spesa_generica',
    name: 'Spesa generica',
    icon: 'ShoppingCart',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    description: 'Supermercato, alimentari, igiene e casa',
    type: 'expense',
  },
  bollette: {
    id: 'bollette',
    name: 'Bollette',
    icon: 'Zap',
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10 dark:bg-sky-500/20',
    borderColor: 'border-sky-500/30',
    description: 'Luce, gas, acqua, internet',
    type: 'expense',
  },
  tari: {
    id: 'tari',
    name: 'TARI (Rifiuti)',
    icon: 'Trash2',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    description: 'Tassa rifiuti comunali (spalmabile sui 12 mesi)',
    type: 'expense',
    canSplit12Months: true,
  },
  assicurazioni: {
    id: 'assicurazioni',
    name: 'Assicurazioni',
    icon: 'ShieldCheck',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10 dark:bg-violet-500/20',
    borderColor: 'border-violet-500/30',
    description: 'Polizze auto/moto, casa (spalmabile sui 12 mesi)',
    type: 'expense',
    canSplit12Months: true,
  },
  bollo_auto: {
    id: 'bollo_auto',
    name: 'Bollo auto',
    icon: 'Car',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
    borderColor: 'border-rose-500/30',
    description: 'Tassa automobilistica annuale (spalmabile sui 12 mesi)',
    type: 'expense',
    canSplit12Months: true,
  },
  tagliando_auto: {
    id: 'tagliando_auto',
    name: 'Tagliando auto',
    icon: 'Wrench',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    description: 'Manutenzione periodica e tagliando (spalmabile sui 12 mesi)',
    type: 'expense',
    canSplit12Months: true,
  },
  carburante_pedaggi: {
    id: 'carburante_pedaggi',
    name: 'Carburante e pedaggi',
    icon: 'Fuel',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10 dark:bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    description: 'Benzina, diesel, GPL, colonnine e pedaggi autostradali',
    type: 'expense',
  },
  condominio: {
    id: 'condominio',
    name: 'Condominio',
    icon: 'Building2',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    description: 'Spese condominiali ordinarie, riscaldamento e manutenzione stabile',
    type: 'expense',
  },
  scuola: {
    id: 'scuola',
    name: 'Scuola',
    icon: 'BookOpen',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    description: 'Mensa scolastica, libri di testo, gite e materiale scolastico',
    type: 'expense',
  },
  corsi: {
    id: 'corsi',
    name: 'Corsi',
    icon: 'GraduationCap',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    description: 'Sport, corsi pomeridiani, lezioni e attività formative',
    type: 'expense',
  },
  vestiario_bambini: {
    id: 'vestiario_bambini',
    name: 'Vestiario bambini',
    icon: 'Shirt',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10 dark:bg-pink-500/20',
    borderColor: 'border-pink-500/30',
    description: 'Abbigliamento, scarpe e corredo per i bambini',
    type: 'expense',
  },
  extra: {
    id: 'extra',
    name: 'Extra',
    icon: 'Sparkles',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    description: 'Spese extra, imprevisti, regali per altri o uscite speciali',
    type: 'expense',
  },
  altre_uscite: {
    id: 'altre_uscite',
    name: 'Altre uscite',
    icon: 'CreditCard',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-500/10 dark:bg-slate-500/20',
    borderColor: 'border-slate-500/30',
    description: 'Spese impreviste, svago o varie',
    type: 'expense',
  },
  stipendio: {
    id: 'stipendio',
    name: 'Stipendio',
    icon: 'Briefcase',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    description: 'Stipendio mensile (include 13esima, 14esima e rimborso 730)',
    type: 'income',
  },
  bonus_lavoro: {
    id: 'bonus_lavoro',
    name: 'Bonus lavoro',
    icon: 'Award',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10 dark:bg-teal-500/20',
    borderColor: 'border-teal-500/30',
    description: 'Premi produzione, incentivi (divisibile sui 12 mesi)',
    type: 'income',
    canSplit12Months: true,
  },
  assegno_figli: {
    id: 'assegno_figli',
    name: 'Assegno figli',
    icon: 'Baby',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10 dark:bg-pink-500/20',
    borderColor: 'border-pink-500/30',
    description: 'Assegno Unico INPS figli a carico (divisibile sui 12 mesi)',
    type: 'income',
    canSplit12Months: true,
  },
  regali: {
    id: 'regali',
    name: 'Regali',
    icon: 'Gift',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
    borderColor: 'border-rose-500/30',
    description: 'Regali monetari, compleanni, festività o donazioni (divisibile sui 12 mesi)',
    type: 'income',
    canSplit12Months: true,
  },
  rendita: {
    id: 'rendita',
    name: 'Rendita / Interessi',
    icon: 'TrendingUp',
    color: 'text-lime-600 dark:text-lime-400',
    bgColor: 'bg-lime-500/10 dark:bg-lime-500/20',
    borderColor: 'border-lime-500/30',
    description: 'Affitti, cedole, rendimenti finanziari',
    type: 'income',
  },
  altre_entrate: {
    id: 'altre_entrate',
    name: 'Altre entrate',
    icon: 'PlusCircle',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    description: 'Vendite usato o entrate varie',
    type: 'income',
  },
};

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string; // YYYY-MM-DD
  payer?: string;
  notes?: string;
  createdAt: number;
  updatedAt?: number;
  isSplitOver12Months?: boolean;
  splitYear?: number;
  originalTotalAmount?: number;
  parentSplitId?: string;
}

export interface FamilyBudgetData {
  version: number;
  updatedAt: string;
  targetMonthlySavings: number;
  defaultUserEmail: string;
  transactions: Transaction[];
}

export interface ExtraIncomesSummary {
  totalBonusLavoro: number;
  totalAssegnoFigli: number;
  totalRegali: number;
  totalExtraAnnual: number;
  monthlyAverageExtra: number; // totalExtraAnnual / 12
}

export interface PeriodicExpensesSummary {
  totalBolloAuto: number;
  totalTari: number;
  totalAssicurazioneAuto: number;
  totalTagliandoAuto: number;
  totalPeriodicAnnual: number;
  monthlyAveragePeriodic: number; // totalPeriodicAnnual / 12 (quota da accantonare ogni mese)
}

export interface MonthStats {
  monthKey: string; // YYYY-MM
  monthName: string;
  year: number;
  monthIndex: number; // 0-11
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number; // percentage (0-100)
  expenseByCategory: Record<ExpenseCategory, number>;
  incomeByCategory: Record<IncomeCategory, number>;
  transactionsCount: number;
}

export interface AverageStats {
  monthsCount: number;
  avgMonthlyIncome: number;
  avgMonthlyExpense: number;
  avgMonthlySavings: number;
  avgSavingsRate: number;
  avgByCategory: Record<ExpenseCategory, number>;
  totalCumulativeSavings: number;
  highestExpenseMonth?: { monthName: string; amount: number };
  highestSavingsMonth?: { monthName: string; amount: number };
  extraIncomesSummary: ExtraIncomesSummary;
  periodicExpensesSummary: PeriodicExpensesSummary;
}

export interface DriveSyncStatus {
  status: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: string | null;
  fileId: string | null;
  fileName: string;
  userEmail: string | null;
  userName?: string | null;
  userPhoto?: string | null;
  errorMessage?: string | null;
  autoSyncEnabled: boolean;
}
