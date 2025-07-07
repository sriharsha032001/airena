# Task: Implement Expiring Context Memory for User Sessions

## Purpose:
- Store each user's chat or sequence context for up to 1 hour from last interaction.
- After 1 hour of inactivity, automatically delete/ignore their context.
- Ensures efficient use of DB/memory and respects user privacy.

## Requirements:

1. **Session Data Structure**
   - Store per-user session context (chat history, sequence, etc.) in a fast-access store:
     - Options: Redis (best) or in-memory Map (for simple deployments).

2. **Auto-Expiry Logic**
   - Each session/context record must have a `last_active` timestamp.
   - On every new request:
     - If `now - last_active > 1 hour`, clear that user's session/context before processing.
     - Else, use current context as input to AI and update `last_active`.

3. **How To Use**
   - When user sends a query, fetch context.
   - If context exists and is not expired, include it in the AI prompt.
   - If expired, start fresh context.
   - After responding, update `last_active` and store new context.

4. **Storage Options**
   - **Best:** Use Redis with TTL for automatic expiry (`set key value EX 3600`).
   - **Alternative:** Store in DB with `last_active` and run cleanup job every hour.
   - **Fallback:** In-memory JS object if on a single-server setup.

5. **Privacy/Security**
   - No sensitive data should persist after expiry.

## Example (Pseudocode):
