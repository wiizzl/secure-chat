"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { api } from "@/lib/api";

import { useUsername } from "@/hooks/use-username";

type MessageInputProps = {
  roomId: string;
};

const MessageInput = (props: MessageInputProps) => {
  const { username } = useUsername();

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await api.messages.post(
        {
          sender: username,
          text: text,
        },
        { query: { roomId: props.roomId } }
      );
    },
  });

  const sendInput = () => {
    sendMessage({ text: input });
    setInput("");
    inputRef.current?.focus();
  };

  return (
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
  );
};

export { MessageInput };
