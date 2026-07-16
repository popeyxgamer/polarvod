# PolarVOD - System Zarządzania Subskrypcjami

Integrowana platforma z backendem Node.js + Express i panelem administratora React.

## Struktura Projektu

```
polarvod/
├── backend/                # Node.js + Express API
├── admin-panel/            # React + Tailwind admin panel
└── data/                   # GitHub data files (users.json, subscriptions.json)
```

## Wymagania

- Node.js 16+
- npm lub yarn
- GitHub Personal Access Token

## Instalacja

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Uzupełnij zmienne w .env
npm start
```

### Admin Panel

```bash
cd admin-panel
npm install
npm start
```

## Dokumentacja API

### Publiczne Endpointy

- `POST /api/register` - Rejestracja użytkownika
- `POST /api/login` - Logowanie użytkownika

### Admin Endpointy (wymaga JWT)

- `POST /api/admin/login` - Logowanie admina
- `GET /api/admin/users` - Lista użytkowników
- `POST /api/admin/subscription` - Zmiana statusu subskrypcji

## Zmienne Środowiskowe

Ztworz plik `.env` w folderze `backend`:

```
GITHUB_TOKEN=your_token_here
REPO_OWNER=popeyxgamer
REPO_NAME=polarvod
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```
