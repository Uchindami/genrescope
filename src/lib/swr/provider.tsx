import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { createFetcher } from "@/lib/api/fetcher";
import { swrConfig } from "./config";

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        ...swrConfig,
        fetcher: createFetcher(), // Default fetcher with auth
      }}
    >
      {children}
    </SWRConfig>
  );
}
