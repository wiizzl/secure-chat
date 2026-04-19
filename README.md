# secure-chat

A secure real-time messaging project.

## Current Architecture

This project is currently hosted on **Vercel**'s serverless infrastructure. To operate optimally in this environment, it relies on Upstash services:

- `@upstash/redis`: Used as a serverless-compatible Redis database.
- `@upstash/realtime`: Used to manage real-time communications and events.

## Migration Plan (Roadmap)

Ultimately, the goal is to move away from relying on Upstash and Vercel serverless to adopt a more native and performant approach. The planned migration includes:

- Replacing `@upstash/redis` with the **native Bun Redis module**.
- Replacing `@upstash/realtime` with direct use of **Elysia WebSockets**.
