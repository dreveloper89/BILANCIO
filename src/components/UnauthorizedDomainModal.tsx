import { useState } from 'react';
import { Globe, Copy, Check, ExternalLink, ShieldAlert, X } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface UnauthorizedDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

export function UnauthorizedDomainModal({
  isOpen,
  onClose,
  onRetry,
}: UnauthorizedDomainModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseSettingsUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                Dominio non autorizzato su Firebase
              </h3>
              <p className="text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold">
                auth/unauthorized-domain
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanation */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            Per motivi di sicurezza, Firebase Authentication consente l&apos;accesso con Google solo dai domini web esplicitamente registrati nelle impostazioni del progetto.
          </p>

          {/* Current Domain Box */}
          <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Dominio attuale da autorizzare:
            </div>
            <div className="flex items-center justify-between gap-2">
              <code className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 break-all select-all">
                {currentDomain}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copiato!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copia</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Steps to resolve */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 p-3.5 rounded-xl space-y-2">
            <p className="font-bold text-xs text-amber-900 dark:text-amber-200">
              Come risolvere in 1 minuto (senza ricompilare):
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-amber-800 dark:text-amber-300 leading-normal">
              <li>
                Apri la console Firebase nel browser (progetto <strong>{firebaseConfig.projectId}</strong>).
              </li>
              <li>
                Vai nella sezione <strong>Authentication</strong> &gt; <strong>Settings (Impostazioni)</strong>.
              </li>
              <li>
                Scorri fino al riquadro <strong>Authorized domains (Domini autorizzati)</strong>.
              </li>
              <li>
                Clicca su <strong>Add domain (Aggiungi dominio)</strong> e incolla{' '}
                <code className="font-mono font-bold text-amber-900 dark:text-amber-100">{currentDomain}</code>.
              </li>
              <li>
                Clicca <strong>Aggiungi</strong> per salvare.
              </li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <a
            href={firebaseSettingsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-xs"
          >
            <span>Apri Console Firebase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="w-full sm:w-auto flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Chiudi
            </button>
            {onRetry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRetry();
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              >
                Riprova Accesso
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
