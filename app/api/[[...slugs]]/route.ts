import cors from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "@/lib/env";

import { messages } from "./messages";
import { rooms } from "./rooms";

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: env.NEXT_PUBLIC_APP_URL,
    })
  )
  .use(rooms)
  .use(messages);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;
