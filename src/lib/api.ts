import { treaty } from "@elysiajs/eden";

import type { Api } from "~/api/[[...slugs]]/route";

export const api = treaty<Api>("https://secure-chat-black.vercel.app").api;
