import { useCallback, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminService } from '../../lib/adminApi';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import ServiceDetailModal from '../../components/admin/ServiceDetailModal';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { formatNaira } from '../../lib/format';

interface ServicesResponse {
  services: AdminService[];
  pagination: ApiPagination;
}

export default function AdminServices() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<AdminService | null>(null);
  const [confirm, setConfirm] = useState<{
    title: string; message: string; onConfirm: () => void;
  } | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await api.get<ApiResponse<ServicesResponse>>(
        `/admin/services?${params.toString()}`,
        true
      );
      setServices(res.data.services);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = (service: AdminService) => {
    setConfirm({
      title: 'Delete service',
      message: `Permanently delete "${service.title}"? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await api.delete(`/admin/services/${service._id}`, true);
          setServices((prev) => prev.filter((s) => s._id !== service._id));
        } catch (err) {
          setConfirm({
            title: 'Something went wrong',
            message: err instanceof Error ? err.message : 'Failed to delete service',
            onConfirm: () => setConfirm(null),
          });
        }
      },
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchServices();
  };

  return (
    <div>
      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onDelete={(s) => {
            setSelectedService(null);
            handleDelete(s);
          }}
        />
      )}
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Search services..."
      />

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-red-500">{error}</div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">No services found.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm cursor-pointer active:bg-gray-50 transition-colors"
                onClick={() => setSelectedService(service)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 leading-snug">{service.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {service.provider.firstName} {service.provider.lastName}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(service); }}
                    className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
                    title="Delete service"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={18} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {service.category.name}
                  </span>
                  <StatusBadge status={service.status} />
                  <span className="text-sm font-semibold text-gray-900">{formatNaira(service.price)}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wide">
                    <th className="px-4 py-3 text-left">Service</th>
                    <th className="px-4 py-3 text-left">Plug</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.map((service) => (
                    <tr
                      key={service._id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedService(service)}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 max-w-[180px] truncate">
                          {service.title}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">
                          {service.provider.firstName} {service.provider.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{service.provider.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{service.category.name}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatNaira(service.price)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={service.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(service); }}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete service"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && (
              <Pagination pagination={pagination} onPageChange={setPage} />
            )}
          </div>

          {/* Mobile pagination */}
          <div className="md:hidden">
            {pagination && (
              <div className="bg-white rounded-2xl border border-gray-100 mt-3">
                <Pagination pagination={pagination} onPageChange={setPage} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
