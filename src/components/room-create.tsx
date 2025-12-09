"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Activity } from "react";

import { ErrorMessage } from "@/components/error-message";

import { api } from "@/lib/api";

import { useRoomStatus } from "@/hooks/use-room-status";
import { useUsername } from "@/hooks/use-username";

const RoomCreate = () => {
  const router = useRouter();
  const { username } = useUsername();
  const { wasDestroyed, errorMessage } = useRoomStatus();

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await api.room.create.post();

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  return (
    <div className="w-full max-w-md space-y-8">
      <Activity mode={wasDestroyed ? "visible" : "hidden"}>
        <ErrorMessage title="Room destroyed" description="All messages were permanently deleted." />
      </Activity>
      <Activity mode={errorMessage === "room-not-found" ? "visible" : "hidden"}>
        <ErrorMessage title="Room not found" description="This room may have expired or never existed." />
      </Activity>
      <Activity mode={errorMessage === "room-full" ? "visible" : "hidden"}>
        <ErrorMessage title="Room full" description="This room is at maximum capacity." />
      </Activity>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-blue-500">&gt;private_chat</h1>
        <p className="text-zinc-500 text-small">A private self-destructing chat room.</p>
      </div>
      <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="flex items-center text-zinc-500">Your Identity</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400">{username}</div>
            </div>
          </div>
          <button
            disabled={username === "loading..."}
            onClick={() => createRoom()}
            className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 disabled:opacity-50 uppercase"
          >
            Create secure room
          </button>
        </div>
      </div>
    </div>
  );
};

export { RoomCreate };
