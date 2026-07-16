const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword, generateToken, verifyJWT } = require('../utils/auth');
const { getFileContent, updateFileContent, createFileContent } = require('../utils/github');

// POST /api/register - Rejestracja użytkownika
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username i password są wymagane' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Hasło musi mieć co najmniej 6 znaków' });
    }

    let users = [];
    try {
      const fileData = await getFileContent('data/users.json');
      users = fileData.data;
    } catch (error) {
      // Plik nie istnieje, tworzymy nowy
      users = [];
    }

    // Sprawdź czy użytkownik już istnieje
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Użytkownik już istnieje' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Zapisz na GitHub
    await createFileContent('data/users.json', users, `Add user: ${username}`);

    // Utwórz subskrypcję
    let subscriptions = [];
    try {
      const subData = await getFileContent('data/subscriptions.json');
      subscriptions = subData.data;
    } catch (error) {
      subscriptions = [];
    }

    subscriptions.push({
      userId: newUser.id,
      username,
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dni
      createdAt: new Date().toISOString(),
    });

    await createFileContent('data/subscriptions.json', subscriptions, `Add subscription for: ${username}`);

    res.status(201).json({
      message: 'Rejestracja pomyślna',
      user: { id: newUser.id, username },
    });
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    res.status(500).json({ error: 'Błąd rejestracji' });
  }
});

// POST /api/login - Logowanie użytkownika
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username i password są wymagane' });
    }

    const fileData = await getFileContent('data/users.json');
    const users = fileData.data;

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
    }

    // Pobierz status subskrypcji
    const subData = await getFileContent('data/subscriptions.json');
    const subscription = subData.data.find(s => s.userId === user.id);

    const token = generateToken({ userId: user.id, username });

    res.json({
      message: 'Logowanie pomyślne',
      token,
      user: {
        id: user.id,
        username,
        subscription: subscription || null,
      },
    });
  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({ error: 'Błąd logowania' });
  }
});

module.exports = router;
