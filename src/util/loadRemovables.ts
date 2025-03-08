export default function loadRemovables(): string[] | undefined {
  const { search } = window.location;
  const data = new URLSearchParams(search);
  return data.get("removables")?.split(",");
}
