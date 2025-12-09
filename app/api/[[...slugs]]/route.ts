import { Elysia } from "elysia";

import { messages } from "./messages";
import { rooms } from "./rooms";

const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

type Api = typeof app;

const GET = app.fetch;
const POST = app.fetch;
const DELETE = app.fetch;

export { DELETE, GET, POST };
export type { Api };
