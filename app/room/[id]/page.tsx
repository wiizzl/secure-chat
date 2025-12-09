import { MessageInput } from "@/components/message-input";
import { MessagesList } from "@/components/messages-list";
import { RoomHeader } from "@/components/room-header";

type RoomPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoomPage(props: RoomPageProps) {
  const { id: roomId } = await props.params;

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <RoomHeader roomId={roomId} />
      <MessagesList roomId={roomId} />
      <MessageInput roomId={roomId} />
    </main>
  );
}
