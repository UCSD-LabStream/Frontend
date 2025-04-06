# Slots Calendar

Author: Ridhi Srikanth

This is a React-based calendar component that allows authenticated users to book, view, and delete time slots for a week, using Firebase as a backend for reading and writing slot data.

---

## File Structure

- `SlotsCalendar.jsx` — Main calendar component.
- `components/Write_slots.js` — Function to write new slots to the database.
- `components/Read.js` — Function to read existing slots from the database.
- `components/DeleteSlots.js` — Function to delete an existing slot from the database.

---

## Features

- Weekly calendar view (Sunday to Saturday, 24 hours each day)
- Book 1-hour time slots
- View all created slots (color-coded)
- Delete future slots that the current user has created
- Auto-refresh deletable slots every minute
- Prevent booking on already reserved slots unless the current user created them

---

## Color Legend

| Color    | Meaning                        |
|----------|--------------------------------|
| Green    | Selected slot for booking      |
| Red      | Booked by another user         |
| Purple   | Booked by you                  |
| White    | Available slot                 |

---

## State Variables

| Variable         | Description                                           |
|------------------|-------------------------------------------------------|
| `selectedTimes`  | Array of user-selected time tuples `[startTime, endTime]` |
| `createdSlots`   | All slots fetched from Firebase                       |
| `myCreatedSlots` | Slots created by the current user                     |
| `deletableSlots` | Subset of `myCreatedSlots` that can still be deleted |

---

## Lifecycle & Effects

### `useEffect` on mount

- Fetches slots from Firebase
- Determines deletable slots based on current time
- Sets a timeout to update deletable slots at the start of the next minute
- Continues updating deletable slots every minute after that

### `useEffect` on `deletableSlots`

- Logs updated deletable slots to the console

---

## Key Functions

### `getDateOfWeek(dayOffset)`

Returns the date string for a specific day of the current week (e.g., Monday, Tuesday).

### `fetchCreatedSlots()`

Fetches all slots from the database, filters them to identify:
- Slots created by the current user
- Slots that are still deletable

---

## How Deletion Works

- A slot can be deleted if its `startTime` is in the future.
- This check is run every minute to keep `deletableSlots` up to date.

