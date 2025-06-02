# Database Design

This document explains the Firebase database structure used for managing booking slots for experiments created by professors and booked by students. It also outlines how the system can be extended to support multiple experiments.

---

## Current Structure

Each experiment has its own **collection** (also referred to as a table), with each **document** representing a booking slot.

### Slot Document Schema

```json
{
  "bookedBy": "test1@ucsd.edu",    // Email of the student who booked the slot (null if not booked)
  "createdBy": "test1@ucsd.edu",   // Email of the professor who created the slot
  "startTime": "2025-05-20T13:00:00Z", // Start time of the slot (timestamp in UTC)
  "endTime": "2025-05-20T14:00:00Z",   // End time of the slot (timestamp in UTC)
  "status": true,                      // Boolean: true if booked, false if available
  "otherEmails": [                     // Optional: other student collaborators (emails)
    "student1@ucsd.edu",
    "student2@ucsd.edu"
  ]
}
```

One slot = One document
One experiment = One collection

## Supporting Multiple Experiments
To support multiple experiments, each experiment should have its own collection named after the experiment.

Example Collection Names
Brewster

Fourier_optics

Each collection will contain documents in the format described above. Collections can be created dynamically based on professor input or a predefined list of experiments.


## Booking Logic Overview
Professors create a slot under a specific experiment collection.

The createdBy field is set to their email.

A student books a slot:

bookedBy is set to the student’s email.

status is set to true.

A slot can be unbooked by clearing bookedBy and setting status to false.

## Notes for Future Developers
Time Format: Use Firestore’s native timestamp type instead of strings.

Scalability: One collection per experiment allows for modular design and avoids conflicts.

Security Rules: Implement Firestore security rules to ensure:

Only students can book available slots.

Only professors can create/delete slots.
