import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  FamilyBudgetData,
  Transaction,
  DriveSyncStatus,
  TransactionCategory,
} from './types';
import {
  loadLocalBudgetData,
  saveLocalBudgetData,
  getAllAvailableMonths,
  calculateMonthStats,
  calculateAverageStats,
  formatMonthKey,
  splitIncomeOver12Months,
  splitExpenseOver12Months,
  DEFAULT_USER_EMAIL,
} from './services/storage';
import {
  initAuth,
  googleSignIn,
  logout as authLogout,
  getAccessToken,
} from './services/auth';
import {
  findBudgetFileOnDrive,
  downloadBudgetFileFromDrive,
  saveBudgetFileToDrive,
} from './services/drive';

import { Header } from './components/Header';
import { BottomNav, type NavTab } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { MonthlyView } from './components/MonthlyView';
import { AveragesView } from './components/AveragesView';
import { DriveSyncView } from './components/DriveSyncView';
import { TransactionModal } from './components/TransactionModal';
import { ConfirmModal } from './components/ConfirmModal';
import { MonthSelectorModal } from './components/MonthSelectorModal';

export default function App() {
  const [budgetData, setBudgetData] = useState<FamilyBudgetData>(() => loadLocalBudgetData());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available months
  const availableMonths = useMemo(() => {
    return getAllAvailableMonths(budgetData.transactions);
  }, [budgetData.transactions]);

  // Selected month key (e.g. "2026-10")
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const months = getAllAvailableMonths(budgetData.transactions);
    return months.includes(currentKey) ? currentKey : months[0] || currentKey;
  });

  // Google Drive Sync state
  const [syncStatus, setSyncStatus] = useState<DriveSyncStatus>({
    status: 'idle',
    lastSyncedAt: null,
    fileId: null,
    fileName: 'risparmio_famigliare_dati.json',
    userEmail: null,
    userName: null,
    userPhoto: null,
    errorMessage: null,
    autoSyncEnabled: true,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Destructive Confirm Dialog state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Auth initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setSyncStatus((prev) => ({
          ...prev,
          userEmail: user.email || DEFAULT_USER_EMAIL,
          userName: user.displayName || user.email?.split('@')[0] || 'Utente',
          userPhoto: user.photoURL,
        }));
      },
      () => {
        setSyncStatus((prev) => ({
          ...prev,
          userEmail: null,
          userName: null,
          userPhoto: null,
        }));
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Save changes to localStorage whenever budgetData updates
  const updateBudgetData = useCallback((updater: (prev: FamilyBudgetData) => FamilyBudgetData) => {
    setBudgetData((prev) => {
      const next = updater(prev);
      saveLocalBudgetData(next);
      return next;
    });
  }, []);

  // Sync with Drive logic
  const performDriveSync = useCallback(
    async (dataToSync: FamilyBudgetData) => {
      let token = await getAccessToken();
      if (!token) {
        // Not authenticated with active token, will prompt when user clicks sync button
        return;
      }

      setIsSyncing(true);
      setSyncStatus((prev) => ({ ...prev, status: 'syncing' }));

      try {
        const result = await saveBudgetFileToDrive(token, dataToSync, syncStatus.fileId);
        setSyncStatus((prev) => ({
          ...prev,
          status: 'synced',
          fileId: result.fileId,
          lastSyncedAt: result.modifiedTime,
          errorMessage: null,
        }));
        showToast('Sincronizzato con Google Drive!');
      } catch (err: any) {
        console.error('Drive sync failed:', err);
        setSyncStatus((prev) => ({
          ...prev,
          status: 'error',
          errorMessage: err.message,
        }));
        showToast(`Errore sync Drive: ${err.message || 'Riprova'}`);
      } finally {
        setIsSyncing(false);
      }
    },
    [syncStatus.fileId]
  );

  // Google Login Action
  const handleGoogleLogin = async () => {
    setIsSyncing(true);
    try {
      const authResult = await googleSignIn(DEFAULT_USER_EMAIL);
      if (authResult) {
        setSyncStatus((prev) => ({
          ...prev,
          userEmail: authResult.user.email || DEFAULT_USER_EMAIL,
          userName: authResult.user.displayName || 'Andrea',
          userPhoto: authResult.user.photoURL,
        }));
        showToast(`Accesso effettuato (${authResult.user.email})`);

        // Check if there is an existing file on Drive
        const existing = await findBudgetFileOnDrive(authResult.accessToken);
        if (existing) {
          setSyncStatus((prev) => ({
            ...prev,
            fileId: existing.id,
            lastSyncedAt: existing.modifiedTime || new Date().toISOString(),
          }));
        } else {
          // Upload current initial data
          await performDriveSync(budgetData);
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      showToast(`Accesso non completato: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Google Logout Action
  const handleGoogleLogout = async () => {
    await authLogout();
    setSyncStatus((prev) => ({
      ...prev,
      userEmail: null,
      userName: null,
      userPhoto: null,
      status: 'idle',
    }));
    showToast('Disconnesso da Google Drive');
  };

  // Manual Trigger Sync To Drive
  const handleManualSync = async () => {
    const token = await getAccessToken();
    if (!token) {
      await handleGoogleLogin();
    } else {
      await performDriveSync(budgetData);
    }
  };

  // Restore From Drive Action (Destructive confirmation required!)
  const handleRestoreFromDriveRequest = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Ripristina dati da Google Drive',
      message:
        'Questa operazione scaricherà l\'archivio da Google Drive e sostituirà i dati locali correnti. Vuoi procedere?',
      confirmLabel: 'Ripristina e Sostituisci',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmConfig((c) => ({ ...c, isLoading: true }));
        try {
          const token = await getAccessToken();
          if (!token) {
            throw new Error('Effettua prima l\'accesso con Google Drive');
          }
          const driveFile = await findBudgetFileOnDrive(token);
          if (!driveFile) {
            throw new Error('Nessun file di bilancio trovato sul tuo Google Drive.');
          }
          const remoteData = await downloadBudgetFileFromDrive(token, driveFile.id);
          if (remoteData && remoteData.transactions) {
            updateBudgetData(() => remoteData);
            setSyncStatus((prev) => ({
              ...prev,
              fileId: driveFile.id,
              lastSyncedAt: new Date().toISOString(),
              status: 'synced',
            }));
            showToast('Dati ripristinati con successo da Google Drive!');
          }
        } catch (err: any) {
          console.error('Ripristino fallito:', err);
          showToast(`Errore ripristino: ${err.message}`);
        } finally {
          setConfirmConfig((c) => ({ ...c, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  // Save Transaction (Add or Edit)
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    existingId?: string,
    splitOver12Months?: boolean
  ) => {
    let updatedData: FamilyBudgetData | null = null;

    updateBudgetData((prev) => {
      let newTransactions: Transaction[];
      if (existingId) {
        newTransactions = prev.transactions.map((t) =>
          t.id === existingId
            ? { ...t, ...txData, updatedAt: Date.now() }
            : t
        );
      } else if (splitOver12Months) {
        if (txData.type === 'income') {
          const installments = splitIncomeOver12Months(txData, 2026);
          newTransactions = [...installments, ...prev.transactions];
        } else {
          const installments = splitExpenseOver12Months(txData, 2026);
          newTransactions = [...installments, ...prev.transactions];
        }
      } else {
        const newTx: Transaction = {
          ...txData,
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: Date.now(),
        };
        newTransactions = [newTx, ...prev.transactions];
      }

      updatedData = {
        ...prev,
        transactions: newTransactions,
        updatedAt: new Date().toISOString(),
      };
      return updatedData;
    });

    if (splitOver12Months) {
      showToast(
        txData.type === 'expense'
          ? `Spesa spalmata sui 12 mesi (€${(txData.amount / 12).toFixed(2)}/mese da Gen a Dic)`
          : `Entrata divisa sui 12 mesi (€${(txData.amount / 12).toFixed(2)}/mese da Gen a Dic)`
      );
    } else {
      showToast(existingId ? 'Voce modificata' : 'Nuova voce aggiunta');
    }

    // Auto-sync to Drive if connected and enabled
    if (updatedData && syncStatus.autoSyncEnabled && syncStatus.userEmail) {
      performDriveSync(updatedData);
    }
  };

  // Delete Transaction (Destructive confirmation required!)
  const handleDeleteTransaction = (tx: Transaction) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Elimina voce di spesa/entrata',
      message: `Sei sicuro di voler eliminare definitivamente "${tx.description}" (${tx.amount.toFixed(2)}€)? Questa azione non può essere annullata.`,
      confirmLabel: 'Elimina Voce',
      isDestructive: true,
      onConfirm: () => {
        let updatedData: FamilyBudgetData | null = null;
        updateBudgetData((prev) => {
          const newTransactions = prev.transactions.filter((t) => t.id !== tx.id);
          updatedData = {
            ...prev,
            transactions: newTransactions,
            updatedAt: new Date().toISOString(),
          };
          return updatedData;
        });

        setConfirmConfig((c) => ({ ...c, isOpen: false }));
        showToast('Voce eliminata');

        if (updatedData && syncStatus.autoSyncEnabled && syncStatus.userEmail) {
          performDriveSync(updatedData);
        }
      },
    });
  };

  // Stats
  const currentMonthStats = useMemo(() => {
    return calculateMonthStats(budgetData.transactions, selectedMonth);
  }, [budgetData.transactions, selectedMonth]);

  const averageStats = useMemo(() => {
    return calculateAverageStats(budgetData.transactions);
  }, [budgetData.transactions]);

  const allMonthStats = useMemo(() => {
    return availableMonths.map((m) => calculateMonthStats(budgetData.transactions, m));
  }, [budgetData.transactions, availableMonths]);

  const recentTransactions = useMemo(() => {
    return budgetData.transactions
      .filter((t) => t.date.startsWith(selectedMonth))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [budgetData.transactions, selectedMonth]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30">
      {/* Mobile-centric container with safe layout on desktop */}
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-900 min-h-screen shadow-xl border-x border-slate-200/60 dark:border-slate-800/60">
        {/* Top Header */}
        <Header
          currentMonthName={formatMonthKey(selectedMonth)}
          onOpenMonthSelector={() => setIsMonthSelectorOpen(true)}
          syncStatus={syncStatus}
          onSyncClick={() => {
            if (!syncStatus.userEmail) {
              setCurrentTab('drive');
            } else {
              handleManualSync();
            }
          }}
          onNewTransaction={() => {
            setEditingTransaction(null);
            setIsTransactionModalOpen(true);
          }}
        />

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="sticky top-15 z-50 px-4 py-1.5 animate-in slide-in-from-top duration-200">
            <div className="bg-slate-900/90 dark:bg-emerald-950/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-lg border border-slate-700 dark:border-emerald-700/60 flex items-center justify-between">
              <span>{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white text-xs ml-3"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content Views */}
        <main className="p-4 flex-1">
          {currentTab === 'dashboard' && (
            <DashboardView
              currentStats={currentMonthStats}
              averageStats={averageStats}
              recentTransactions={recentTransactions}
              onViewAllMonths={() => setCurrentTab('months')}
              onViewAverages={() => setCurrentTab('averages')}
              onNewTransaction={() => {
                setEditingTransaction(null);
                setIsTransactionModalOpen(true);
              }}
              onSelectTransaction={(tx) => {
                setEditingTransaction(tx);
                setIsTransactionModalOpen(true);
              }}
            />
          )}

          {currentTab === 'months' && (
            <MonthlyView
              availableMonths={availableMonths}
              selectedMonth={selectedMonth}
              onSelectMonth={setSelectedMonth}
              monthStats={currentMonthStats}
              transactions={budgetData.transactions}
              onNewTransaction={() => {
                setEditingTransaction(null);
                setIsTransactionModalOpen(true);
              }}
              onEditTransaction={(tx) => {
                setEditingTransaction(tx);
                setIsTransactionModalOpen(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {currentTab === 'averages' && (
            <AveragesView
              averageStats={averageStats}
              allMonthStats={allMonthStats}
              onSelectMonth={(mKey) => {
                setSelectedMonth(mKey);
                setCurrentTab('months');
              }}
            />
          )}

          {currentTab === 'drive' && (
            <DriveSyncView
              syncStatus={syncStatus}
              budgetData={budgetData}
              isSyncing={isSyncing}
              onLogin={handleGoogleLogin}
              onLogout={handleGoogleLogout}
              onSyncToDrive={handleManualSync}
              onRestoreFromDriveRequest={handleRestoreFromDriveRequest}
              onToggleAutoSync={() => {
                setSyncStatus((prev) => ({
                  ...prev,
                  autoSyncEnabled: !prev.autoSyncEnabled,
                }));
                showToast(
                  !syncStatus.autoSyncEnabled
                    ? 'Salvataggio automatico abilitato'
                    : 'Salvataggio automatico disabilitato'
                );
              }}
            />
          )}
        </main>

        {/* Bottom Tab Bar with Action Button */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onNewTransaction={() => {
            setEditingTransaction(null);
            setIsTransactionModalOpen(true);
          }}
        />

        {/* Transaction Create / Edit Modal */}
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => {
            setIsTransactionModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveTransaction}
          editingTransaction={editingTransaction}
          defaultMonthKey={selectedMonth}
        />

        {/* Month Selector Modal */}
        <MonthSelectorModal
          isOpen={isMonthSelectorOpen}
          onClose={() => setIsMonthSelectorOpen(false)}
          availableMonths={availableMonths}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          onAddNewMonth={() => {
            setEditingTransaction(null);
            setIsTransactionModalOpen(true);
          }}
        />

        {/* Mandatory Destructive Action Confirm Modal */}
        <ConfirmModal
          isOpen={confirmConfig.isOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmLabel={confirmConfig.confirmLabel}
          isDestructive={confirmConfig.isDestructive}
          isLoading={confirmConfig.isLoading}
          onConfirm={confirmConfig.onConfirm}
          onCancel={() => setConfirmConfig((c) => ({ ...c, isOpen: false }))}
        />
      </div>
    </div>
  );
}
