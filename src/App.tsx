import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import Page from "./components/page/Page";
import parseZip from "./util/parseZip";
import loadRemovables from "./util/loadRemovables";

function App() {
  const [file, setFile] = useState<File>();
  const [removables, setRemovables] = useState<string[]>(
    loadRemovables() || [""]
  );
  const [parsing, setParsing] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const link = useMemo(() => {
    return `${window.location.origin}/?removables=${removables.join(",")}`;
  }, [removables]);

  const handleChange = useCallback((index: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setRemovables((p) => p.map((o, i) => (index === i ? e.target.value : o)));
    };
  }, []);

  const handleAdd = useCallback(() => {
    setRemovables((p) => [...p, ""]);
  }, []);

  const handleRemove = useCallback((index: number) => {
    return () => {
      setRemovables((p) => p.filter((_o, i) => i !== index));
    };
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        setParsing(true);

        if (!file) {
          throw new Error("Please select a file.");
        }
        if (removables.length === 0 || removables.every((e) => !e)) {
          throw new Error("Please enter a removable.");
        }

        await parseZip(file, removables);
      } catch (error: unknown) {
        alert((error as Error).message);
      } finally {
        setParsing(false);
      }
    },
    [file, removables]
  );

  const handleChangeFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    try {
      const handledFile = e.target.files;
      if (handledFile === null) {
        throw new Error("No file selected.");
      }
      if (handledFile.length > 1) {
        throw new Error("Too many files selected.");
      }
      if (!handledFile[0].name.endsWith(".zip")) {
        throw new Error("Must select a zip file.");
      }
      setFile(handledFile[0]);
    } catch (error: unknown) {
      alert((error as Error).message);
    }
  }, []);

  const handleShowShare = useCallback(() => {
    setShowShare(true);
  }, []);

  const handleHideShare = useCallback(() => {
    setShowShare(false);
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }, [link]);

  return (
    <Page name="Property Remover">
      <h3>How to use</h3>
      <p>
        Upload a ZIP with your JSONs. Add a list of properties to remove from
        all JSONs in the zip. Hit the go button.
      </p>
      <h3>How to share</h3>
      <p>
        After you're done, click the share button to get a link to remove the
        same properties.
      </p>

      <form onSubmit={handleSubmit}>
        <h2>File</h2>
        <input type="file" onChange={handleChangeFile} disabled={parsing} />

        <h2>Removables</h2>
        {removables.map((value, index) => (
          <fieldset key={index} role="group">
            <input
              value={value}
              onChange={handleChange(index)}
              disabled={parsing}
            />
            <button
              type="button"
              onClick={handleRemove(index)}
              disabled={parsing}
            >
              -
            </button>
          </fieldset>
        ))}
        <button type="button" onClick={handleAdd} disabled={parsing}>
          +
        </button>

        <fieldset role="group">
          <button disabled={parsing}>Let's Go</button>
          <button className="secondary" type="button" onClick={handleShowShare}>
            Share
          </button>
        </fieldset>
      </form>

      <dialog open={showShare} onClick={handleHideShare}>
        <article onClick={(e) => e.stopPropagation()}>
          <header>
            <button
              aria-label="Close"
              rel="prev"
              onClick={handleHideShare}
            ></button>
            <p>
              <strong>🔗 Here's your link!</strong>
            </p>
          </header>
          <input readOnly value={link} onClick={handleCopyLink} />
          <p style={{ visibility: !copied ? "hidden" : undefined }}>Copied!</p>
        </article>
      </dialog>
    </Page>
  );
}

export default App;
