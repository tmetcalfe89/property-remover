import { createContext } from "react";

interface IPageContext {
  bsky: string | null;
}

const PageContext = createContext<IPageContext>({ bsky: null });

export default PageContext;
