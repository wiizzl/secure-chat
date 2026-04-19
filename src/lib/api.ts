import { treaty } from "@elysiajs/eden";

import type { Api } from "~/api/[[...slugs]]/route";

export const api = treaty<Api>("http://localhost:3000").api;
