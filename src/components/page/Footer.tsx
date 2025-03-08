import coinJar from "~/assets/coinJar.gif";
import useBskyProfile from "~/hooks/useBskyProfile";
import { useContext } from "react";

import PageContext from "./PageContext";

export default function Footer() {
  const { bsky } = useContext(PageContext);
  const [bskyData, { error: bskyError, isLoading: isLoadingBsky }] =
    useBskyProfile(bsky);
  const { displayName: bskyDisplayName, handle } = bskyData || {};

  return (
    <footer>
      {isLoadingBsky ? (
        <div>⏱</div>
      ) : (
        <div>
          Made with ❤️ by{" "}
          <a href={`https://bsky.app/profile/${handle}`} target="_blank">
            {bskyError ? bsky : bskyDisplayName}
          </a>
        </div>
      )}
      <div>
        <a
          href="https://ko-fi.com/programmingwithtim"
          target="_blank"
          rel="noreferrer"
          data-tooltip="Drop a coin in my coin jar ^^"
        >
          <img src={coinJar} className="logo" />
        </a>
        <span data-tooltip="JK we don't use cookies">🍪</span>
      </div>
    </footer>
  );
}
