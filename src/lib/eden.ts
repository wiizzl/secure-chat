import type { App } from "../../app/api/[[...slugs]]/route";

import { treaty } from "@elysiajs/eden";

const api = treaty<App>("localhost:3000").api;

export { api };
