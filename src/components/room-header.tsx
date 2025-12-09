"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";

type RoomHeaderProps = {
  roomId: string;
};

const RoomHeader = (props: RoomHeaderProps) => {
  const router = useRouter();

  const [copyStatus, setCopyStatus] = useState("COPY");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await api.room.delete(null, { query: { roomId: props.roomId } });
    },
  });

  const { data: ttlData } = useQuery({
    queryKey: ["ttl", props.roomId],
    queryFn: async () => {
      const res = await api.room.ttl.get({ query: { roomId: props.roomId } });

      return res.data;
    },
  });

  useEffect(() => {
    const ttl = ttlData?.ttl;

    if (ttl !== undefined) {
      setTimeRemaining(ttl);
    }
  }, [ttlData]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) {
      return;
    }

    if (timeRemaining === 0) {
      router.push("/?destroyed=true");
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, router]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);

    setCopyStatus("COPIED!");

    setTimeout(() => setCopyStatus("COPY"), 1800);
  };

  return (
    <header className="border-b border-zinc-800 p-4 flex flex-col md:flex-row items-end gap-2 md:gap-4 justify-between bg-zinc-900/30">
      <div className="w-full md:w-auto">
        <span className="text-xs text-zinc-500 uppercase">Room ID</span>
        <div className="flex items-center justify-between md:justify-start gap-4 md:gap-2">
          <span className="font-bold text-sm md:text-base text-blue-500 truncate md:max-w-none">{props.roomId}</span>
          <button
            onClick={() => copyLink()}
            className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {copyStatus}
          </button>
        </div>
      </div>
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-4">
          <div className="h-8 w-px bg-zinc-800 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Self-Destruct</span>
            <span
              className={`text-sm font-bold flex items-center gap-2 ${
                timeRemaining === null ? "text-zinc-500" : timeRemaining < 60 ? "text-red-500" : "text-amber-500"
              }`}
            >
              {timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}
            </span>
          </div>
        </div>
        <button
          onClick={() => destroyRoom()}
          className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50 uppercase"
        >
          <span className="group-hover:animate-pulse">🗑️</span>
          Destroy now
        </button>
      </div>
    </header>
  );
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export { RoomHeader };
