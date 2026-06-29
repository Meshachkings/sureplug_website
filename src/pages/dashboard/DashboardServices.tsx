import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Delete02Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  ImageUploadIcon,
  StarIcon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';
import { api, type ApiResponse, type ApiService } from '../../lib/api';
import { formatNaira } from '../../lib/format';
import ConfirmModal from '../../components/admin/ConfirmModal';

interface Category {
  _id: string;
  name: string;
}

const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT',
];

function CreateServicePanel({
  categories,
  onCreate,
}: {
  categories: Category[];
  onCreate: (service: ApiService) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [state, setState] = useState('Lagos');
  const [address, setAddress] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!categoryId) { setError('Please select a category.'); return; }
    setError('');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('price', price);
      form.append('categoryId', categoryId);
      form.append('state', state);
      if (address) form.append('address', address);
      imageFiles.forEach((f) => form.append('images', f));

      const res = await api.post<ApiResponse<ApiService>>('/services', form, true);
      onCreate(res.data);
      setOpen(false);
      setTitle(''); setDescription(''); setPrice(''); setCategoryId('');
      setState('Lagos'); setAddress(''); setImageFiles([]); setImagePreviews([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#019B5F] text-white text-sm font-semibold hover:bg-[#017a4c] transition-colors mb-5"
      >
        <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.5} color="white" />
        Post a service
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-gray-900">New service</h2>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2} color="currentColor" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="auth-label">Service title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Expert Plumbing Repair"
            className="auth-input"
          />
        </div>

        <div>
          <label className="auth-label">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what you offer, your experience, and what customers can expect…"
            className="auth-input resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="auth-label">Price (₦)</label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="5000"
              className="auth-input"
            />
          </div>
          <div>
            <label className="auth-label">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="auth-input"
            >
              {NIGERIA_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="auth-label">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="auth-input"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="auth-label">Address (optional)</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 12 Lekki Phase 1, Lagos"
            className="auth-input"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="auth-label">Photos (up to 5)</label>
          {imagePreviews.length > 0 ? (
            <div className="flex gap-2 flex-wrap mb-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={10} color="white" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors shrink-0"
                >
                  <HugeiconsIcon icon={Add01Icon} size={20} color="currentColor" strokeWidth={2} />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <HugeiconsIcon icon={ImageUploadIcon} size={24} color="currentColor" strokeWidth={1.5} />
              <span className="text-sm">Click to add photos</span>
            </button>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImages}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-pill disabled:opacity-60"
          >
            {loading ? 'Posting…' : 'Post service'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function DashboardServices() {
  const { user } = useAuth();
  const [services, setServices] = useState<ApiService[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ApiService | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const isSeller = user?.role === 'seller';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [catRes, svcRes] = await Promise.all([
        api.get<ApiResponse<{ categories: Category[] }>>('/categories'),
        user?.suretag
          ? api.get<ApiResponse<{ services: ApiService[] }>>(`/services/public?suretag=${user.suretag}&limit=50`)
          : Promise.resolve(null),
      ]);
      setCategories(catRes.data.categories ?? []);
      if (svcRes) setServices(svcRes.data.services ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user?.suretag]);

  useEffect(() => {
    if (isSeller) fetchData();
    else setLoading(false);
  }, [isSeller, fetchData]);

  const handleCreate = (service: ApiService) => {
    setServices((prev) => [service, ...prev]);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await api.delete(`/services/${target._id}`, true);
      setServices((prev) => prev.filter((s) => s._id !== target._id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete service');
    }
  };

  if (!isSeller) {
    return (
      <div className="max-w-lg">
        <div className="bg-gradient-to-br from-[#019B5F]/8 to-[#019B5F]/4 rounded-2xl border border-[#019B5F]/15 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#019B5F]/12 flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon icon={Add01Icon} size={24} color="#019B5F" strokeWidth={2} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Become a plug to post services</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Upgrade your account to start listing services, receiving bookings, and earning on your schedule.
          </p>
          <Link
            to="/become-a-provider"
            className="inline-flex items-center gap-1.5 btn-pill"
          >
            Become a plug
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {deleteTarget && (
        <ConfirmModal
          title="Delete Service"
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {deleteError && (
        <ConfirmModal
          title="Error"
          message={deleteError}
          confirmLabel="OK"
          cancelLabel={false}
          variant="error"
          onConfirm={() => setDeleteError('')}
          onCancel={() => setDeleteError('')}
        />
      )}

      <CreateServicePanel categories={categories} onCreate={handleCreate} />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-red-500">{error}</div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm">You haven't posted any services yet.</p>
          <p className="text-gray-400 text-xs mt-1">Click "Post a service" above to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => {
            const image = service.images?.[0]?.url;
            return (
              <div key={service._id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4">
                {image ? (
                  <img
                    src={image}
                    alt={service.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center">
                    <HugeiconsIcon icon={ImageUploadIcon} size={22} color="#d1d5db" strokeWidth={1.5} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{service.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {service.categoryId?.name} · {service.state}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-sm font-semibold text-gray-900">{formatNaira(service.price)}</span>
                    {service.reviewCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <HugeiconsIcon icon={StarIcon} size={11} color="#f59e0b" strokeWidth={2} />
                        {service.averageRating.toFixed(1)} ({service.reviewCount})
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setDeleteTarget(service)}
                  className="shrink-0 p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} color="currentColor" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
