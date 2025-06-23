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
- Select button is only enabled for available slots
- Error messages for no slot selected or failed booking

## Support for booking multiple experiments

- There is a UI component at the top which gives users a drop down option to select the experiment they want to book
- based on this selection, the correct databse collection for that experiemnt will be accessed

## Dependencies
```bash
npm install @mui/material @emotion/react @emotion/styled
```


