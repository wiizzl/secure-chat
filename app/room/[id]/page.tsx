"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Activity, useEffect, useRef, useState } from "react";

import { api } from "@/lib/eden";

import { useRealtime } from "@/hooks/use-realtime";
import { useUsername } from "@/hooks/use-username";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function RoomPage() {
  const { username } = useUsername();
  const router = useRouter();

  const [copyStatus, setCopyStatus] = useState("COPY");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const params = useParams();
  const roomId = params.id as string;

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await api.messages.get({
        query: { roomId },
      });

      return res.data;
    },
  });

  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await api.room.ttl.get({ query: { roomId } });

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

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      switch (event) {
        case "chat.message":
          refetch();
          break;
        case "chat.destroy":
          router.replace("/?destroyed=true");
          break;
        default:
          break;
      }
    },
  });

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);

    setCopyStatus("COPIED!");

    setTimeout(() => setCopyStatus("COPY"), 2000);
  };

  const sendInput = () => {
    sendMessage({ text: input });
    setInput("");
    inputRef.current?.focus();
  };

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await api.messages.post(
        {
          sender: username,
          text: text,
        },
        { query: { roomId } }
      );
    },
  });

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await api.room.delete(null, { query: { roomId } });
    },
  });

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Room ID</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-500">{roomId}</span>
              <button
                onClick={copyLink}
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {copyStatus}
              </button>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
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
          <span className="group-hover:animate-pulse">💣</span>
          Destroy now
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Activity mode={messages?.messages.length === 0 ? "visible" : "hidden"}>
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-600 text-sm">No messages yet... Start the conversation.</p>
          </div>
        </Activity>
        {messages?.messages.map((message) => (
          <div className="flex flex-col items-start" key={message.id}>
            <div className="max-w-[80%] group">
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className={`text-xs font-bold uppercase ${
                    message.sender === username ? "text-blue-500" : "text-green-500"
                  }`}
                >
                  {message.sender === username ? "You" : message.sender}
                </span>
                <span className="text-[10px] text-zinc-600">
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(message.timestamp))}
                </span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed break-all">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 animate-pulse">&gt;</span>
            <input
              type="text"
              ref={inputRef}
              onKeyDown={(event) => {
                if (event.key === "Enter" && input.trim()) {
                  sendInput();
                }
              }}
              value={input}
              placeholder="Type message..."
              onChange={(event) => setInput(event.target.value)}
              autoFocus
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
            />
          </div>
          <button
            onClick={() => sendInput()}
            disabled={!input.trim() || isPending}
            type="submit"
            className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
