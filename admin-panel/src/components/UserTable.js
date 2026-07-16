import React, { useState } from 'react';
import axios from 'axios';
import UserRow from './UserRow';

const UserTable = ({ users, token, onUpdate }) => {
  const [updating, setUpdating] = useState(null);

  const handleToggleSubscription = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setUpdating(userId);

    try {
      await axios.post(
        'http://localhost:5000/api/admin/subscription',
        {
          userId,
          status: newStatus,
          expiresAt:
            newStatus === 'active'
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate();
    } catch (error) {
      console.error('Błąd aktualizacji subskrypcji:', error);
      alert('Błąd aktualizacji subskrypcji');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Data Rejestracji</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Wygasa</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onToggle={() =>
                handleToggleSubscription(user.id, user.subscription?.status || 'inactive')
              }
              isUpdating={updating === user.id}
            />
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">Brak użytkowników</div>
      )}
    </div>
  );
};

export default UserTable;
