import JSZip from "jszip";
import downloadFile from "downloadfile-js";

export default async function parseZip(file: File, removables: string[]) {
  const loadingZip = await JSZip.loadAsync(file);
  const outputZip = new JSZip();
  const processingList: Promise<undefined>[] = [];
  loadingZip.forEach(async (relativePath, zipEntry) => {
    processingList.push(
      (async () => {
        try {
          const json = JSON.parse(await zipEntry.async("text"));
          removables.forEach((keychainString) => {
            try {
              let pointer = json;
              const keychain = keychainString.split(".");
              keychain.slice(0, -1).forEach((k) => (pointer = pointer[k]));
              delete pointer[keychain.slice(-1)[0]];
            } catch {
              console.warn(
                `Could not remove field ${keychainString} from file ${relativePath} as it was not present.`
              );
            }
          });
          outputZip.file(relativePath, JSON.stringify(json));
        } catch (error: unknown) {
          console.warn(
            `Unable to process file ${relativePath}, adding to output directly.`
          );
          console.error(error);
          outputZip.file(relativePath, await zipEntry.async("text"));
        }
      })()
    );
  });
  await Promise.all(processingList);
  downloadFile(await outputZip.generateAsync({ type: "blob" }), "output.zip");
}
