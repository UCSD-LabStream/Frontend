# Student Lab Booking

Author: Ridhi Srikanth

## Purpose
Component for booking lab time slots using React and Material UI.

## Key Features
- Fetches and displays time slots from backend.
- Allows primary and additional email entries.
- Selects and confirms a single time slot.
- Submits booking data to backend.

## Structure
- **Booking.jsx**: Main UI logic
- **Read.js**: `readSlots()` - fetches slot data
- **Write.js**: `updateBookingData()` - submits booking info

## State
- `email`: Primary email
- `otherEmail`: Raw input for additional emails
- `otherEmailsList`: Parsed email array
- `selectedSlot`: Currently selected slot
- `slotsData`: Fetched slots
- `error`, `isLoading`: UI states

## Core Logic
- `useEffect`: Fetches slot data on mount
- `handleOtherEmailChange()`: Parses additional emails
- `handleSelect(slot)`: Selects/deselects a slot
- `handleSubmit(e)`: Validates & submits booking

## UI Components
- `TextField`: Email inputs
- `Table`: Displays slots with select button
- `Button`: Confirm booking with loading state

## Behavior
- Only one slot can be selected
- Button disabled unless a slot is selected
- Spinner shown during submission
- Error messages for no slot selected or failed booking

## Dependencies
```bash
npm install @mui/material @emotion/react @emotion/styled
```

## Suggestions
- Add email format validation
- Provide success feedback
- Optionally filter or sort slots

---


