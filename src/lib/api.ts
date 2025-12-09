import type { Api } from "../../app/api/[[...slugs]]/route";

import { treaty } from "@elysiajs/eden";

const api = treaty<Api>("secure-chat-black.vercel.app").api;

export { api };
