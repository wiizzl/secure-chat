import { Elysia } from "elysia";

import { env } from "@/lib/env";
import { messages } from "./messages";
import { rooms } from "./rooms";

const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

type Api = typeof app;
const apiUrl = env.NEXT_PUBLIC_APP_URL;

const GET = app.fetch;
const POST = app.fetch;
const DELETE = app.fetch;

export { apiUrl, DELETE, GET, POST };
export type { Api };
