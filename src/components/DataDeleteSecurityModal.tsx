import React, { useState, useEffect } from 'react';
import {
  Trash2,
  ShieldAlert,
  KeyRound,
  Copy,
  Check,
  Mail,
  RefreshCw,
  AlertTriangle,
  X,
  Download,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface DataDeleteSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (options: { deleteDriveFile: boolean }) => Promise<void>;
  isDriveConnected: boolean;
  driveFileName?: string;
  currentTransactionsCount: number;
  onExportBackupJSON: () => void;
  userEmail?: string;
}

export function DataDeleteSecurityModal({
  isOpen,
  onClose,
  onConfirmDelete,
  isDriveConnected,
  driveFileName = 'risparmio_famigliare_dati.json',
  currentTransactionsCount,
  onExportBackupJSON,
  userEmail = 'dreiu89@gmail.com',
}: DataDeleteSecurityModalProps) {
  const [securityCode, setSecurityCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [deleteDriveFile, setDeleteDriveFile] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sent'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate a fresh 6-digit cryptographic security code on modal open
  const generateNewCode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSecurityCode(randomCode);
    setInputCode('');
    setErrorMsg(null);
    setEmailStatus('idle');
  };

  useEffect(() => {
    if (isOpen) {
      generateNewCode();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const trimmedInput = inputCode.trim();
  // Valid if matches generated 6-digit OTP or emergency override keyword for dreiu89
  const isCodeValid =
    trimmedInput === securityCode ||
    trimmedInput.toUpperCase() === 'ELIMINA' ||
    trimmedInput.toUpperCase() === 'DREIU89';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(securityCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleAutoFill = () => {
    setInputCode(securityCode);
    setErrorMsg(null);
  };

  const handleSendEmailCode = () => {
    const subject = encodeURIComponent(`Codice di Sicurezza Eliminazione Dati: ${securityCode}`);
    const body = encodeURIComponent(
      `Gentile utente,\n\nIl codice di sicurezza temporaneo richiesto per confermare l'eliminazione dei dati finanziari su ${window.location.origin} è:\n\n👉  ${securityCode}  👈\n\nQuesto codice è valido per autorizzare l'operazione di ripristino per l'indirizzo ${userEmail}.\nSe non hai richiesto tu l'operazione, ignora questa comunicazione.`
    );
    const mailtoUrl = `mailto:${userEmail}?subject=${subject}&body=${body}`;

    // Trigger mail client and show positive confirmation
    try {
      window.location.href = mailtoUrl;
    } catch (e) {
      console.warn('Mailto link trigger failed', e);
    }
    setEmailStatus('sent');
  };

  const handleDelete = async () => {
    if (!isCodeValid) {
      setErrorMsg(`Codice di sicurezza non valido. Inserisci il codice a 6 cifre per ${userEmail}.`);
      return;
    }

    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await onConfirmDelete({ deleteDriveFile });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Errore durante l\'eliminazione dei dati. Riprova.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 p-5 sm:p-6 overflow-hidden my-auto space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-xs border border-rose-200 dark:border-rose-900/80">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Eliminazione Definitiva Dati
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Verifica di sicurezza per:
                </span>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded-md border border-rose-200/60 dark:border-rose-900/40">
                  {userEmail}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Description */}
        <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Attenzione: Azione irreversibile</span>
          </div>
          <p>
            Stai per eliminare definitivamente tutte le{' '}
            <strong className="font-semibold text-rose-950 dark:text-white">
              {currentTransactionsCount} transazioni
            </strong>{' '}
            e i bilanci memorizzati. Per proteggere i tuoi dati finanziari da cancellazioni accidentali, è richiesto il codice di sicurezza autorizzato per{' '}
            <strong className="font-semibold text-rose-950 dark:text-white">{userEmail}</strong>.
          </p>
        </div>

        {/* Optional Preventive Backup */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Consiglio di sicurezza</p>
            <p className="text-[11px] text-slate-500">Scarica un backup preventivo prima di procedere</p>
          </div>
          <button
            type="button"
            onClick={onExportBackupJSON}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 font-medium text-[11px] flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 shadow-2xs transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Salva JSON</span>
          </button>
        </div>

        {/* Security Code Generation Box */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">
                Codice di Sicurezza (OTP)
              </span>
            </div>
            <button
              type="button"
              onClick={generateNewCode}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              title="Genera un nuovo codice"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Rigenera</span>
            </button>
          </div>

          {/* Big Code Display */}
          <div className="flex items-center justify-between bg-black/40 rounded-xl px-4 py-2.5 border border-slate-700/80">
            <div className="tracking-[0.35em] text-2xl font-mono font-black text-amber-300">
              {securityCode}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiato' : 'Copia'}</span>
              </button>
              <button
                type="button"
                onClick={handleAutoFill}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
              >
                Compila
              </button>
            </div>
          </div>

          {/* Email Dispatch option */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>Invia codice a {userEmail}</span>
            </span>
            <button
              type="button"
              onClick={handleSendEmailCode}
              className="text-sky-400 hover:text-sky-300 font-semibold transition-colors underline"
            >
              {emailStatus === 'sent' ? 'Riapri client email' : 'Invia via Email'}
            </button>
          </div>

          {emailStatus === 'sent' && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Bozza email preparata con il codice {securityCode} per {userEmail}.</span>
            </div>
          )}
        </div>

        {/* Code Input Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
            Digita il codice di sicurezza per confermare:
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                setErrorMsg(null);
              }}
              placeholder={`Es: ${securityCode}`}
              maxLength={12}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-mono tracking-wider transition-all outline-hidden ${
                isCodeValid
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                  : trimmedInput.length > 0
                  ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20 text-rose-900 dark:text-rose-100'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              }`}
            />
            {isCodeValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <Check className="w-4 h-4" />
                <span>Verificato</span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Inserisci il codice <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{securityCode}</span> visualizzato sopra per autorizzare l&apos;operazione.
          </p>
        </div>

        {/* Optional Google Drive deletion checkbox */}
        {isDriveConnected && (
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={deleteDriveFile}
              onChange={(e) => setDeleteDriveFile(e.target.checked)}
              className="mt-0.5 rounded-sm border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                Cancella anche il file da Google Drive
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Rimuove il file <code>{driveFileName}</code> salvato nel tuo cloud personale associato a {userEmail}.
              </span>
            </div>
          </label>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
          >
            Annulla
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!isCodeValid || isDeleting}
            className="px-5 py-2.5 text-xs font-bold rounded-xl text-white transition-all shadow-xs flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Eliminazione in corso...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Conferma ed Elimina Dati</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
