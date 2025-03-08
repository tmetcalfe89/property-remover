import { ReactNode } from "react";
import Footer from "~com/page/Footer";
import Header from "~com/page/Header";
import Main from "~com/page/Main";

import "./Page.scss";
import PageProvider from "./PageProvider";

interface PageProps {
  name: string;
  children: ReactNode;
}

export default function Page({ name, children }: PageProps) {
  return (
    <PageProvider bsky="timinc.us">
      <div id="pico-root">
        <Header name={name} />
        <Main>{children}</Main>
        <Footer />
      </div>
    </PageProvider>
  );
}
