"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Activity } from "react";

import { api } from "@/lib/api";

import { useRealtime } from "@/hooks/use-realtime";
import { useUsername } from "@/hooks/use-username";

type MessagesListProps = {
  roomId: string;
};

const MessagesList = (props: MessagesListProps) => {
  const router = useRouter();
  const { username } = useUsername();

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", props.roomId],
    queryFn: async () => {
      const res = await api.messages.get({
        query: { roomId: props.roomId },
      });

      return res.data;
    },
  });

  useRealtime({
    channels: [props.roomId],
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

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <Activity mode={messages?.messages.length === 0 ? "visible" : "hidden"}>
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-600 text-sm text-center">No messages yet... Start the conversation.</p>
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
  );
};

export { MessagesList };
