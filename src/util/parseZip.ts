import JSZip from "jszip";
import downloadFile from "downloadfile-js";

export default async function parseZip(file: File, removables: string[]) {
  const loadingZip = await JSZip.loadAsync(file);
  const outputZip = new JSZip();
  const processingList: Promise<undefined>[] = [];
  loadingZip.forEach(async (relativePath, zipEntry) => {
    processingList.push(
      (async () => {
        if (!relativePath.endsWith(".json")) {
          outputZip.file(relativePath, await zipEntry.async("text"));
          return;
        }
        const json = JSON.parse(await zipEntry.async("text"));
        removables.forEach((keychainString) => {
          let pointer = json;
          const keychain = keychainString.split(".");
          keychain.slice(0, -1).forEach((k) => (pointer = pointer[k]));
          delete pointer[keychain.slice(-1)[0]];
        });
        outputZip.file(relativePath, JSON.stringify(json));
      })()
    );
    console.log(relativePath, zipEntry, await zipEntry.async("text"));
  });
  await Promise.all(processingList);
  downloadFile(await outputZip.generateAsync({ type: "blob" }), "output.zip");
}
