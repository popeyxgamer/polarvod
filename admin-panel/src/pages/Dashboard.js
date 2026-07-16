import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserTable from '../components/UserTable';
import StatCard from '../components/StatCard';

const Dashboard = ({ token, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Błąd pobierania użytkowników');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.subscription?.status === 'active').length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">PolarVOD - Panel Admin</h1>
          <div className="flex gap-4">
            <button
              onClick={fetchUsers}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
              disabled={loading}
            >
              {loading ? 'Odświeżanie...' : '🔄 Odśwież'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Wszyscy użytkownicy" count={totalUsers} color="blue" />
          <StatCard title="Aktywni" count={activeUsers} color="green" />
          <StatCard title="Nieaktywni" count={inactiveUsers} color="red" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        {!loading && <UserTable users={users} token={token} onUpdate={fetchUsers} />}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Ładowanie...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
