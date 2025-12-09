import { Elysia } from "elysia";
import { z } from "zod";

import { db } from "@/lib/db";
import { type Message, realtime } from "@/lib/realtime";

import { authMiddleware } from "./auth";

const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ auth, body }) => {
      const { roomId, token } = auth;

      const roomExist = await db.exists(`meta:${roomId}`);
      if (!roomExist) {
        throw new Error("Room does not exist.");
      }

      const message: Message = {
        id: crypto.randomUUID(),
        sender: body.sender,
        text: body.text,
        timestamp: Date.now(),
        roomId,
      };

      await db.rpush(`messages:${roomId}`, { ...message, token });
      await realtime.channel(roomId).emit("chat.message", message);

      const remaining = await db.ttl(`meta:${roomId}`);
      await Promise.all([db.expire(`messages:${roomId}`, remaining), db.expire(roomId, remaining)]);
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
      body: z.object({
        sender: z.string().max(100),
        text: z.string().max(1000),
      }),
    }
  )
  .get(
    "/",
    async ({ auth }) => {
      const messages = await db.lrange<Message>(`messages:${auth.roomId}`, 0, -1);

      return {
        messages: messages.map((message) => ({
          ...message,
          token: message.token === auth.token ? auth.token : undefined,
        })),
      };
    },
    {
      query: z.object({ roomId: z.string() }),
    }
  );

export { messages };
