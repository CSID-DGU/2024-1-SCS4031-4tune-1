"use client";

import { getAccessToken } from "@/utils/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

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
  const accessToken = getAccessToken();

  const pathname = usePathname();
  const router = useRouter();

  // 로그인 여부를 검증하여 페이지 렌더링
  useEffect(() => {
    if (
      !accessToken &&
      pathname != "/signin" &&
      pathname !== "/signup" &&
      pathname !== "/"
    ) {
      alert("로그인이 필요합니다.");
      router.push("/signin");
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
