import { Elysia } from "elysia";
import { z } from "zod";

import { authMiddleware } from "~/api/[[...slugs]]/auth";

import { db } from "@/lib/db";
import { realtime } from "@/lib/realtime";

const ROOM_TTL_SECONDS = 60 * 10;

const rooms = new Elysia({ prefix: "/room" })
  .post("/create", async () => {
    const id = crypto.randomUUID();

    await db.hset(`meta:${id}`, {
      connected: [],
      createdAt: Date.now(),
    });

    await db.expire(`meta:${id}`, ROOM_TTL_SECONDS);

    return { roomId: id };
  })
  .use(authMiddleware)
  .get(
    "/ttl",
    async ({ auth }) => {
      const ttl = await db.ttl(`meta:${auth.roomId}`);

      return { ttl: ttl > 0 ? ttl : 0 };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    },
  )
  .delete(
    "/",
    async ({ auth }) => {
      const roomId = auth.roomId;

      await realtime
        .channel(roomId)
        .emit("chat.destroy", { isDestroyed: true });
      await Promise.all([
        db.del(roomId),
        db.del(`meta:${roomId}`),
        db.del(`messages:${roomId}`),
      ]);
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    },
  );

export { rooms };
