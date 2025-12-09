"use client";

import { createRealtime } from "@upstash/realtime/client";

import type { RealtimeEvents } from "@/lib/realtime";

const { useRealtime } = createRealtime<RealtimeEvents>();

export { useRealtime };
