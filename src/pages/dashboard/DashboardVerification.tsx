import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BadgeCheckIcon,
  Building04Icon,
  CheckmarkCircle01Icon,
  Clock02Icon,
  Alert02Icon,
  Attachment01Icon,
  Cancel01Icon,
  Add01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';
import { api, type ApiResponse } from '../../lib/api';
import { formatNaira } from '../../lib/format';

// ── Types ──────────────────────────────────────────────────────────────────

interface PremiumStatus {
  isServiceProvider: boolean;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  daysUntilExpiry: number | null;
  needsRenewal: boolean;
  canRenew: boolean;
  requiresPayment: boolean;
  monthlyAmount: number;
  autoRenewEnabled: boolean;
  hasSavedPaymentMethod: boolean;
  isVerified: boolean;
}

type BizStatus = 'awaiting_payment' | 'awaiting_documents' | 'pending_review' | 'approved' | 'rejected';

interface BizVerification {
  _id?: string;
  businessName?: string;
  status: BizStatus;
  adminNote?: string | null;
  documents?: Array<{ path: string; filename: string; size?: number }>;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── IndexedDB helpers for persisting files across Paystack redirect ─────────

const IDB_NAME = 'sureplug_biz';
const IDB_STORE = 'pending_docs';

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSaveFiles(files: File[]): Promise<void> {
  try {
    const db = await openIDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(files, 'files');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch { /* ignore */ }
}

async function idbGetFiles(): Promise<File[]> {
  try {
    const db = await openIDB();
    const files = await new Promise<File[]>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get('files');
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => resolve([]);
    });
    db.close();
    return files;
  } catch { return []; }
}

async function idbClearFiles(): Promise<void> {
  try {
    const db = await openIDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete('files');
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
    db.close();
  } catch { /* ignore */ }
}

function Skeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse space-y-3">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-100 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

