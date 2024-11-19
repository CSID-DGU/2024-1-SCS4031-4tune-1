"use client";

import { getAccessToken } from "@/utils/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });
}

// Check if we are on the server or client
const isServer = typeof window === "undefined";
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();
  // TODO: 테스트코드 삭제
  console.log(getAccessToken());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
