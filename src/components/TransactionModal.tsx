import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Check,
  Calendar,
  Tag,
  FileText,
  User,
  ArrowDownRight,
  ArrowUpRight,
  Split,
  Plus,
  Sparkles,
} from 'lucide-react';
import {
  CATEGORIES_CONFIG,
  DEFAULT_QUICK_SUGGESTIONS,
  getMergedCategories,
  getCategoryConfig,
  type Transaction,
  type TransactionType,
  type TransactionCategory,
  type ExpenseCategory,
  type IncomeCategory,
  type CategoryInfo,
} from '../types';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    transaction: Omit<Transaction, 'id' | 'createdAt'>,
    existingId?: string,
    splitOver12Months?: boolean
  ) => void;
  editingTransaction?: Transaction | null;
  defaultMonthKey?: string;
  defaultCategory?: TransactionCategory | null;
  customCategories?: CategoryInfo[];
  customSuggestions?: Record<string, string[]>;
  onOpenCategoryManager?: (tab?: 'new' | 'list' | 'suggestions', catId?: string) => void;
  onAddSuggestion?: (catId: string, suggestion: string) => void;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
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
  'altre_uscite',
];

const INCOME_CATEGORIES: IncomeCategory[] = [
  'stipendio',
  'bonus_lavoro',
  'assegno_figli',
  'regali',
  'rendita',
  'altre_entrate',
];

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
  defaultMonthKey,
  defaultCategory,
  customCategories,
  customSuggestions,
  onOpenCategoryManager,
  onAddSuggestion,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory>('spesa_generica');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [payer, setPayer] = useState<string>('Famiglia');
  const [notes, setNotes] = useState<string>('');
  const [split12Months, setSplit12Months] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isAddingInlineSuggestion, setIsAddingInlineSuggestion] = useState(false);
  const [inlineSuggestionInput, setInlineSuggestionInput] = useState('');

  const allCategoriesMap = useMemo(
    () => getMergedCategories(customCategories),
    [customCategories]
  );

  const currentCategoryList = useMemo(() => {
    if (type === 'expense') {
      const customs = (customCategories || [])
        .filter((c) => c.type === 'expense')
        .map((c) => c.id);
      return [...EXPENSE_CATEGORIES, ...customs];
    } else {
      const customs = (customCategories || [])
        .filter((c) => c.type === 'income')
        .map((c) => c.id);
      return [...INCOME_CATEGORIES, ...customs];
    }
  }, [type, customCategories]);

  const suggestions = useMemo(() => {
    const defs = DEFAULT_QUICK_SUGGESTIONS[category] || [];
    const customs = customSuggestions?.[category] || [];
    return Array.from(new Set([...defs, ...customs]));
  }, [category, customSuggestions]);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmountStr(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
      setPayer(editingTransaction.payer || 'Famiglia');
      setNotes(editingTransaction.notes || '');
      setSplit12Months(!!editingTransaction.isSplitOver12Months);
      setError('');
    } else {
      const initialCat = defaultCategory || 'spesa_generica';
      const catConfig = getCategoryConfig(initialCat, customCategories);
      const initialType = catConfig?.type || 'expense';
      setType(initialType);
      setAmountStr('');
      setCategory(initialCat);
      setDescription('');
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      if (defaultMonthKey && !todayStr.startsWith(defaultMonthKey)) {
        setDate(`${defaultMonthKey}-01`);
      } else {
        setDate(todayStr);
      }
      setPayer('Famiglia');
      setNotes('');
      setSplit12Months(false);
      setError('');
    }
  }, [editingTransaction, isOpen, defaultMonthKey, defaultCategory, customCategories]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      const expenseCats = (customCategories || [])
        .filter((c) => c.type === 'expense')
        .map((c) => c.id);
      if (
        !EXPENSE_CATEGORIES.includes(category as ExpenseCategory) &&
        !expenseCats.includes(category)
      ) {
        setCategory('spesa_generica');
      }
    } else {
      if (!INCOME_CATEGORIES.includes(category as IncomeCategory)) {
        setCategory('stipendio');
      }
    }
  };

  const parsedAmount = parseFloat(amountStr.replace(',', '.'));
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;
  const monthlyInstallment = isValidAmount ? (parsedAmount / 12).toFixed(2) : '0.00';

  const isEligibleForSplit =
    (type === 'expense' &&
      ['bollo_auto', 'tari', 'assicurazioni', 'tagliando_auto'].includes(category)) ||
    (type === 'income' &&
      ['bonus_lavoro', 'assegno_figli', 'regali'].includes(category));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) {
      setError('Inserisci un importo valido maggiore di 0€');
      return;
    }
    if (!description.trim()) {
      setError('Inserisci una breve descrizione');
      return;
    }
    if (!date) {
      setError('Seleziona la data');
      return;
    }

    onSave(
      {
        type,
        amount: parsedAmount,
        category,
        description: description.trim(),
        date,
        payer: payer.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      editingTransaction?.id,
      split12Months && !editingTransaction // only trigger new 12-split generation if creating new
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {editingTransaction ? 'Modifica Voce' : 'Nuova Transazione'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {type === 'expense'
                ? 'Registra spesa per il budget familiare'
                : 'Registra stipendio, 13esima, 14esima, bonus o rimborsi'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Type Selector (Entrata vs Uscita) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              Uscita / Spesa
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Entrata / Guadagno
            </button>
          </div>

          {/* Big Amount Input */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Importo (€)
            </label>
            <div className="flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-400 dark:text-slate-500 mr-1.5">€</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                autoFocus={!editingTransaction}
                className="w-48 text-3xl font-extrabold text-slate-900 dark:text-white bg-transparent border-none text-center focus:outline-hidden focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Categoria {type === 'expense' ? 'di Spesa' : 'di Entrata'}
              </label>
              {type === 'expense' ? (
                <button
                  type="button"
                  onClick={() => onOpenCategoryManager?.('new')}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Nuova Categoria</span>
                </button>
              ) : (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Stipendio, bonus, assegno figli, regali
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentCategoryList.map((catKey) => {
                const conf = allCategoriesMap[catKey] || getCategoryConfig(catKey, customCategories);
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setCategory(catKey);
                      const shouldAutoSplit =
                        (type === 'expense' &&
                          ['bollo_auto', 'tari', 'assicurazioni', 'tagliando_auto'].includes(
                            catKey
                          )) ||
                        (type === 'income' &&
                          ['bonus_lavoro', 'assegno_figli', 'regali'].includes(catKey)) ||
                        conf.canSplit12Months;
                      if (shouldAutoSplit && !editingTransaction) {
                        setSplit12Months(true);
                      }
                      if (!description) {
                        const catSugs = DEFAULT_QUICK_SUGGESTIONS[catKey] || customSuggestions?.[catKey];
                        if (catSugs && catSugs.length > 0) {
                          setDescription(catSugs[0]);
                        }
                      }
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `${conf.bgColor} ${conf.borderColor} border-2 shadow-xs ring-2 ring-emerald-500/20`
                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${conf.bgColor} ${conf.color} shrink-0`}>
                      <CategoryIcon category={catKey} iconName={conf.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {conf.name}
                      </p>
                      {conf.isCustom && (
                        <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase block truncate">
                          Personalizzata
                        </span>
                      )}
                      {conf.canSplit12Months && !conf.isCustom && (
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block truncate">
                          ÷ 12 mesi
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {type === 'expense' && (
                <button
                  type="button"
                  onClick={() => onOpenCategoryManager?.('new')}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition-colors font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Crea Categoria</span>
                </button>
              )}
            </div>
          </div>

          {/* 12-Month Split Option for Periodic Expenses or Extra Incomes */}
          {!editingTransaction && (
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                split12Months
                  ? type === 'expense'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-2 rounded-xl text-white shrink-0 mt-0.5 ${
                      type === 'expense' ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                  >
                    <Split className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Spalma sui 12 mesi dell&apos;anno (2026)
                      </h4>
                      {isEligibleForSplit && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold uppercase tracking-wide">
                          Consigliato
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {type === 'expense'
                        ? 'Ideale per bollo auto, TARI, assicurazione e tagliando: la spesa viene divisa in 12 quote mensili (da Gen a Dic) per non gravare sul singolo mese.'
                        : 'Spalma uniformemente questa entrata (13esima, 14esima, bonus, assegno figli o 730) su tutti i 12 mesi per pianificare il risparmio.'}
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  id="split12"
                  checked={split12Months}
                  onChange={(e) => setSplit12Months(e.target.checked)}
                  className={`w-5 h-5 rounded-md shrink-0 cursor-pointer mt-1 ${
                    type === 'expense'
                      ? 'text-rose-600 focus:ring-rose-500'
                      : 'text-emerald-600 focus:ring-emerald-500'
                  }`}
                />
              </div>

              {split12Months && (
                <div
                  className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${
                    type === 'expense'
                      ? 'border-rose-200 dark:border-rose-800/80'
                      : 'border-emerald-200 dark:border-emerald-800/80'
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      type === 'expense'
                        ? 'text-rose-800 dark:text-rose-300'
                        : 'text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {type === 'expense' ? 'Quota mensile di spesa:' : 'Quota mensile di entrata:'}
                  </span>
                  <span
                    className={`font-extrabold text-sm ${
                      type === 'expense'
                        ? 'text-rose-900 dark:text-rose-200'
                        : 'text-emerald-900 dark:text-emerald-200'
                    }`}
                  >
                    €{monthlyInstallment} / mese
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Quick Suggestions Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Suggeriti per questa categoria:
              </span>
              <button
                type="button"
                onClick={() => onOpenCategoryManager?.('suggestions', category)}
                className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Gestisci suggeriti ›
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setDescription(sug)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    description === sug
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {sug}
                </button>
              ))}

              {/* Inline Add Suggestion Button */}
              {isAddingInlineSuggestion ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Nuovo suggerito..."
                    value={inlineSuggestionInput}
                    onChange={(e) => setInlineSuggestionInput(e.target.value)}
                    autoFocus
                    className="text-xs px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-emerald-500 text-slate-900 dark:text-slate-100 w-32 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (inlineSuggestionInput.trim()) {
                        onAddSuggestion?.(category, inlineSuggestionInput.trim());
                        setDescription(inlineSuggestionInput.trim());
                        setInlineSuggestionInput('');
                      }
                      setIsAddingInlineSuggestion(false);
                    }}
                    className="p-1 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                    title="Conferma suggerito"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingInlineSuggestion(false);
                      setInlineSuggestionInput('');
                    }}
                    className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs"
                    title="Annulla"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingInlineSuggestion(true)}
                  className="text-xs px-2 py-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:border-emerald-500 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Suggerito</span>
                </button>
              )}
            </div>

            {/* If user typed a custom description that is not yet in suggestions, offer 1-click save */}
            {description.trim().length > 2 &&
              !suggestions.includes(description.trim()) && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onAddSuggestion?.(category, description.trim());
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-semibold flex items-center gap-1 hover:bg-amber-100 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Salva &quot;{description.trim()}&quot; nei suggeriti veloci</span>
                  </button>
                </div>
              )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Descrizione / Oggetto
            </label>
            <input
              type="text"
              placeholder="es. Stipendio, 14esima, Premio aziendale, Assegno INPS, Rimborso 730..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Date & Payer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Data {split12Months ? 'di Riferimento' : ''}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Intestato a / Pagato da
              </label>
              <select
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="Famiglia">Famiglia (Conto comune)</option>
                <option value="Andrea">Andrea (dreiu89)</option>
                <option value="Partner">Partner</option>
                <option value="INPS / Datore">INPS / Datore lavoro</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Note aggiuntive (opzionale)
            </label>
            <input
              type="text"
              placeholder="es. Busta paga luglio, credito 730/2026..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
              }`}
            >
              <Check className="w-5 h-5" />
              {editingTransaction
                ? 'Salva Modifiche'
                : split12Months
                ? `Crea 12 Quote Mensili (€${monthlyInstallment}/m)`
                : type === 'expense'
                ? 'Aggiungi Spesa'
                : 'Aggiungi Entrata'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
