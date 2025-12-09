"use client";

import { useSearchParams } from "next/navigation";

const useRoomStatus = () => {
  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const errorMessage = searchParams.get("error");

  return { wasDestroyed, errorMessage };
};

export { useRoomStatus };
