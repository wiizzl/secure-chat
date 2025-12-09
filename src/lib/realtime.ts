import { InferRealtimeEvents, Realtime } from "@upstash/realtime";
import { z } from "zod";

import { db } from "@/lib/db";

const message = z.object({
  id: z.string(),
  sender: z.string(),
  text: z.string(),
  timestamp: z.number(),
  roomId: z.string(),
  token: z.string().optional(),
});

type Message = z.infer<typeof message>;

const schema = {
  chat: {
    message,
    destroy: z.object({
      isDestroyed: z.literal(true),
    }),
  },
};

const realtime = new Realtime({ schema, redis: db });
type RealtimeEvents = InferRealtimeEvents<typeof realtime>;

export { realtime };
export type { Message, RealtimeEvents };
