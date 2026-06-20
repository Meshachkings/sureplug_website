import { useState } from 'react';
import { api, type ApiResponse } from '../../lib/adminApi';

export default function AdminNotifications() {
  const [message, setMessage] = useState('');
  const [userIds, setUserIds] = useState('');
  const [broadcast, setBroadcast] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      const body: { message: string; userIds?: string[] } = { message: message.trim() };

      if (!broadcast && userIds.trim()) {
        body.userIds = userIds
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
      }

      await api.post<ApiResponse<unknown>>('/admin/notifications/broadcast', body, true);
      setFeedback({ type: 'success', text: 'Notification sent successfully.' });
      setMessage('');
      setUserIds('');
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to send notification',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Broadcast notification</h2>
        <p className="text-sm text-gray-500 mb-6">
          Send a push notification to all users or specific users.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              placeholder="Enter your notification message..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-mint/30 focus:border-mint resize-none"
            />
          </div>

          {/* Recipient toggle */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Recipients</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setBroadcast(true)}
                className={`flex-1 py-2.5 text-sm rounded-xl border font-medium transition-colors min-h-[44px] ${
                  broadcast
                    ? 'bg-mint text-white border-mint'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                All users
              </button>
              <button
                type="button"
                onClick={() => setBroadcast(false)}
                className={`flex-1 py-2.5 text-sm rounded-xl border font-medium transition-colors min-h-[44px] ${
                  !broadcast
                    ? 'bg-mint text-white border-mint'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Specific users
              </button>
            </div>
          </div>

          {/* User IDs input */}
          {!broadcast && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                User IDs
                <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
              </label>
              <textarea
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                rows={3}
                placeholder="userId1, userId2, userId3..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-mint/30 focus:border-mint resize-none font-mono"
              />
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`px-4 py-3 rounded-xl text-sm ${
                feedback.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full py-3 text-sm font-semibold bg-mint text-white rounded-xl hover:bg-mint-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? 'Sending…' : 'Send notification'}
          </button>
        </form>
      </div>
    </div>
  );
}
