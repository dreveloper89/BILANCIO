import { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  AlertTriangle,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { DriveSyncStatus, Transaction, FamilyBudgetData } from '../types';
import { generateBudgetCSV, triggerDownload, DRIVE_FILE_NAME } from '../services/drive';

interface DriveSyncViewProps {
  syncStatus: DriveSyncStatus;
  budgetData: FamilyBudgetData;
  isSyncing: boolean;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
  onSyncToDrive: () => Promise<void>;
  onRestoreFromDriveRequest: () => void;
  onToggleAutoSync: () => void;
  onOpenDomainHelp?: () => void;
  onOpenDeleteModal: () => void;
}

export function DriveSyncView({
  syncStatus,
  budgetData,
  isSyncing,
  onLogin,
  onLogout,
  onSyncToDrive,
  onRestoreFromDriveRequest,
  onToggleAutoSync,
  onOpenDomainHelp,
  onOpenDeleteModal,
}: DriveSyncViewProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const csvContent = generateBudgetCSV(budgetData.transactions);
      const filename = `bilancio_famigliare_${new Date().toISOString().split('T')[0]}.csv`;
      triggerDownload(csvContent, filename, 'text/csv');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(budgetData, null, 2);
    const filename = `backup_bilancio_famigliare_${new Date().toISOString().split('T')[0]}.json`;
    triggerDownload(jsonContent, filename, 'application/json');
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Account Google Drive Card */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Sincronizzazione Google Drive
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Archiviazione sicura per la tua famiglia
              </p>
            </div>
          </div>

          {syncStatus.userEmail && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connesso
            </span>
          )}
        </div>

        {/* Not Logged In State */}
        {!syncStatus.userEmail ? (
          <div
            style={{ backgroundColor: '#0e2845' }}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-center space-y-3"
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              Collega il tuo account Google (<strong>dreiu89@gmail.com</strong>) per salvare e sincronizzare in tempo reale tutte le entrate, uscite e categorie di spesa su Google Drive.
            </p>

            {/* Official Google Sign-In Button */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={onLogin}
                disabled={isSyncing}
                style={{ backgroundColor: '#0d1119' }}
                className="inline-flex items-center justify-center gap-3 px-5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:shadow cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>Accedi con Google (dreiu89@gmail.com)</span>
              </button>
            </div>

            {onOpenDomainHelp && (
              <div className="pt-1 flex justify-center">
                <button
                  type="button"
                  onClick={onOpenDomainHelp}
                  className="inline-flex items-center gap-1.5 text-[11px] text-sky-300 hover:text-sky-200 hover:underline transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Errore <code>auth/unauthorized-domain</code>? Clicca qui per la guida</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Logged In State */
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {syncStatus.userPhoto ? (
                  <img
                    src={syncStatus.userPhoto}
                    alt={syncStatus.userName || 'Utente'}
                    className="w-10 h-10 rounded-full border border-emerald-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                    {syncStatus.userName ? syncStatus.userName.charAt(0) : 'D'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {syncStatus.userName || 'Account Google'}
                  </p>
                  <p className="text-xs font-mono text-emerald-800 dark:text-emerald-300 truncate">
                    {syncStatus.userEmail}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                title="Disconnetti account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Sync Status Details */}
            <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Ultima Sincronizzazione:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {syncStatus.lastSyncedAt
                    ? new Date(syncStatus.lastSyncedAt).toLocaleString('it-IT')
                    : 'Non ancora eseguita'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">File su Drive:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                  {DRIVE_FILE_NAME}
                </span>
              </div>
            </div>

            {/* Sync Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onSyncToDrive}
                disabled={isSyncing}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {isSyncing ? 'Salvataggio in corso...' : 'Salva ORA su Google Drive'}
              </button>

              <button
                type="button"
                onClick={onRestoreFromDriveRequest}
                disabled={isSyncing}
                className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-sky-500" />
                Scarica / Ripristina da Drive
              </button>
            </div>

            {/* Auto-sync Switch */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Sincronizzazione automatica
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Salva le nuove voci su Google Drive istantaneamente
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleAutoSync}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                  syncStatus.autoSyncEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    syncStatus.autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Export & Local Backup Options */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Esportazione e Backup Locale
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Puoi anche scaricare i tuoi dati in formato leggibile per fogli di calcolo Excel / Google Sheets o come backup JSON.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition-colors"
          >
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Esporta CSV / Excel</p>
              <p className="text-[10px] text-slate-500">Apribile in Google Sheets</p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition-colors"
          >
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 shrink-0">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Backup Completo JSON</p>
              <p className="text-[10px] text-slate-500">Archivio completo dati</p>
            </div>
          </button>
        </div>
      </div>

      {/* Security & Workspace Permission notice */}
      <div
        style={{ backgroundColor: '#0e2845' }}
        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          I tuoi dati finanziari vengono salvati in forma privata esclusivamente nel tuo spazio Google Drive (<code>{DRIVE_FILE_NAME}</code>) e nella memoria locale del tuo dispositivo. L&apos;applicazione accede solo al file creato con il tuo consenso.
        </p>
      </div>

      {/* Danger Zone: Data Deletion with Security Code */}
      <div className="bg-rose-50/80 dark:bg-rose-950/30 rounded-2xl p-5 border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <Trash2 className="w-4 h-4 shrink-0" />
          <h3 className="text-sm font-bold">Zona Pericolo: Eliminazione Dati</h3>
        </div>
        <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
          Cancella tutte le transazioni memorizzate e resetta l&apos;archivio. Per sicurezza ed evitare cancellazioni accidentali, l&apos;operazione richiede l&apos;inserimento del codice di sicurezza associato a <strong className="font-semibold text-rose-950 dark:text-rose-200">dreiu89@gmail.com</strong>.
        </p>

        <button
          type="button"
          onClick={onOpenDeleteModal}
          className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Elimina tutti i dati (con codice di sicurezza)</span>
        </button>
      </div>
    </div>
  );
}
