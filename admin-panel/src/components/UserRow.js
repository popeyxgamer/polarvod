import React from 'react';

const UserRow = ({ user, onToggle, isUpdating }) => {
  const isActive = user.subscription?.status === 'active';
  const expiresAt = user.subscription?.expiresAt
    ? new Date(user.subscription.expiresAt).toLocaleDateString('pl-PL')
    : 'N/A';
  const createdAt = new Date(user.createdAt).toLocaleDateString('pl-PL');

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{user.username}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{createdAt}</td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${
            isActive ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isActive ? 'Aktywny' : 'Nieaktywny'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{expiresAt}</td>
      <td className="px-6 py-4 text-sm">
        <button
          onClick={onToggle}
          disabled={isUpdating}
          className={`px-3 py-1 rounded-lg font-semibold transition ${
            isActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } disabled:bg-gray-400`}
        >
          {isUpdating ? 'Aktualizowanie...' : isActive ? 'Dezaktywuj' : 'Aktywuj'}
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
