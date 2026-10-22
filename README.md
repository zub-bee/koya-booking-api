# Task 1 — Build a booking API

A clinic needs an API that lets patients book appointment slots, plus a simple web page that uses it: see available slots, book one, and see the confirmation. Build both and deploy them.

The task has five levels. You don't need to finish everything, but do each level properly before moving on.

## Levels

- Level 1: List slots, book one, and look up a booking.
- Level 2: Only requests with your API key get in, and bookings with missing or invalid details are turned away.
- Level 3: Two people can never book the same slot, even at the exact same moment. Bookings can be cancelled.
- Level 4: A retried request never creates a duplicate booking, and a person can page through their bookings.
- Level 5: Stop anyone from spamming bookings.
  The exact endpoints and responses are in the technical spec: koyaacademy.com/assessment-api. Follow it closely.

## Rules

- Use any language, framework, database and host. You can use AI.
- Deploy it at an https URL. Render, Vercel, Supabase and Neon all have free plans, so it shouldn't cost you anything.
- Bookings must still be there on the next request. If you host on serverless functions, use a database.
- After you submit, keep it running and don't change it until we contact you.
