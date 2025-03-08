export async function getProfile(actor: string) {
  const response = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${actor}`
  );
  const data = await response.json();
  return data;
}