function Notice({ msg, isError }: { msg: string; isError: boolean }) {
  return (
    <div className={`flex items-start gap-2 mb-5 px-4 py-3 rounded-xl text-sm font-medium ${isError ? 'bg-red-50 text-red-600' : 'bg-[#019B5F]/8 text-[#019B5F]'}`}>
      <HugeiconsIcon icon={isError ? Alert02Icon : CheckmarkCircle01Icon} size={15} color="currentColor" strokeWidth={2.5} className="shrink-0 mt-0.5" />
      {msg}
    </div>
  );
}

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
        enabled ? 'bg-[#019B5F]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function DashboardVerification() {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Provider verification
  const [pv, setPv] = useState<PremiumStatus | null>(null);
  const [pvLoading, setPvLoading] = useState(true);
  const [pvError, setPvError] = useState('');
  const [pvInitLoading, setPvInitLoading] = useState(false);
  const [pvInitError, setPvInitError] = useState('');
  const [pvRenewLoading, setPvRenewLoading] = useState(false);
  const [pvRenewError, setPvRenewError] = useState('');
  const [pvAutoRenewLoading, setPvAutoRenewLoading] = useState(false);
  const [pvAutoRenewError, setPvAutoRenewError] = useState('');
  const [pvConfirm, setPvConfirm] = useState<{ msg: string; isError: boolean } | null>(null);

  // Business verification
  const [biz, setBiz] = useState<BizVerification | null>(null);
  const [bizLoading, setBizLoading] = useState(true);
  const [bizError, setBizError] = useState('');
  const [bizInitLoading, setBizInitLoading] = useState(false);
  const [bizInitError, setBizInitError] = useState('');
  const [bizConfirm, setBizConfirm] = useState<{ msg: string; isError: boolean } | null>(null);

  // Doc upload
  const [businessName, setBusinessName] = useState('');
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────

  const fetchPv = useCallback(async () => {
    setPvError('');
    try {
      const res = await api.get<ApiResponse<PremiumStatus>>('/verification/status', true);
      setPv(res.data);
    } catch (err) {
      setPvError(err instanceof Error ? err.message : 'Failed to load status');
    } finally {
      setPvLoading(false);
    }
  }, []);

  const fetchBiz = useCallback(async () => {
    setBizError('');
    try {
      const res = await api.get<ApiResponse<BizVerification | null>>('/business-verification/status', true);
      setBiz(res.data);
    } catch (err) {
      setBizError(err instanceof Error ? err.message : 'Failed to load status');
      setBiz(null);
    } finally {
      setBizLoading(false);
    }
  }, []);

  // ── Paystack redirect ──────────────────────────────────────────────────

  useEffect(() => {
    const saved = sessionStorage.getItem('sp_biz_name');
    if (saved) setBusinessName(saved);

    const reference = searchParams.get('reference') ?? searchParams.get('trxref');
    if (reference) {
      setSearchParams({}, { replace: true });
      const isBiz = reference.startsWith('biz_verify_');

      if (isBiz) {
        setBizLoading(true);
        api.get<ApiResponse<{ status: string }>>(`/business-verification/confirm/${reference}`, true)
          .then(async () => {
            const savedName = sessionStorage.getItem('sp_biz_name') ?? '';
            const savedFiles = await idbGetFiles();
            if (savedFiles.length && savedName) {
              setBizConfirm({ msg: 'Payment confirmed. Submitting your documents…', isError: false });
              const form = new FormData();
              form.append('businessName', savedName);
              savedFiles.forEach((f) => form.append('documents', f));
              try {
                const submitRes = await api.post<ApiResponse<BizVerification>>('/business-verification/submit', form, true);
                setBiz(submitRes.data);
                sessionStorage.removeItem('sp_biz_name');
                await idbClearFiles();
                setBizConfirm({ msg: 'Documents submitted! We\'ll review your application within 1 to 3 business days.', isError: false });
              } catch {
                if (savedName) setBusinessName(savedName);
                if (savedFiles.length) setDocFiles(savedFiles);
                setBizConfirm({ msg: 'Payment confirmed. Please review and resubmit your documents below.', isError: false });
              }
            } else {
              if (savedName) setBusinessName(savedName);
              setBizConfirm({ msg: 'Payment confirmed. Please upload your documents below.', isError: false });
            }
          })
          .catch((err) => setBizConfirm({ msg: err instanceof Error ? err.message : 'Could not confirm payment.', isError: true }))
          .finally(() => { fetchPv(); fetchBiz(); });
      } else {
        setPvLoading(true);
        api.get<ApiResponse<{ isPremium: boolean; premiumExpiresAt: string; autoRenewEnabled: boolean }>>(
          `/verification/confirm/${reference}`, true
        )
          .then((res) => {
            updateUser({
              isPremium: res.data.isPremium,
              premiumExpiresAt: res.data.premiumExpiresAt,
              autoRenewEnabled: res.data.autoRenewEnabled,
            });
            setPvConfirm({
              msg: res.data.autoRenewEnabled
                ? 'Premium activated! Auto-renewal is on — your listing priority renews each month.'
                : 'Premium activated! Your services now appear first in search results.',
              isError: false,
            });
          })
          .catch((err) => setPvConfirm({ msg: err instanceof Error ? err.message : 'Could not confirm payment.', isError: true }))
          .finally(() => { fetchPv(); fetchBiz(); });
      }
    } else {
      fetchPv();
      fetchBiz();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Provider actions ───────────────────────────────────────────────────

  const pvInit = async () => {
    setPvInitLoading(true);
    setPvInitError('');
    try {
      const res = await api.post<ApiResponse<{ authorization_url: string }>>('/verification/initialize', { callbackUrl: `${window.location.origin}/dashboard/verification` }, true);
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setPvInitError(err instanceof Error ? err.message : 'Failed to initialize payment');
      setPvInitLoading(false);
    }
  };

  const pvRenew = async () => {
    setPvRenewLoading(true);
    setPvRenewError('');
    try {
      const res = await api.post<ApiResponse<{ authorization_url: string }>>('/verification/renew', { callbackUrl: `${window.location.origin}/dashboard/verification` }, true);
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setPvRenewError(err instanceof Error ? err.message : 'Failed to initialize renewal');
      setPvRenewLoading(false);
    }
  };

  const pvToggleAutoRenew = async (enabled: boolean) => {
    setPvAutoRenewLoading(true);
    setPvAutoRenewError('');
    try {
      const res = await api.patch<ApiResponse<{ autoRenewEnabled: boolean }>>('/verification/auto-renew', { enabled }, true);
      updateUser({ autoRenewEnabled: res.data.autoRenewEnabled });
      setPv((prev) => prev ? { ...prev, autoRenewEnabled: res.data.autoRenewEnabled } : prev);
    } catch (err) {
      setPvAutoRenewError(err instanceof Error ? err.message : 'Failed to update auto-renewal');
    } finally {
      setPvAutoRenewLoading(false);
    }
  };

  // ── Business actions ───────────────────────────────────────────────────

  const bizInit = async () => {
    if (!businessName.trim()) { setBizInitError('Please enter your business name.'); return; }
    if (!docFiles.length) { setBizInitError('Please upload at least one document.'); return; }
    setBizInitLoading(true);
    setBizInitError('');
    try {
      sessionStorage.setItem('sp_biz_name', businessName.trim());
      await idbSaveFiles(docFiles);
      const res = await api.post<ApiResponse<{ authorization_url: string }>>('/business-verification/initialize', { businessName: businessName.trim(), callbackUrl: `${window.location.origin}/dashboard/verification` }, true);
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setBizInitError(err instanceof Error ? err.message : 'Failed to initialize payment');
      setBizInitLoading(false);
    }
  };

  const submitDocs = async (e: FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) { setSubmitError('Please enter your business name.'); return; }
    if (!docFiles.length) { setSubmitError('Please upload at least one document.'); return; }
    setSubmitLoading(true);
    setSubmitError('');
    try {
      const form = new FormData();
      form.append('businessName', businessName.trim());
      docFiles.forEach((f) => form.append('documents', f));
      const res = await api.post<ApiResponse<BizVerification>>('/business-verification/submit', form, true);
      setBiz(res.data);
      sessionStorage.removeItem('sp_biz_name');
      void idbClearFiles();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit documents');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])].slice(0, 5));
    e.target.value = '';
  };

  const removeFile = (i: number) => setDocFiles((prev) => prev.filter((_, idx) => idx !== i));

  // ── Provider section UI ────────────────────────────────────────────────

  const renderPv = () => {
    if (pvLoading) return <Skeleton />;
    if (pvError) return <div className="bg-white rounded-2xl border border-red-100 p-5 text-sm text-red-500">{pvError}</div>;
    if (!pv?.isServiceProvider) return null;

    const { requiresPayment, isPremium, canRenew, needsRenewal, daysUntilExpiry, premiumExpiresAt, monthlyAmount, autoRenewEnabled, hasSavedPaymentMethod } = pv;

    if (requiresPayment) {
      return (
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="relative bg-[#0a1810] px-6 pt-7 pb-6 overflow-hidden">
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-[#019B5F]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 left-8 w-36 h-36 rounded-full bg-[#019B5F]/8 blur-2xl pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#019B5F]/20 ring-1 ring-[#019B5F]/40 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={BadgeCheckIcon} size={26} color="#4ade80" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-300/80 uppercase tracking-widest mb-1.5">Premium subscription</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[28px] font-bold text-white leading-none tracking-tight">{formatNaira(monthlyAmount)}</span>
                  <span className="text-sm text-white/35 font-medium">/month</span>
                </div>
                <p className="text-xs text-white/30 mt-1">Cancel anytime · Auto-renews monthly</p>
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-5">
            {pvConfirm && <Notice msg={pvConfirm.msg} isError={pvConfirm.isError} />}
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Get priority placement in search and browse results with a monthly Premium subscription.
            </p>
            <div className="mb-5">
              {[
                'Appear first in service search results',
                'Premium indicator on your profile and listings',
                'Higher visibility to customers browsing taskers',
              ].map((item, i, arr) => (
                <div key={item} className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="w-5 h-5 rounded-full bg-[#019B5F]/10 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={11} color="#019B5F" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
            {pvInitError && <p className="text-sm text-red-500 mb-3">{pvInitError}</p>}
            <button onClick={pvInit} disabled={pvInitLoading} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#019B5F] text-white text-sm font-semibold hover:bg-[#017a4c] transition-colors disabled:opacity-60">
              {pvInitLoading ? 'Redirecting…' : `Subscribe for ${formatNaira(monthlyAmount)}/mo`}
              {!pvInitLoading && <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" strokeWidth={2.5} />}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2.5">Pay with a reusable card to enable automatic monthly renewal</p>
          </div>
        </div>
      );
    }

    if (needsRenewal) {
      return (
        <div className="rounded-2xl overflow-hidden border border-red-950/20">
          <div className="relative bg-gradient-to-br from-[#1c0808] to-[#140606] px-6 py-6 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 ring-1 ring-red-400/25 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={BadgeCheckIcon} size={22} color="#f87171" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-semibold text-white">Premium</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500 text-white uppercase tracking-wider">Expired</span>
                </div>
                <p className="text-xs text-white/40">Your premium listing boost is no longer active</p>
              </div>
            </div>
          </div>
          <div className="bg-white px-6 py-5">
            {pvConfirm && <Notice msg={pvConfirm.msg} isError={pvConfirm.isError} />}
            <p className="text-sm text-gray-500 mb-4">Your Premium subscription has expired. Renew to restore priority placement in search results.</p>
            {pvRenewError && <p className="text-sm text-red-500 mb-3">{pvRenewError}</p>}
            <button onClick={pvRenew} disabled={pvRenewLoading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#019B5F] text-white text-sm font-semibold hover:bg-[#017a4c] transition-colors disabled:opacity-60">
              {pvRenewLoading ? 'Redirecting…' : `Renew Premium for ${formatNaira(monthlyAmount)}/mo`}
              {!pvRenewLoading && <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      );
    }

    if (isPremium && canRenew) {
      return (
        <div className="rounded-2xl overflow-hidden border border-amber-900/20">
          <div className="relative bg-gradient-to-br from-[#1a1000] to-[#120c00] px-6 py-6 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/15 ring-1 ring-amber-400/25 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={BadgeCheckIcon} size={22} color="#fbbf24" strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-semibold text-white">Premium</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white uppercase tracking-wider">Expiring</span>
                </div>
                  {premiumExpiresAt && (
                    <p className="text-xs text-white/40">
                      {new Date(premiumExpiresAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              {daysUntilExpiry !== null && (
                <div className="text-right shrink-0">
                  <p className="text-3xl font-bold text-white leading-none">{daysUntilExpiry}</p>
                  <p className="text-[10px] text-white/35 mt-1 uppercase tracking-wide">day{daysUntilExpiry !== 1 ? 's' : ''} left</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white px-6 py-5">
            {pvConfirm && <Notice msg={pvConfirm.msg} isError={pvConfirm.isError} />}
            <p className="text-sm text-gray-500 mb-4">Your Premium subscription is expiring soon. Renew now to keep priority placement without interruption.</p>
            {pvRenewError && <p className="text-sm text-red-500 mb-3">{pvRenewError}</p>}
            <button onClick={pvRenew} disabled={pvRenewLoading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#019B5F] text-white text-sm font-semibold hover:bg-[#017a4c] transition-colors disabled:opacity-60">
              {pvRenewLoading ? 'Redirecting…' : `Renew now for ${formatNaira(monthlyAmount)}/mo`}
              {!pvRenewLoading && <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      );
    }

    // Active badge
    return (
      <div className="rounded-2xl overflow-hidden border border-[#019B5F]/20 shadow-sm shadow-[#019B5F]/5">
        <div className="relative bg-gradient-to-br from-[#071a0f] to-[#0b2216] px-6 py-6 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-60 h-60 rounded-full bg-[#019B5F]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-36 h-36 rounded-full bg-[#019B5F]/8 blur-2xl pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#019B5F]/25 ring-1 ring-[#019B5F]/50 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={BadgeCheckIcon} size={22} color="#4ade80" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-semibold text-white">Premium</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#019B5F] text-white uppercase tracking-wider">Active</span>
                </div>
                {premiumExpiresAt && (
                  <p className="text-xs text-white/40">
                    Valid until {new Date(premiumExpiresAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
            {daysUntilExpiry !== null && (
              <div className="text-right shrink-0">
                <p className="text-3xl font-bold text-white leading-none">{daysUntilExpiry}</p>
                <p className="text-[10px] text-white/35 mt-1 uppercase tracking-wide">days left</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white px-6 py-4">
          {pvConfirm && <Notice msg={pvConfirm.msg} isError={pvConfirm.isError} />}
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">Auto-renewal</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {autoRenewEnabled
                  ? `Renews automatically at ${formatNaira(monthlyAmount)}/mo`
                  : hasSavedPaymentMethod
                    ? 'Enable to renew automatically each month'
                    : 'Pay with a reusable card to unlock auto-renewal'}
              </p>
            </div>
            <Toggle
              enabled={autoRenewEnabled}
              onChange={pvToggleAutoRenew}
              disabled={pvAutoRenewLoading || (!autoRenewEnabled && !hasSavedPaymentMethod)}
            />
          </div>
          {pvAutoRenewError && <p className="text-xs text-red-500 mt-2">{pvAutoRenewError}</p>}
        </div>
      </div>
    );
  };

  // ── Business section UI ────────────────────────────────────────────────

  const renderBiz = () => {
    if (bizLoading) return <Skeleton />;
    if (bizError) return <div className="bg-white rounded-2xl border border-red-100 p-5 text-sm text-red-500">{bizError}</div>;

    const fileListUI = (
      docFiles.length > 0 ? (
        <div className="space-y-2">
          {docFiles.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
              <HugeiconsIcon icon={Attachment01Icon} size={15} color="#9ca3af" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
              </div>
              <button type="button" onClick={() => removeFile(i)} className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <HugeiconsIcon icon={Cancel01Icon} size={12} color="currentColor" strokeWidth={2.5} />
              </button>
            </div>
          ))}
          {docFiles.length < 5 && (
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <HugeiconsIcon icon={Add01Icon} size={14} color="currentColor" strokeWidth={2.5} />
              Add more files
            </button>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#019B5F]/40 hover:bg-[#019B5F]/3 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#019B5F]/8 flex items-center justify-center transition-colors">
            <HugeiconsIcon icon={Attachment01Icon} size={20} color="currentColor" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Click to upload documents</p>
            <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG · up to 5 files</p>
          </div>
        </button>
      )
    );

    // ── Steps indicator ──
    const BizSteps = ({ current }: { current: number }) => {
      const steps = ['Payment', 'Documents', 'Review', 'Decision'];
      return (
        <div className="flex items-start mb-5">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i < current ? 'bg-[#019B5F] text-white' : i === current ? 'border-2 border-[#019B5F] text-[#019B5F] bg-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < current
                    ? <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color="white" strokeWidth={3} />
                    : <span>{i + 1}</span>}
                </div>
                <span className={`text-[10px] leading-none font-medium ${i === current ? 'text-gray-700' : i < current ? 'text-[#019B5F]' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 ${i < current ? 'bg-[#019B5F]/40' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>
      );
    };

    if (user?.businessVerified || user?.isVerified || biz?.status === 'approved') {
      return (
        <div className="rounded-2xl overflow-hidden border border-amber-900/20 shadow-sm shadow-amber-900/5">
          <div className="relative bg-gradient-to-br from-[#1a1000] to-[#120c00] px-6 py-6 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/15 ring-1 ring-amber-400/30 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Building04Icon} size={22} color="#fbbf24" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-semibold text-white">Verified badge</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#019B5F] text-white uppercase tracking-wider">Approved</span>
                </div>
                {biz?.businessName
                  ? <p className="text-xs text-white/40">{biz.businessName}</p>
                  : <p className="text-xs text-white/30">Business identity confirmed</p>
                }
              </div>
            </div>
          </div>
          <div className="bg-white px-6 py-5">
            <p className="text-sm text-gray-500 leading-relaxed">
              Your verified badge is active. It is displayed on your profile and service listings to build customer trust.
            </p>
          </div>
        </div>
      );
    }

    if (biz?.status === 'pending_review') {
      return (
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          <div className="relative bg-gradient-to-br from-[#0e0d0b] to-[#141210] px-6 py-6 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/12 ring-1 ring-amber-400/20 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Clock02Icon} size={22} color="#fbbf24" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-semibold text-white">Under Review</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/70 text-white uppercase tracking-wider">Reviewing</span>
                </div>
                {biz.businessName
                  ? <p className="text-xs text-white/40">{biz.businessName}</p>
                  : <p className="text-xs text-white/30">Documents submitted</p>
                }
              </div>
            </div>
          </div>
          <div className="bg-white px-6 py-5">
            <BizSteps current={2} />
            <p className="text-sm text-gray-500 leading-relaxed">
              Your documents are being reviewed. This usually takes 1 to 3 business days. You will be notified once a decision is made.
            </p>
          </div>
        </div>
      );
    }

    if (biz?.status === 'awaiting_documents') {
      return (
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          <div className="relative bg-gradient-to-br from-[#080f1c] to-[#0a1220] px-6 py-6 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 ring-1 ring-blue-400/25 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Attachment01Icon} size={22} color="#60a5fa" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-semibold text-white">Upload Documents</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500 text-white uppercase tracking-wider">Step 2</span>
                </div>
                <p className="text-xs text-white/40">Payment confirmed · Submit documents to continue</p>
              </div>
            </div>
          </div>
          <div className="bg-white px-6 py-5">
            {bizConfirm && <Notice msg={bizConfirm.msg} isError={bizConfirm.isError} />}
            <BizSteps current={1} />
            <form onSubmit={submitDocs} className="space-y-4">
              <div>
                <label className="auth-label">Business name</label>
                <input required name="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. John's Plumbing Ltd" className="auth-input" />
              </div>
              <div>
                <label className="auth-label">Documents (CAC, registration certificate, etc.)</label>
                {fileListUI}
              </div>
              {submitError && <p className="text-sm text-red-500">{submitError}</p>}
              <button type="submit" disabled={submitLoading} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#019B5F] text-white text-sm font-semibold hover:bg-[#017a4c] transition-colors disabled:opacity-60">
                {submitLoading ? 'Submitting…' : 'Submit documents'}
                {!submitLoading && <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" strokeWidth={2.5} />}
              </button>
            </form>
          </div>
        </div>
      );
    }

    // null / awaiting_payment / rejected
    return (
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="relative bg-[#100e08] px-6 pt-7 pb-6 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 left-8 w-36 h-36 rounded-full bg-amber-500/6 blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/15 ring-1 ring-amber-400/30 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Building04Icon} size={26} color="#fbbf24" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-400/70 uppercase tracking-widest mb-1.5">Business Verification</p>
              <p className="text-[22px] font-bold text-white leading-none tracking-tight">One-time fee</p>
              <p className="text-xs text-white/30 mt-1">Lifetime badge · No renewal required</p>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-5">
          {bizConfirm && <Notice msg={bizConfirm.msg} isError={bizConfirm.isError} />}

          {biz?.status === 'rejected' && biz.adminNote && (
            <div className="flex items-start gap-3 mb-4 px-4 py-3.5 bg-red-50 border border-red-100 rounded-xl">
              <HugeiconsIcon icon={Alert02Icon} size={15} color="#ef4444" strokeWidth={2} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-600 mb-0.5">Application rejected</p>
                <p className="text-sm text-red-500">{biz.adminNote}</p>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {biz?.status === 'rejected'
              ? 'Address the issue above and re-apply to get your Business badge restored.'
              : 'Earn the Business badge by submitting your registration documents. Verified once, active forever.'}
          </p>

          <div className="mb-5">
            {[
              'Business badge on your profile and service listings',
              'Increased trust and credibility with clients',
              'Confirmed business identity on SurePlug',
            ].map((item, i, arr) => (
              <div key={item} className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-5 h-5 rounded-full bg-[#019B5F]/10 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={11} color="#019B5F" strokeWidth={2.5} />
                </div>
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="auth-label">Business name</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. John's Plumbing Ltd"
                className="auth-input"
              />
            </div>
            <div>
              <label className="auth-label">Documents (CAC, registration certificate, etc.)</label>
              {fileListUI}
            </div>
          </div>

          {bizInitError && <p className="text-sm text-red-500 mb-3">{bizInitError}</p>}
          <button
            onClick={bizInit}
            disabled={bizInitLoading || !businessName.trim() || !docFiles.length}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#019B5F] text-white text-sm font-semibold hover:bg-[#017a4c] transition-colors disabled:opacity-60"
          >
            {bizInitLoading ? 'Redirecting…' : biz?.status === 'rejected' ? 'Pay and re-apply' : 'Pay verification fee'}
            {!bizInitLoading && <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────

  const pvContent = renderPv();

  return (
    <div className="max-w-2xl space-y-8">
      <input ref={fileRef} type="file" multiple accept="image/*,.pdf,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={handleFileSelect} />

      {pvContent && (
        <section>
          <h2 className="text-[15px] font-semibold text-gray-900 mb-3">Premium subscription</h2>
          {pvContent}
        </section>
      )}

      <section>
        <h2 className="text-[15px] font-semibold text-gray-900 mb-3">Business Verification</h2>
        {renderBiz()}
      </section>

    </div>
  );
}
