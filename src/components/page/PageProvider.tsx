import { ReactNode } from "react";
import PageContext from "./PageContext";

interface PageProviderProps {
  bsky: string;
  children: ReactNode;
}

export default function PageProvider({ children, bsky }: PageProviderProps) {
  return (
    <PageContext.Provider value={{ bsky }}>{children}</PageContext.Provider>
  );
}
