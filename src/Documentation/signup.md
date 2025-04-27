# SignUp Component

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

## How It Works


- Uses `useState` to track form input and state (`email`, `password`, `confirmPassword`, `error`, `isLoading`)
- On form submit:
  - Checks if passwords match and meet length requirement
  - Uses `createUserWithEmailAndPassword()` to register user
  - Calls `sendEmailVerification()` to trigger a verification email
  - Immediately signs out user with `signOut()`
  - Redirects to `/splashscreen/Login` after a short delay
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
