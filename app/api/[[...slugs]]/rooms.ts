import { Elysia } from "elysia";
import { z } from "zod";

import { db } from "@/lib/db";

import { realtime } from "@/lib/realtime";
import { authMiddleware } from "./auth";

const ROOM_TTL_SECONDS = 60 * 10; // 10 minutes

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
    }
  )
  .delete(
    "/",
    async ({ auth }) => {
      const roomId = auth.roomId;

      await Promise.all([db.del(roomId), db.del(`meta:${roomId}`), db.del(`messages:${roomId}`)]);

      await realtime.channel(roomId).emit("chat.destroy", { isDestroyed: true });
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  );

export { rooms };
