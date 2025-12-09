"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RealtimeProvider } from "@upstash/realtime/client";
import { useState } from "react";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = (props: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <RealtimeProvider>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </RealtimeProvider>
  );
};

export { Providers };
