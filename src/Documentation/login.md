# Login Component

A React-based login form using Firebase Authentication and Material UI. It includes email verification, loading state, and redirection upon successful login.

---

## Features

- User login with email & password
- Email verification check (must be verified to proceed)
- Auto-redirect to homepage after login
- Error handling and loading spinner
- Uses global `UserContext` to store user state

---

## How It Works

- Uses `useState` for tracking email, password, loading, and errors.
- `handleLogin()` is triggered on form submit:
  - Uses `signInWithEmailAndPassword()` from Firebase.
  - Checks if the email is verified:
    - If not, logs out immediately with `signOut()` and shows an error.
  - On success: sets global user state via `useUser()` and redirects to home (`'/'`).

---

## Key Code

```js
signInWithEmailAndPassword(auth, email, password);
signOut(auth); // if email not verified
setUser(user); // saves user globally
navigate('/'); // go to homepage
```
