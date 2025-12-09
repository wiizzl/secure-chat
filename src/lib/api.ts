import type { Api } from "../../app/api/[[...slugs]]/route";

import { treaty } from "@elysiajs/eden";

const api = treaty<Api>("https://secure-chat-black.vercel.app").api;

export { api };
