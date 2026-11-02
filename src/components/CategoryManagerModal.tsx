import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Trash2,
  Tag,
  Check,
  Sparkles,
  Split,
  FolderPlus,
  HelpCircle,
  FileText,
  BookmarkCheck,
  Search,
} from 'lucide-react';
import {
  CATEGORIES_CONFIG,
  DEFAULT_QUICK_SUGGESTIONS,
  type CategoryInfo,
  type Transaction,
  type TransactionCategory,
} from '../types';
import { CategoryIcon, AVAILABLE_CATEGORY_ICONS } from './CategoryIcon';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCategories: CategoryInfo[];
  customSuggestions: Record<string, string[]>;
  transactions: Transaction[];
  onAddCategory: (category: CategoryInfo) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddSuggestion: (categoryId: string, suggestion: string) => void;
  onRemoveSuggestion: (categoryId: string, suggestion: string) => void;
  initialTab?: 'new' | 'list' | 'suggestions';
  initialSelectedCategoryId?: string;
}

const COLOR_PRESETS = [
  {
    id: 'emerald',
    name: 'Smeraldo',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    previewBg: 'bg-emerald-500',
  },
  {
    id: 'sky',
    name: 'Azzurro',
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10 dark:bg-sky-500/20',
    borderColor: 'border-sky-500/30',
    previewBg: 'bg-sky-500',
  },
  {
    id: 'blue',
    name: 'Blu',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    previewBg: 'bg-blue-600',
  },
  {
    id: 'indigo',
    name: 'Indaco',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    previewBg: 'bg-indigo-500',
  },
  {
    id: 'violet',
    name: 'Viola',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10 dark:bg-violet-500/20',
    borderColor: 'border-violet-500/30',
    previewBg: 'bg-violet-500',
  },
  {
    id: 'pink',
    name: 'Rosa',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10 dark:bg-pink-500/20',
    borderColor: 'border-pink-500/30',
    previewBg: 'bg-pink-500',
  },
  {
    id: 'rose',
    name: 'Corallo / Rosso',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
    borderColor: 'border-rose-500/30',
    previewBg: 'bg-rose-500',
  },
  {
    id: 'amber',
    name: 'Ambra',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    previewBg: 'bg-amber-500',
  },
  {
    id: 'orange',
    name: 'Arancio',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10 dark:bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    previewBg: 'bg-orange-500',
  },
  {
    id: 'teal',
    name: 'Petrolio',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10 dark:bg-teal-500/20',
    borderColor: 'border-teal-500/30',
    previewBg: 'bg-teal-500',
  },
  {
    id: 'cyan',
    name: 'Ciano',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    previewBg: 'bg-cyan-500',
  },
  {
    id: 'lime',
    name: 'Lime',
    color: 'text-lime-600 dark:text-lime-400',
    bgColor: 'bg-lime-500/10 dark:bg-lime-500/20',
    borderColor: 'border-lime-500/30',
    previewBg: 'bg-lime-500',
  },
];

