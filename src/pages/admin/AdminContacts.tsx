import { useCallback, useEffect, useState } from 'react';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminContact } from '../../lib/adminApi';
import Pagination from '../../components/admin/Pagination';
import AdminFilterBar from '../../components/admin/AdminFilterBar';

interface ContactsResponse {
  contacts: AdminContact[];
  pagination: ApiPagination;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await api.get<ApiResponse<ContactsResponse>>(
        `/admin/contacts?${params.toString()}`,
        true
      );
      setContacts(res.data.contacts);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchContacts();
  };

  return (
    <div>
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Search name or email..."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-4 py-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No contacts found.</div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <div key={contact._id}>
                  <button
                    className="w-full text-left px-4 py-4 hover:bg-gray-50/50 transition-colors min-h-[44px]"
                    onClick={() =>
                      setExpandedId(expandedId === contact._id ? null : contact._id)
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-400 break-all">{contact.email}</p>
                      </div>
                      <div className="text-right flex-shrink-0 max-w-[40%]">
                        <p className="text-xs text-gray-400">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate text-right">
                          {contact.message}
                        </p>
                      </div>
                    </div>
                  </button>
                  {expandedId === contact._id && (
                    <div className="px-4 pb-4 bg-gray-50/50">
                      <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">
                          Message
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {contact.message}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {pagination && (
              <Pagination pagination={pagination} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
