# 🔐 SignUp Component

A React + Firebase component that lets users create an account with email/password and verifies their email before login.

---

## Features

- Email + password registration
- Password confirmation + validation
- Email verification on signup
- Auto sign-out after signup
- Error handling + loading spinner

---

## Tech Stack

- React (Hooks)
- Firebase Auth
- React Router
- MUI for UI

---

## Key Flow

1. User fills in form
2. Passwords must match and be ≥6 chars
3. Creates Firebase user
4. Sends verification email
5. Signs user out
6. Redirects to login after 3s

---

## Firebase Auth Setup

```js
// firebase.js
import { getAuth } from 'firebase/auth';
export const auth = getAuth(app);
```

## Dependencies
```bash
npm install firebase react-router-dom @mui/material
```
