# Dashboard Component

This component serves as the main page for students after logging in. It shows their upcoming experiment bookings and allows lab access during their scheduled time.

---

## Purpose

- Display upcoming bookings for the logged-in student.
- Allow lab access only during the booked time window.

---

## Key Features

### Upcoming Bookings
- Bookings are fetched using `readSlots()`.
- Filters for:
  - Slots booked by the user (`slot.bookedBy === user.email`)
  - Future slots (`slot.startTime > now`)

### Enter Lab Button
- Enabled if current time is between `startTime` and `endTime`.
- Otherwise, a disabled "Lab opens soon" button is shown.
- `setCanAccessLab(true)` is triggered before navigating to the homepage.

---

## Helper Functions

- `fetchData()` – Fetches and filters slot data.
- `isCurrentBooking(start, end)` – Checks if the slot is active.
- `formatDate(timestamp)` – Converts Firestore timestamps to readable strings.

---

## Contexts Used

- `useUser` – Gets current user info.
- `useLabAccess` – Manages lab access state across components.

---

## Note for developers

The enter lab button on the top right corner is only to make it easy to test when developing. This should be removed before releasing the app for students to use in classes. 