export function CategoryManagerModal({
  isOpen,
  onClose,
  customCategories,
  customSuggestions,
  transactions,
  onAddCategory,
  onDeleteCategory,
  onAddSuggestion,
  onRemoveSuggestion,
  initialTab = 'new',
  initialSelectedCategoryId,
}: CategoryManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'list' | 'suggestions'>(initialTab);

  // New Category State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Dumbbell');
  const [selectedColorPreset, setSelectedColorPreset] = useState(COLOR_PRESETS[0]);
  const [canSplit12Months, setCanSplit12Months] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [formError, setFormError] = useState('');

  // Suggestions Manager State
  const [suggestionCategory, setSuggestionCategory] = useState<string>(
    initialSelectedCategoryId || 'spesa_generica'
  );
  const [newSuggestionInput, setNewSuggestionInput] = useState('');

  // All merged categories
  const allCategories = useMemo(() => {
    const list: CategoryInfo[] = Object.values(CATEGORIES_CONFIG);
    if (customCategories) {
      customCategories.forEach((cat) => {
        if (!list.some((c) => c.id === cat.id)) {
          list.push(cat);
        }
      });
    }
    return list;
  }, [customCategories]);

  // Filtered icons
  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) return AVAILABLE_CATEGORY_ICONS;
    const q = iconSearch.toLowerCase();
    return AVAILABLE_CATEGORY_ICONS.filter(
      (i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
    );
  }, [iconSearch]);

  if (!isOpen) return null;

  // Generate safe slug id from name
  const generateSlug = (text: string) => {
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return `custom_${slug || 'cat'}_${Date.now().toString().slice(-4)}`;
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Inserisci un nome per la categoria.');
      return;
    }

    const id = generateSlug(name);
    const newCategory: CategoryInfo = {
      id,
      name: name.trim(),
      description: description.trim() || 'Spese relative a ' + name.trim(),
      icon: selectedIcon,
      color: selectedColorPreset.color,
      bgColor: selectedColorPreset.bgColor,
      borderColor: selectedColorPreset.borderColor,
      type: 'expense',
      canSplit12Months,
      isCustom: true,
    };

    onAddCategory(newCategory);

    // Reset form
    setName('');
    setDescription('');
    setCanSplit12Months(false);
    setFormError('');
    setActiveTab('list');
  };

  const handleAddSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSuggestionInput.trim();
    if (!clean) return;
    onAddSuggestion(suggestionCategory, clean);
    setNewSuggestionInput('');
  };

  // Get active suggestions for selected category
  const activeSuggestions = useMemo(() => {
    const defaultList = DEFAULT_QUICK_SUGGESTIONS[suggestionCategory] || [];
    const customList = customSuggestions[suggestionCategory] || [];
    // Combine and deduplicate
    return Array.from(new Set([...defaultList, ...customList]));
  }, [suggestionCategory, customSuggestions]);

  // Count transactions per category
  const getTxCount = (catId: string) => {
    return transactions.filter((t) => t.category === catId).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Personalizza Categorie e Suggeriti
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aggiungi nuove categorie di spesa e crea scorciatoie rapide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Chiudi finestra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 p-1.5 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'new'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Nuova Categoria</span>
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'suggestions'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Suggeriti Veloci</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Tutte ({allCategories.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CREATE NEW CATEGORY */}
          {activeTab === 'new' && (
            <form onSubmit={handleCreateCategory} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  {formError}
                </div>
              )}

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Anteprima della categoria:
                </span>
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${selectedColorPreset.bgColor} ${selectedColorPreset.borderColor}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl bg-white dark:bg-slate-900 ${selectedColorPreset.color} shadow-xs shrink-0`}
                    >
                      <CategoryIcon iconName={selectedIcon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {name.trim() || 'Nome Categoria'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {description.trim() || 'Descrizione delle spese'}
                      </p>
                    </div>
                  </div>
                  {canSplit12Months && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                      ÷ 12 mesi
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Description */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nome Categoria <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="es. Animali Domestici, Palestra, Viaggi, Hobby..."
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formError) setFormError('');
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Descrizione (opzionale)
                  </label>
                  <input
                    type="text"
                    placeholder="es. Cibo, veterinario, antiparassitari e accessori per animali"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tema Colore
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                  {COLOR_PRESETS.map((p) => {
                    const isSelected = selectedColorPreset.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedColorPreset(p)}
                        className={`h-9 rounded-xl flex items-center justify-center transition-all ${p.previewBg} ${
                          isSelected
                            ? 'ring-3 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 scale-105'
                            : 'opacity-80 hover:opacity-100 hover:scale-102'
                        }`}
                        title={p.name}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Scegli Icona ({AVAILABLE_CATEGORY_ICONS.length})
                  </label>
                  <div className="relative w-36">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cerca icona..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="w-full pl-7 pr-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-850/50">
                  {filteredIcons.map((ic) => {
                    const isSelected = selectedIcon === ic.id;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setSelectedIcon(ic.id)}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-md scale-105'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        title={ic.name}
                      >
                        <CategoryIcon iconName={ic.id} className="w-4 h-4" />
                        <span className="text-[9px] truncate max-w-full font-medium">
                          {ic.name.split('/')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Split 12 Months Checkbox */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Split className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Consenti ripartizione spesa sui 12 mesi
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Attiva l&apos;opzione ÷ 12 mesi per questa categoria (utile per abbonamenti annuali, assicurazioni o uscite periodiche).
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={canSplit12Months}
                  onChange={(e) => setCanSplit12Months(e.target.checked)}
                  className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-1 shrink-0"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-transform"
              >
                <Plus className="w-5 h-5" />
                <span>Salva Nuova Categoria</span>
              </button>
            </form>
          )}

          {/* TAB 2: MANAGE QUICK SUGGESTIONS */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {/* Category Picker */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Seleziona la Categoria di cui gestire i suggerimenti:
                </label>
                <select
                  value={suggestionCategory}
                  onChange={(e) => setSuggestionCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                >
                  <optgroup label="Categorie di Spesa">
                    {allCategories
                      .filter((c) => c.type === 'expense')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.isCustom ? '⭐ (Personalizzata)' : ''}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Categorie di Entrata">
                    {allCategories
                      .filter((c) => c.type === 'income')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* Add New Suggestion Input */}
              <form onSubmit={handleAddSuggestionSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scrivi nuovo suggerito (es. Danza, Esselunga, Veterinario...)"
                  value={newSuggestionInput}
                  onChange={(e) => setNewSuggestionInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                />
                <button
                  type="submit"
                  disabled={!newSuggestionInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Aggiungi</span>
                </button>
              </form>

              {/* Active Suggestions List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Suggeriti attivi per questa categoria ({activeSuggestions.length}):
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Clicca su un suggerito per rimuoverlo
                  </span>
                </div>

                {activeSuggestions.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400">
                    Nessun suggerito presente. Scrivi un suggerimento sopra per aggiungerlo!
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {activeSuggestions.map((sug) => {
                      const isCustom = (customSuggestions[suggestionCategory] || []).includes(sug);
                      return (
                        <div
                          key={sug}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs group"
                        >
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {sug}
                          </span>
                          {isCustom && (
                            <span className="text-[9px] px-1 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                              Nuovo
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => onRemoveSuggestion(suggestionCategory, sug)}
                            className="p-0.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1"
                            title="Rimuovi questo suggerito"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-300 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  I suggeriti compaiono come pillole rapide quando inserisci o modifichi una spesa nel modulo. Puoi aggiungerne quanti ne desideri per velocizzare l&apos;inserimento!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ALL CATEGORIES LIST */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Elenco di tutte le categorie ({allCategories.length})
                </span>
                <button
                  onClick={() => setActiveTab('new')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crea nuova categoria</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                {allCategories.map((cat) => {
                  const txCount = getTxCount(cat.id);
                  const isCustom = !!cat.isCustom;

                  return (
                    <div
                      key={cat.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-xl ${cat.bgColor} ${cat.color} shrink-0`}
                        >
                          <CategoryIcon category={cat.id} iconName={cat.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {cat.name}
                            </h5>
                            {isCustom ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold uppercase tracking-wide">
                                Personalizzata
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                                Predefinita
                              </span>
                            )}
                            {cat.canSplit12Months && (
                              <span className="text-[9px] px-1 py-0.2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                                ÷ 12 mesi
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {txCount} {txCount === 1 ? 'voce' : 'voci'}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setSuggestionCategory(cat.id);
                            setActiveTab('suggestions');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Gestisci suggeriti per questa categoria"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span className="hidden sm:inline">Suggeriti</span>
                        </button>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  txCount > 0
                                    ? `Attenzione: ci sono ${txCount} transazioni registrate con la categoria "${cat.name}". Verranno spostate in "Altre uscite". Confermi l'eliminazione?`
                                    : `Vuoi davvero eliminare la categoria personalizzata "${cat.name}"?`
                                )
                              ) {
                                onDeleteCategory(cat.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Elimina categoria personalizzata"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
