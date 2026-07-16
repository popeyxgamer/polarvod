const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword, generateToken, verifyJWT } = require('../utils/auth');
const { getFileContent, updateFileContent, createFileContent } = require('../utils/github');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// POST /api/admin/login - Logowanie admina
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
    }

    const token = generateToken({ role: 'admin', username });

    res.json({
      message: 'Logowanie pomyślne',
      token,
    });
  } catch (error) {
    console.error('Błąd logowania admina:', error);
    res.status(500).json({ error: 'Błąd logowania' });
  }
});

// GET /api/admin/users - Lista użytkowników z subskrypcjami
router.get('/users', verifyJWT, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Dostęp zabroniony' });
    }

    const usersData = await getFileContent('data/users.json');
    const subscriptionsData = await getFileContent('data/subscriptions.json');

    const users = usersData.data;
    const subscriptions = subscriptionsData.data;

    const usersWithSubscriptions = users.map(user => {
      const subscription = subscriptions.find(s => s.userId === user.id);
      return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        subscription: subscription || {
          status: 'inactive',
          expiresAt: null,
        },
      };
    });

    res.json(usersWithSubscriptions);
  } catch (error) {
    console.error('Błąd pobierania użytkowników:', error);
    res.status(500).json({ error: 'Błąd pobierania użytkowników' });
  }
});

// POST /api/admin/subscription - Zmiana statusu subskrypcji
router.post('/subscription', verifyJWT, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Dostęp zabroniony' });
    }

    const { userId, status, expiresAt } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ error: 'userId i status są wymagane' });
    }

    const subscriptionsData = await getFileContent('data/subscriptions.json');
    const subscriptions = subscriptionsData.data;

    const subscriptionIndex = subscriptions.findIndex(s => s.userId === userId);
    if (subscriptionIndex === -1) {
      return res.status(404).json({ error: 'Subskrypcja nie znaleziona' });
    }

    subscriptions[subscriptionIndex].status = status;
    if (expiresAt) {
      subscriptions[subscriptionIndex].expiresAt = expiresAt;
    }
    subscriptions[subscriptionIndex].updatedAt = new Date().toISOString();

    await updateFileContent(
      'data/subscriptions.json',
      subscriptions,
      `Update subscription status for user ${userId}`
    );

    res.json({
      message: 'Status subskrypcji zaktualizowany',
      subscription: subscriptions[subscriptionIndex],
    });
  } catch (error) {
    console.error('Błąd aktualizacji subskrypcji:', error);
    res.status(500).json({ error: 'Błąd aktualizacji subskrypcji' });
  }
});

module.exports = router;
